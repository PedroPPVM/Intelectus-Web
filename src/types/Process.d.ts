namespace Process {
  export interface Entity {
    id?: string;
    process_number: string;
    title: string;
    status: string;
    depositor: string;
    cnpj_depositor: string;
    cpf_depositor: string;
    attorney: string;
    deposit_date: Date;
    concession_date: Date;
    validity_date: Date;
    company_id: string;
    process_type: string;
  }
}

namespace ProcessRequest {
  export interface GetByCompanyId {
    companyId: string;
    processType: 'BRAND' | 'PATENT' | 'DESIGN' | 'SOFTWARE';
  }

  export interface GetById {
    companyId: string;
    processId: string;
  }

  export interface CreatePayload {
    body: Entity;
    companyId: string;
  }

  export interface UpdatePayload {
    body: Entity;
    companyId: string;
    processId: string;
  }

  export interface DeletePayload {
    companyId: string;
    processId: string;
  }

  export interface ScrapingPayload {
    processId: string;
  }
}

namespace ProcessResponse {
  export interface Scraping {
    response: string;
    status: string;
  }
}
