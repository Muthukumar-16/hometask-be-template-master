import axios from 'axios';

export const getBestProfession = async (start, end) => {
  const response = await axios.get(`/admin/best-profession?start=${start}&end=${end}`);
  return response.data;
};

export const getBestClients = async (start, end, limit = 2) => {
  const response = await axios.get(`/admin/best-clients?start=${start}&end=${end}&limit=${limit}`);
  return response.data;
};
