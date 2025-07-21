import api from "../api";

export const getCompanies = async () => {
    try {
      const response = await api.get('/companies');

      return response
    } catch (error) {
      alert('Erro ao requisitar empresas!');
    }
  };
