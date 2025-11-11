import api from '../api';

export const createAlert = async ({
  title,
  message,
  alert_type,
  user_id,
  process_id,
}: AlertRequest.CreateAlert) => {
  try {
    const response = await api.post<Alert.Entity>('/alerts', {
      title,
      message,
      alert_type,
      user_id,
      process_id,
    });

    return response;
  } catch {
    throw 'Erro ao criar alerta.';
  }
};

export const getAlerts = async ({
  unread_only,
  alert_type,
}: AlertRequest.GetAlerts) => {
  try {
    const response = await api.get<Alert.Entity[]>('/alerts', {
      params: {
        unread_only,
        alert_type,
      },
    });

    return response;
  } catch {
    throw 'Erro ao requisitar alertas.';
  }
};

export const getAlertsUnreadCount = async () => {
  try {
    const response = await api.get<{ unread_count: number }>(
      '/alerts/unread-count',
    );

    return response.data;
  } catch {
    throw 'Erro ao requisitar contagem de alertas não lidos.';
  }
};

export const updateAlertById = async ({
  alertId,
}: AlertRequest.UpdateAlertById) => {
  try {
    const response = await api.put<Alert.Entity>(`/alerts/${alertId}`);

    return response;
  } catch {
    throw 'Erro ao atualizar alerta.';
  }
};

export const deleteAlertById = async ({
  alertId,
}: AlertRequest.DeleteAlertById) => {
  try {
    const response = await api.delete<void>(`/alerts/${alertId}`);

    return response;
  } catch {
    throw 'Erro ao deletar alerta.';
  }
};

export const markAlertAsRead = async ({
  alertId,
}: AlertRequest.MarkAlertAsRead) => {
  try {
    const response = await api.patch<void>(`/alerts/${alertId}/read`);

    return response;
  } catch {
    throw 'Erro ao marcar alerta como lido.';
  }
};

export const markAlertAsDismissed = async ({
  alertId,
}: AlertRequest.MarkAlertAsDismissed) => {
  try {
    const response = await api.patch<void>(`/alerts/${alertId}/dismiss`);

    return response;
  } catch {
    throw 'Erro ao marcar alerta como descartado.';
  }
};

export const markAllAlertsAsRead = async () => {
  try {
    const response = await api.post<void>(`/alerts/mark-all-read`);

    return response;
  } catch {
    throw 'Erro ao marcar todos os alertas como lidos.';
  }
};

export const getAlertsByProcessId = async ({
  processId,
}: AlertRequest.GetAlertsByProcessId) => {
  try {
    const response = await api.get<Alert.Entity[]>(
      `/alerts/process/${processId}`,
    );

    return response;
  } catch {
    throw 'Erro ao requisitar alertas por processo.';
  }
};
