import { jwtDecode } from 'jwt-decode';

export const getToken = () => {
  return localStorage.getItem('token');
};

export const setToken = (token) => {
  localStorage.setItem('token', token);
};

export const removeToken = () => {
  localStorage.removeItem('token');
};

export const isTokenValid = (token) => {
  if (!token) return false;
  
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 > Date.now();
  } catch (error) {
    return false;
  }
};

export const getTokenData = (token) => {
  try {
    return jwtDecode(token);
  } catch (error) {
    return null;
  }
};

export const isAuthenticated = () => {
  const token = getToken();
  return token && isTokenValid(token);
};

export const getUserFromToken = () => {
  const token = getToken();
  if (!token) return null;
  
  const tokenData = getTokenData(token);
  return tokenData ? {
    id: tokenData.id,
    role: tokenData.role,
    department: tokenData.department
  } : null;
};