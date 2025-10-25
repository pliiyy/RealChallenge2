import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./components/AuthContext.tsx";
import "@ant-design/v5-patch-for-react-19";
import { App as AntdApp, ConfigProvider } from "antd";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AntdApp>
      <ConfigProvider
        theme={{
          token: {
            fontFamily:
              'Cambria, Cochin, Georgia, Times, "Times New Roman", serif',
          },
        }}
      >
        <AuthProvider>
          <App />
        </AuthProvider>
      </ConfigProvider>
    </AntdApp>
  </StrictMode>
);
