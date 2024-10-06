from fastapi import FastAPI, HTTPException
import httpx
from pydantic import BaseModel
from middlewares import setup_middlewares
from datetime import date

app = FastAPI()
setup_middlewares(app)


API1_URL = "http://api1:8000"
API2_URL = "http://api2:8002"
API3_URL = "http://app:8003"

class UserCreateRequest(BaseModel):
    username: str
    names: str
    lastnames: str
    email: str
    password: str
    phone_number: str
    age: int
    birthday: date

    def dict(self, **kwargs):
        result = super().dict(**kwargs)
        result['birthday'] = self.birthday.strftime("%Y-%m-%d")
        return result

class UserAuth(BaseModel):
    email: str
    password: str

class GameUpdateRequest(BaseModel):
    name: str
    size: int

class AssignAchievementRequest(BaseModel):
    achievementId: int
    user_id: int


@app.post("/register")
async def create_user(user_data: UserCreateRequest):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(f"{API1_URL}/user/auth/signup", json=user_data.dict())
            response_data = response.json()

            print("..", response)

            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail=response_data)

            return {"success": True, "user": response_data}

        except Exception as e:
            print(e)
            raise HTTPException(status_code=500, detail=f"Error creating user: {str(e)}")

@app.post("/login")
async def login(data: UserAuth):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(f"{API1_URL}/user/auth/login", json=data.dict())
            response_data = response.json()

            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail=response_data)

            return {"success": True, "user": response_data}

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error logging in: {str(e)}")

@app.get("/games")
async def get_games():
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(f"{API2_URL}/games")
            response_data = response.json()

            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail=response_data)

            return {"success": True, "games": response_data["games"]}

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error fetching games: {str(e)}")

@app.get("/games/{game_id}")
async def get_game(game_id: int):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(f"{API2_URL}/games/{game_id}")
            response_data = response.json()

            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail=response_data)

            return {"success": True, "games": response_data["game"]}

        except Exception as e:
            print(e)
            raise HTTPException(status_code=500, detail=f"Error fetching games: {str(e)}")

@app.get("/user/{user_id}")
async def get_user(user_id: int):
    async with httpx.AsyncClient() as client:
        try:
            response_user = await client.get(f"{API1_URL}/user/{user_id}")
            user_data = response_user.json()

            if response_user.status_code != 200:
                raise HTTPException(status_code=response_user.status_code, detail=user_data)

            response_games = await client.get(f"{API2_URL}/games")
            games_data = response_games.json()

            if response_games.status_code != 200:
                raise HTTPException(status_code=response_games.status_code, detail=games_data)

            user_achievements_by_game = {}
            for achievement in user_data['data']['achievements']:
                game_name = achievement['game_name']
                if game_name not in user_achievements_by_game:
                    user_achievements_by_game[game_name] = []
                user_achievements_by_game[game_name].append({
                    "achievement_name": achievement['achievement_name'],
                    "achievement_id": achievement['achievement_id'],
                    "rarity": achievement['rarity']
                })

            user_games = []
            for game in games_data['games']:
                if game['name'] in user_achievements_by_game:
                    user_games.append({
                        "game_name": game['name'],
                        "game_id": game['id'],
                        "achievements": user_achievements_by_game[game['name']]
                    })

            return {
                "success": True,
                "user": {
                    "username": user_data['user']['username'],
                    "email": user_data['user']['email'],
                    "id": user_data['user']['id'],
                    "names": user_data['user']['names'],
                    "lastnames": user_data['user']['lastnames'],
                    "phone_number": user_data['user']['phone_number'],
                    "age": user_data['user']['age'],
                    "birthday": user_data['user']['birthday']
                },
                "data": {
                    "games": user_games
                }
            }

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error fetching user: {str(e)}")


@app.post("/assign")
async def assign_achievement(payload: AssignAchievementRequest):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(f"{API2_URL}/achievements/{payload.achievementId}/assign", json=payload.dict())
            response_data = response.json()

            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail=response_data)

            return {"success": True, "assignment": response_data}

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error assigning achievement: {str(e)}")

@app.get("/game/{game_id}")
async def get_game_details(game_id: int):
    async with httpx.AsyncClient() as client:
        try:
            game_response = await client.get(f"{API2_URL}/games/{game_id}")
            game_data = game_response.json()

            if game_response.status_code != 200 or not game_data['success']:
                raise HTTPException(status_code=game_response.status_code, detail=game_data)

            game = game_data['game']

            companies_response = await client.get(f"{API3_URL}/companies")
            companies_data = companies_response.json()

            if companies_response.status_code != 200 or not companies_data['success']:
                raise HTTPException(status_code=companies_response.status_code, detail=companies_data)

            company_id = None
            for company in companies_data['companys']:
                if str(game_id) in company['published_games']:
                    company_id = company['id']
                    break

            if not company_id:
                raise HTTPException(status_code=404, detail="Company not found for this game")

            company_response = await client.get(f"{API3_URL}/company/{company_id}")
            company_data = company_response.json()

            if company_response.status_code != 200 or not company_data['success']:
                raise HTTPException(status_code=company_response.status_code, detail=company_data)

            company_info = company_data['company']
            published_games_count = len(company_info['published_games'])
            achievements_count = len(game['achievements'])

            company_result = {
                "name": company_info['name'],
                "company_id": company_info['company_id'],
                "registration_date": company_info['registration_date'],
                "email": company_info['email'],
                "RUC": company_info['RUC'],
                "country_origin": company_info['country_origin'],
                "published_games_count": published_games_count
            }

            return {
                "success": True,
                "game": {
                    "company": company_result,
                    "id": game['id'],
                    "name": game['name'],
                    "publicationDate": game['publicationDate'],
                    "category": game['category'],
                    "size": game['size'],
                    "achievements_count": achievements_count,
                    "achievements": [
                        {
                            "id": achievement['id'],
                            "name": achievement['name'],
                            "rarity": achievement['rarity'],
                        }
                        for achievement in game['achievements']
                    ]
                }
            }

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error fetching game details: {str(e)}")
