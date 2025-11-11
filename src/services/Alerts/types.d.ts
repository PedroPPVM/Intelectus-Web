declare namespace AlertRequest {
  export interface CreateAlert {
    title: string;
    message: string;
    alert_type: string;
    user_id: string;
    process_id: string;
  }

  export interface GetAlerts {
    unread_only?: boolean;
    alert_type?: string;
  }

  export interface UpdateAlertById {
    alertId: string;
  }

  export interface DeleteAlertById {
    alertId: string;
  }

  export interface MarkAlertAsRead {
    alertId: string;
  }

  export interface MarkAlertAsDismissed {
    alertId: string;
  }

  export interface GetAlertsByProcessId {
    processId: string;
  }
}
