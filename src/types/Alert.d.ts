declare namespace Alert {
  export interface Entity {
    id: string;
    title: string;
    message: string;
    alert_type: string;
    is_read: boolean;
    is_dismissed: boolean;
    user_id: string;
    process_id: string;
    created_at: Date;
    read_at: Date;
  }
}
