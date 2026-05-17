export interface UserRegisterPayload {
  Full_Name: string;
  Email: string;
  Password: string;
  Phone: string;
  Role: 'User'; 
  Status: number;
}

export interface AdminRegisterPayload {
  Full_Name: string;
  Email: string;
  Password: string;
  Phone: string;
  Role: 'Admin'; 
  Status: number;
}

export interface RegisterResponse {
  message: string;
  userId?: number;
}