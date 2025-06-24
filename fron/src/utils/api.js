// utils/api.js
//const isLocalhost = window.location.hostname === "10.51.51.15";

//const baseURL = "5000";
// desarrollo local
//const baseURL = "http://10.51.51.15:8643";
//const baseURL = "http://10.250.200.9:8643"; // producción en IIS con tu IP y puerto `${baseURL}/api/${endpoint}`

//const BASE_URL = "http://10.51.51.15:8643/api/";
const BASE_URL = "http://10.250.200.9:8650/api/";

export const fetchData = async (endpoint) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`Error en la petición: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error obteniendo datos de ${endpoint}:`, error);
    throw error;
  }
};

{
  /*
    
    export const fetchData = async (endpoint) => {
  try {
    const response = await fetch(`http://10.250.200.9:8643/api/${endpoint}`);
    if (!response.ok) {
      throw new Error(`Error en la petición: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error obteniendo datos de ${endpoint}:`, error);
    throw error;
  }
};
    
    
    */
}

{
  /* 
    
    export const fetchData = async (endpoint) => {
  try {
    const response = await fetch(`http://localhost:3001/api/${endpoint}`);
    if (!response.ok) {
      throw new Error(`Error en la petición: ${response.status}`);
    }
    return await response.json(); // Devuelve los datos directamente
  } catch (error) {
    console.error(`Error obteniendo datos de ${endpoint}:`, error);
    throw error; // Relanza el error para manejarlo en el componente
  }
};

    
    */
}
