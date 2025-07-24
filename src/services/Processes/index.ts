import api from '../api';

export const getProcesses = async ({
  companyId,
  processType,
}: ProcessRequest.GetByCompanyId) => {
  try {
    const response = await api.get<Process.Entity[]>(
      `companies/${companyId}/processes?process_type=${processType}`,
    );

    return response;
  } catch (error) {
    throw 'Erro ao requisitar processos.';
  }
};

export const getProcessById = async ({
  companyId,
  processId,
}: ProcessRequest.GetById) => {
  try {
    const response = await api.get<Process.Entity>(
      `companies/${companyId}/processes/${processId}`,
    );

    return response;
  } catch (error) {
    throw 'Erro ao requisitar processo.';
  }
};

export const createProcess = async ({
  companyId,
  body,
}: ProcessRequest.CreatePayload) => {
  try {
    const response = await api.post<Process.Entity>(
      `/companies/${companyId}/processes`,
      body,
    );

    return response;
  } catch (error) {
    throw 'Erro ao criar processo.';
  }
};

export const updateProcess = async ({
  companyId,
  body,
  processId,
}: ProcessRequest.UpdatePayload) => {
  try {
    const response = await api.put<Process.Entity>(
      `/companies/${companyId}/processes/${processId}`,
      body,
    );

    return response;
  } catch (error) {
    throw 'Erro ao atualizar processo.';
  }
};

export const deleteProcess = async ({
  companyId,
  processId,
}: ProcessRequest.DeletePayload) => {
  try {
    const response = await api.delete(
      `/companies/${companyId}/processes/${processId}`,
    );

    return response;
  } catch (error) {
    throw 'Erro ao excluir processo.';
  }
};

export const scrapeStatusByProcess = async ({
  processId,
}: ProcessRequest.ScrapingPayload) => {
  try {
    const response = await api.patch<ProcessResponse.Scraping>(
      `/processes/${processId}/scrape-status`,
    );

    return response;
  } catch (error) {
    throw 'Erro ao realizar leitura da revista.';
  }
};
