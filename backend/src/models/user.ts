export interface User {
  id: number;           // changed from string → number
  email: string;
  passwordHash: string;
  createdAt: Date;
}
