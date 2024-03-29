export type IUser = {
  email: string;
  password: string;
  profiles: string[];
  createJWT: () => string;
  comparePasswords: (candidatePassword: string) => Promise<boolean>;
};
