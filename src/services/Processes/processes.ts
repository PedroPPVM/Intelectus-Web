import api from "../api";

export const getProcesses = async ({companyId, processType}: {companyId: string, processType: 'BRAND' | 'PATENT' | 'DESIGN' | 'SOFTWARE'}) => {
    try {
      const response = await api.get(`companies/${companyId}/processes?process_type=${processType}`);

      return response
    } catch (error) {
      alert('Erro ao requisitar processos!');
    }
};

export const createProcess = async ({companyId, process}: Process.ManageProcessBody) => {
    try {
      const response = await api.post(`/companies/${companyId}/processes`, process);

      return response;
    } catch (error) {
      alert('Erro ao criar processo!');
    }
};

export const updateProcess = async ({companyId, process, processId}: Process.ManageProcessBody) => {
    try {
      const response = await api.put(`/companies/${companyId}/processes/${processId}`, process);

      return response;
    } catch (error) {
      alert('Erro ao atualizar processo!');
    }
};

export const deleteProcess = async ({companyId, processId}: {companyId: string, processId: string}) => {
    try {
      const response = await api.delete(`/companies/${companyId}/processes/${processId}`);

      return response;
    } catch (error) {
      alert('Erro ao excluir processo!');
    }
};
