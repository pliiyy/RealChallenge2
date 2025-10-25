import { createContext, useCallback, useEffect, useState } from "react";
import { api } from "./libs";
import type { IUser } from "../IInterfaces";

interface IAuthContext {
  user: IUser | null;
  menus: any[];
  loading: boolean;
  logout: () => void;
}

export const AuthContext = createContext<IAuthContext>({
  user: null,
  menus: [],
  loading: true,
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [menus, setMenus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const { data } = await api.get("/biodata");
      setUser(data.user);
      const parsedMenu = data.menu.map((m: any) => ({
        ...m,
        akses: m.akses.split(","),
      }));
      setMenus(parsedMenu);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = async () => {
    localStorage.removeItem("token");
    setUser(null);
    setMenus([]);
    setLoading(false);
    await api.post("/logout");
    window.location.replace("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) fetchUser();
    else setLoading(false);
  }, [fetchUser]);

  return (
    <AuthContext.Provider value={{ user, menus, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
