import { JwtPayload } from "@/types/jwt";
import { jwtDecode } from "jwt-decode";

export const getAuthData = () => {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return {
      username: decoded.sub,
      roles: decoded.roles,
      isAdmin: decoded.roles.includes("ROLE_ADMIN"),
      isWaiter:
        decoded.roles.includes("ROLE_WAITER") ||
        decoded.roles.includes("ROLE_ADMIN"),
    };
  } catch (error) {
    return null;
  }
};
