import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import ILayout from "./components/ILayout";
import Dashboard from "./pages/Dashboard";
import Role from "./pages/Role";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <ILayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="role" element={<Role />} />
          <Route path="pengguna" element={<>PENGGUNA</>} />
          <Route
            path="*"
            element={
              <div className="text-center text-xl font-bold text-red-500">
                Halaman tidak ditemukan!
              </div>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
