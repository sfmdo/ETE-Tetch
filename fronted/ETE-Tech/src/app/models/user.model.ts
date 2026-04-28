export interface UserRegisterPayload {
  Full_Name: string;
  Email: string;
  Password: string;
  Phone: string;
  Role: 'User'; // Forzamos que sea 'User' según tu requerimiento
  Status: number;
}

export interface AdminRegisterPayload {
  Full_Name: string;
  Email: string;
  Password: string;
  Phone: string;
  Role: 'Admin'; // Forzamos que sea 'User' según tu requerimiento
  Status: number;
}

export interface RegisterResponse {
  message: string;
  userId?: number;
}