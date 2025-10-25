import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export const useAuth = () => useContext(AuthContext);

export function useAccess(path: string) {
  const { menus } = useAuth();
  const menu = menus.find((m) => m.path === path);
  if (!menu)
    return {
      canWrite: false,
      canUpdate: false,
      canDelete: false,
      canProses: false,
    };

  return {
    canWrite: menu.akses.includes("tambah"),
    canUpdate: menu.akses.includes("edit"),
    canDelete: menu.akses.includes("hapus"),
    canProses: menu.akses.includes("proses"),
  };
}
