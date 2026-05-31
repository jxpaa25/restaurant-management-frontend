import { JwtPayload } from "@/types/jwt";
import { jwtDecode } from "jwt-decode";

export const getAuthData = () => {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode<JwtPayload>(token);

    // Proveravamo prisustvo svake uloge ponaosob
    const roles = decoded.roles || [];

    return {
      username: decoded.sub,
      roles: roles,
      isAdmin: roles.includes("ROLE_ADMIN"),
      isManager: roles.includes("ROLE_MANAGER"),
      isWaiter: roles.includes("ROLE_WAITER"),
    };
  } catch (error) {
    console.error("Greška pri dekodiranju tokena:", error);
    return null;
  }
};
