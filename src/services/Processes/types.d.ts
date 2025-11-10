declare namespace ProcessRequest {
  export interface UpdateFromMagazinesPayload {
    companyId: string;
    processType: string;
  }
}

declare namespace ProcessResponse {
  export interface UpdateFromMagazines{
    company_id: string;
    process_type: string;
    total_processes: number;
    updated_processes: number;
    new_magazines: number;
    by_type: Record<string, {
      process_type: string;
      total: number;
      updated: number;
      magazine_created: boolean;
      magazine_identifier: string;
      skipped: null | any;
      message: null | string;
      error: null | string;
    }>;
  }
}