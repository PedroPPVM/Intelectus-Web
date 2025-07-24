namespace Company {
  export interface Entity {
    name: string;
    document: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
    id: string;
    created_at: Date;
    user_ids: string[];
  }
}

namespace CompanyRequest {
  export interface GetById {
    companyId: string;
  }

  export interface CreateBody {
    name: string;
    document: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
    user_ids: string[];
  }

  export interface UpdateById {
    companyId: string;
    body: CreateBody;
  }

  export interface DeleteById {
    companyId: string;
  }
}
