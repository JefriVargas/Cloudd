const API_URL = 'http://balacner-1065788816.us-east-1.elb.amazonaws.com:8000';

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Error al registrar el usuario');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const authenticateUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Error en la autenticación');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


export const fetchGames = async () => {
  try {
    const response = await fetch(`${API_URL}/games`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error('Error al obtener los juegos');
    }

    return data.games;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchGameDetails = async (gameId) => {
  try {
    const response = await fetch(`${API_URL}/games/${gameId}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error('Error al obtener los detalles del juego');
    }

    return data.games;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const assignAchievement = async (userId, achievementId) => {
  try {
    const response = await fetch(`${API_URL}/assign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId, achievementId }),
    });

    if (!response.ok) {
      throw new Error('Error al asignar el logro');
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchUserData = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/user/${userId}`);
    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error('Error al obtener los datos del usuario');
    }

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchGameDetails_more = async (gameId) => {
  try {
    const response = await fetch(`${API_URL}/game/${gameId}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error('Error al obtener los detalles del juego');
    }

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
