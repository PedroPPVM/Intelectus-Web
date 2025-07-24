import api from '../api';

export const getCompanies = async () => {
  try {
    const response = await api.get<Company.Entity[]>('/companies');

    return response;
  } catch (error) {
    throw 'Erro ao requisitar empresas.';
  }
};

export const getCompanyById = async ({ companyId }: CompanyRequest.GetById) => {
  try {
    const response = await api.get<Company.Entity>(`/companies/${companyId}`);

    return response;
  } catch (error) {
    throw 'Erro ao requisitar empresa.';
  }
};

export const createCompany = async (body: CompanyRequest.CreateBody) => {
  try {
    const response = await api.post<Company.Entity>('/companies', body);

    return response;
  } catch (error) {
    throw 'Erro ao criar empresa.';
  }
};

export const updateCompany = async ({
  companyId,
  body,
}: CompanyRequest.UpdateById) => {
  try {
    const response = await api.put<Company.Entity>(
      `/companies/${companyId}`,
      body,
    );

    return response;
  } catch (error) {
    throw 'Erro ao atualizar empresa.';
  }
};

export const deleteCompany = async ({
  companyId,
}: CompanyRequest.DeleteById) => {
  try {
    const response = await api.delete(`/companies/${companyId}`);

    return response;
  } catch (error) {
    throw 'Erro ao excluir empresa.';
  }
};
