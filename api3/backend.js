const express = require('express');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, GetCommand, ScanCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const PORT = 8003;

const dynamoDbClient = new DynamoDBClient({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN
  }
});
const ddbDocClient = DynamoDBDocumentClient.from(dynamoDbClient);

const COMPANY_TABLE = 'Company';
const COMPANY_DATA_TABLE = 'Company_data';

app.use(bodyParser.json());

async function getMaxCompanyId() {
  const scanParams = {
    TableName: COMPANY_TABLE,
    ProjectionExpression: 'id'
  };

  try {
    const data = await ddbDocClient.send(new ScanCommand(scanParams));
    const ids = data.Items.map(item => parseInt(item.id, 10));
    return ids.length ? Math.max(...ids) : 0;
  } catch (error) {
    console.error('Error scanning for max id:', error);
    throw new Error('Could not scan for max id');
  }
}

app.post('/company', async (req, res) => {
  const { name, registration_date, RUC, email, country_origin } = req.body;

  if (!name || !registration_date || !RUC || !email || !country_origin) {
    return res.status(400).send('Missing required fields');
  }

  try {
    const maxId = await getMaxCompanyId();
    const newId = maxId + 1;

    const companyParams = {
      TableName: COMPANY_TABLE,
      Item: {
        id: newId,
        name: name,
        published_games: []
      }
    };

    const companyDataParams = {
      TableName: COMPANY_DATA_TABLE,
      Item: {
        company_id: newId.toString(),
        registration_date: registration_date,
        RUC: RUC,
        email: email,
        country_origin: country_origin
      }
    };

    await ddbDocClient.send(new PutCommand(companyParams));
    await ddbDocClient.send(new PutCommand(companyDataParams));

    res.status(201).json({
      success: true,
      company: {
        id: newId,
        name: name,
        published_games: []
      }
    });
  } catch (error) {
    console.error('Error creating company:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.get('/company/:id', async (req, res) => {
  const companyId = parseInt(req.params.id, 10);

  try {
    const companyParams = {
      TableName: COMPANY_TABLE,
      Key: { id: companyId }
    };
    const companyData = await ddbDocClient.send(new GetCommand(companyParams));

    if (!companyData.Item) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    const companyDataParams = {
      TableName: COMPANY_DATA_TABLE,
      Key: { company_id: companyId.toString() }
    };
    const companyExtraData = await ddbDocClient.send(new GetCommand(companyDataParams));

    const result = {
      ...companyData.Item,
      ...companyExtraData.Item
    };

    res.json({
      success: true,
      company: result
    });
  } catch (error) {
    console.error('Error getting company data:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.post('/company/:id/addGame', async (req, res) => {
  const companyId = parseInt(req.params.id, 10);
  const { gameId } = req.body;

  if (!gameId) {
    return res.status(400).json({ success: false, message: 'Missing game ID' });
  }

  try {
    const gameValidationResponse = await axios.get(`http://api2:8002/games/${gameId}`);

    if (gameValidationResponse.status !== 200) {
      return res.status(404).json({ success: false, message: 'Game not found' });
    }

    const getCompanyParams = {
      TableName: COMPANY_TABLE,
      Key: { id: companyId }
    };
    const companyData = await ddbDocClient.send(new GetCommand(getCompanyParams));

    if (!companyData.Item) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    const currentPublishedGames = companyData.Item.published_games || [];
    currentPublishedGames.push(gameId.toString());

    const updateParams = {
      TableName: COMPANY_TABLE,
      Key: { id: companyId },
      UpdateExpression: 'SET published_games = :newGamesList',
      ExpressionAttributeValues: {
        ':newGamesList': currentPublishedGames
      }
    };

    await ddbDocClient.send(new UpdateCommand(updateParams));

    res.status(200).json({
      success: true,
      company: {
        id: companyId,
        published_games: currentPublishedGames
      }
    });
  } catch (error) {
    console.error('Error adding game:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.get('/companies', async (req, res) => {
  const params = {
    TableName: COMPANY_TABLE
  };

  try {
    const command = new ScanCommand(params);
    const data = await ddbDocClient.send(command);
    if (data.Items) {
      res.json({
        success: true,
        companys: data.Items
      });
    } else {
      res.status(404).json({ success: false, message: 'No companies found' });
    }
  } catch (error) {
    console.error('Error scanning companies:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.get('/game/:gameId/company', async (req, res) => {
  const gameId = parseInt(req.params.gameId, 10);

  try {
    const scanParams = {
      TableName: COMPANY_TABLE
    };
    
    const data = await ddbDocClient.send(new ScanCommand(scanParams));

    const companyWithGame = data.Items.find(company => company.published_games && company.published_games.includes(gameId));

    if (!companyWithGame) {
      return res.status(404).json({ success: false, message: 'Game not found in any company' });
    }

    res.json({
      success: true,
      company: companyWithGame
    });
  } catch (error) {
    console.error('Error searching for game in companies:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


