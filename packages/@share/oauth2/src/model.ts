export interface AuthorizationRequest {
  client_id: string;
  response_type: string;
  redirect_uri: string;
  code_challenge: string;
  code_challenge_method: string;
  state?: string;
}

export interface TokenRequest {
  grant_type: string;
  code?: string;
  redirect_uri: string;
  code_verifier?: string;
  refresh_token?: string;
}

export interface TokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
}

export interface userLoginInfo {
  username: string;
  password: string;
}

export interface LoginResult {
  code: number;
  success: boolean;
}
