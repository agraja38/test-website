import type { Role } from "@prisma/client";

export type AuthSession = {
  userId: string;
  email: string;
  role: Role;
  firstName: string;
  lastName: string;
};

export type ApiResult<T> = {
  success: boolean;
  message?: string;
  data?: T;
};
