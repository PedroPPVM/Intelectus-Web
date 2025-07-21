import api from "../api";

export const login = async ({email, password}: {email: string, password: string}) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      return response
    } catch (error) {
      console.error('Erro no login', error);
      alert('Credenciais inválidas');
    }
  };

export const getMe = async () => {
    try {
      const response = await api.get('/auth/me');

      return response
    } catch (error) {
      console.error('Erro ao requisitar dados do usuário', error);
      alert('Erro ao requisitar dados do usuário');
    }
  };
