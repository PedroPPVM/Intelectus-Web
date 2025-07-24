import api from '../api';

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const response = await api.post('/auth/login', {
      email,
      password,
    });

    return response;
  } catch (error) {
    throw 'Credenciais inválidas';
  }
};

export const getMe = async () => {
  try {
    const response = await api.get('/auth/me');

    return response;
  } catch (error) {
    throw 'Erro ao requisitar dados do usuário';
  }
};
