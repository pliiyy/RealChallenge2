import { useEffect, useState } from "react";
import { useAuth } from "../components/UseAuth";
import { Form, Input, Button, Typography, Card, notification } from "antd";
import { LockOutlined, LoginOutlined, UserOutlined } from "@ant-design/icons";
import { api } from "../components/libs";

const { Title } = Typography;

export default function Login() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const { data } = await api.post("/login", { ...values });
      window.localStorage.setItem("token", data.token);
      notification.success({
        message: "Berhasil login. Halaman dialihkan!",
        placement: "bottomRight",
      });
      window.location.replace("/");
    } catch (error: any) {
      notification.error({
        message: error.response.data.pesan || "Internal Server Error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Gambar random dari Pexels (tidak pakai ID supaya selalu valid)
  const randomImage = `https://source.pexels.com/random/900x1200/?login,technology,office`;

  // Proteksi halaman login (redirect jika sudah login)
  useEffect(() => {
    if (user) window.location.replace("/");
  }, [user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linar-to-br from-blue-100 to-blue-500">
      <div className="flex w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden h-[80vh]">
        {/* Bagian kiri: gambar ilustrasi */}
        <div className="hidden md:flex w-1/2 bg-gray-200">
          <img
            src={randomImage}
            alt="Login Illustration"
            className="object-cover w-full h-full"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src =
                "https://images.pexels.com/photos/3184454/pexels-photo-3184454.jpeg?auto=compress&cs=tinysrgb&w=900";
            }}
          />
        </div>

        {/* Bagian kanan: form login */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8">
          <Card className="w-full max-w-md border-none shadow-none">
            <div className="text-center mb-6">
              <Title level={2} className="mb-1">
                Welcome Back
              </Title>
              <p className="text-gray-500">Login to continue to your account</p>
            </div>

            <Form
              name="login"
              layout="vertical"
              onFinish={onFinish}
              requiredMark={false}
            >
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please input your email!" },
                  { type: "email", message: "Email is not valid!" },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Enter your email"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Enter your password"
                  size="large"
                />
              </Form.Item>

              <div className="flex justify-between items-center mb-4">
                <a href="#" className="text-sm text-blue-500 hover:underline">
                  Forgot password?
                </a>
              </div>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  size="large"
                  loading={loading}
                  icon={<LoginOutlined />}
                >
                  Login
                </Button>
              </Form.Item>

              <p className="text-center text-gray-500">
                Don’t have an account?{" "}
                <a href="#" className="text-blue-500 hover:underline">
                  Sign up
                </a>
              </p>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
}
