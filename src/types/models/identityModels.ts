import { Role } from "../api";

export interface User {
  id: number;
  username: string;
  password: string;
  is_first_login: string;
  roles: Set<Role>;
}
