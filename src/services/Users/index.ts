import api from '../api';

export const getUsers = async () => {
  try {
    const response = await api.get<User.Entity[]>('/users');

    return response;
  } catch {
    throw 'Erro ao requisitar usuários.';
  }
};

export const getUserById = async ({ userId }: UserRequest.GetById) => {
  try {
    const response = await api.get<User.Entity>(`/users/${userId}`);

    return response;
  } catch {
    throw 'Erro ao requisitar usuário.';
  }
};

export const updateUserById = async ({
  userId,
  body,
}: UserRequest.UpdateById) => {
  try {
    const response = await api.put<User.Entity>(`/users/${userId}`, body);

    return response;
  } catch {
    throw 'Erro ao atualizar usuário.';
  }
};

export const deleteUserById = async ({ userId }: UserRequest.DeleteById) => {
  try {
    const response = await api.delete(`/users/${userId}`);

    return response;
  } catch {
    throw 'Erro ao deletar usuário.';
  }
};
