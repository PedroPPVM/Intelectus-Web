import api from '../api';

export const login = async ({ email, password }: AuthRequest.Login) => {
  try {
    const response = await api.post<AuthResponse.Login>('/auth/login', {
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
    const response = await api.get<User.Entity>('/auth/me');

    return response;
  } catch (error) {
    throw 'Erro ao requisitar dados do usuário';
  }
};

export const createUser = async (body: AuthRequest.CreateUserBody) => {
  try {
    const response = await api.post<User.Entity[]>('/auth/register', body);

    return response;
  } catch {
    throw 'Erro ao criar usuário.';
  }
};
