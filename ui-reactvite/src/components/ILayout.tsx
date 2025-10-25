import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, Modal } from "antd";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import listMenu from "./ListMenu";
import type { MenuItemType } from "antd/es/menu/interface";
import { useAuth } from "./UseAuth";

const { Sider, Content, Header } = Layout;

export default function ILayout() {
  const { menus, logout, user } = useAuth();
  const [collapse, setCollapse] = useState(false);
  const [modalLogout, setModalLogout] = useState(false);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsed={collapse}
        onCollapse={(value) => setCollapse(value)}
        style={{ background: "#001529" }}
      >
        <div
          style={{
            color: "white",
            padding: 16,
            fontWeight: "bold",
            textAlign: "center",
            fontSize: collapse ? 14 : 16,
          }}
        >
          {collapse ? "App" : import.meta.env.VITE_APP_NAME || "App"}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          items={
            listMenu.filter((m) => {
              if (m.children) {
                const newM = m.children.filter((mc) =>
                  menus.some((ms) => ms.path === mc.key)
                );
                if (newM.length !== 0) {
                  return { ...m, children: newM };
                }
              } else {
                return menus.some((ms) => ms.path === m.key);
              }
            }) as unknown as MenuItemType[]
          }
          style={{ borderRight: 0 }}
          onClick={(e) => (window.location.href = e.key)}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 16px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
            height: 50,
          }}
        >
          {/* Collapse Button */}
          <div
            style={{ fontSize: 20, cursor: "pointer" }}
            onClick={() => setCollapse(!collapse)}
          >
            {collapse ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </div>

          {/* Right Side (User Info + Logout) */}
          <div className="flex items-center gap-4">
            <span className="font-bold underline">{user?.biodata.nama}</span>
            <Button danger size="small" onClick={() => setModalLogout(true)}>
              <LogoutOutlined />
              Logout
            </Button>
          </div>
        </Header>
        <Content style={{ margin: 16 }}>
          <Outlet />
        </Content>
      </Layout>
      <Logout
        open={modalLogout}
        setOpen={setModalLogout}
        handleLogout={logout}
      />
    </Layout>
  );
}

const Logout = ({
  open,
  setOpen,
  handleLogout,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleLogout: Function;
}) => {
  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      title="Konfirmasi Logout"
      onOk={() => handleLogout()}
    >
      <div className="p-4 my-2">
        <p>
          Lanjutkan untuk logout dari Sistem Informasi Penjadwalan Otomatis?
        </p>
      </div>
    </Modal>
  );
};
