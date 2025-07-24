namespace AuthRequest {
  export interface Login {
    email: string;
    password: string;
  }

  export interface CreateUserBody {
    company_ids: string[];
    email: string;
    full_name: string;
    is_superuser: boolean;
    password: string;
  }
}

namespace AuthResponse {
  export interface Login {
    access_token: string;
    expires_in: number;
    token_type: string;
  }
}
