export interface UserProfile {
  User_ID: number;
  Full_Name: string;
  Email: string;
  Phone: string;
  Role: string;
  Status: number;
}

export interface UpdateProfilePayload {
  Full_Name: string;
  Phone: string;
}

export interface UpdateProfileResponse {
  message: string;
  user: UserProfile;
}