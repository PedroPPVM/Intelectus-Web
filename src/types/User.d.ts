declare namespace User {
  export interface Entity {
    id: string;
    company_ids: string[];
    created_at: Date;
    email: string;
    full_name: string;
    id: string;
    is_active: boolean;
    is_superuser: boolean;
  }
}

declare namespace UserRequest {
  export interface GetById {
    userId: string;
  }

  export interface UpdateById {
    userId: string;
    body: {
      email: string;
      full_name: string;
      password: string;
      is_active: boolean;
      is_superuser: boolean;
      company_ids: string[];
    };
  }

  export interface DeleteById {
    userId: string;
  }
}
