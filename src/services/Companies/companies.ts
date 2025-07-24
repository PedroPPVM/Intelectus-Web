import api from '../api';

export const getCompanies = async () => {
  try {
    const response = await api.get('/companies2');

    return response;
  } catch (error) {
    throw 'Erro ao requisitar empresas.';
  }
};
