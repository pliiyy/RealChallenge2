import { useLocation } from "react-router-dom";
import { useAuth } from "./UseAuth";
import listMenu from "./ListMenu";
import { LoadingOutlined } from "@ant-design/icons";

export default function PrivateRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading, menus } = useAuth();
  // const token = localStorage.getItem("token");
  const location = useLocation();

  // if (!token) return <Navigate to="/login" replace />;

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-blue-600 text-lg font-semibold">
        <LoadingOutlined /> Fetch Data ...
      </div>
    );

  if (
    !menus.some((m) => m.path === location.pathname) &&
    listMenu.some((m) => m.key === location.pathname)
  ) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500 text-xl font-bold">
        Anda tidak memiliki akses ke halaman ini!
      </div>
    );
  }

  return <>{children}</>;
}
