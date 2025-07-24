import api from '../api';

export const getUsers = async () => {
  try {
    const response = await api.get('/users');

    return response;
  } catch {
    throw 'Erro ao requisitar usuários.';
  }
};

export const createUser = async (data: any) => {
  try {
    const response = await api.post('/users', data);

    return response;
  } catch {
    throw 'Erro ao criar usuário.';
  }
};
