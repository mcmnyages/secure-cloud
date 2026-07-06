export interface UserSettings{
    email:string
    name:string
    avatarUrl:string;
}

export interface UpdateUserRequest {
  name: string;
  email: string;
  avatarUrl?: File;
}

export interface UpdateProfileRequest {
  bio: string;
  location: string;
  website: string;
}

/**
 * Replace with the actual fields your backend expects.
 */
export interface UpdateUserSettingsRequest {
  // Example
  theme: 'light' | 'dark';
  notifications: boolean;
}

export interface UpdatePasswordRequest{
  currentPassword: string,
  newPassword: string,
}
