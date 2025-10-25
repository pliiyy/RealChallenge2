import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Modal,
  notification,
  Row,
  Table,
  Typography,
  type TableProps,
} from "antd";
import type { IMenu, IPagination, IRole, ISelectedData } from "../IInterfaces";
import {
  DeleteFilled,
  EditFilled,
  PlusOutlined,
  SaveFilled,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { api } from "../components/libs";
import { useAccess } from "../components/UseAuth";
import listMenu, { type MenuList } from "../components/ListMenu";
const { Paragraph, Title } = Typography;

export default function Role() {
  const [data, setData] = useState<IRole[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<IPagination>({
    page: 1,
    pageSize: 10,
    total: 0,
    filter: [],
  });
  const [selected, setSelected] = useState<ISelectedData<IRole>>({
    openUpsert: false,
    openDelete: false,
    openProses: false,
    data: undefined,
  });
  const { canWrite, canUpdate, canDelete } = useAccess("/role");

  const getData = async () => {
    setLoading(true);
    try {
      const queries = `?page=${pagination.page}&pageSize=${
        pagination.pageSize
      }${pagination.filter.map((p) => `&${p.key}=${p.value}`)}`;
      const { data } = await api.get(`/role${queries}`);
      setData(
        data.data.map((d: any) => ({
          ...d,
          menu: d.menu.map((dm: any) => ({
            ...dm,
            akses: dm.akses.split(","),
          })),
        }))
      );
      setPagination((prev) => ({
        ...prev,
        total: data.total,
        page: data.current_page,
        pageSize: data.per_page,
      }));
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    const timeout = setTimeout(async () => {
      await getData();
    }, 200);
    return () => clearTimeout(timeout);
  }, [pagination.page, pagination.pageSize, pagination.filter]);

  const columns: TableProps<IRole>["columns"] = [
    {
      title: "NO",
      dataIndex: "no",
      key: "no",
      width: 80,
      align: "center",
      className: "text-center",
      render(value, record, index) {
        return <>{index + 1}</>;
      },
    },
    {
      title: "NAMA ROLE",
      dataIndex: "nama",
      key: "nama",
    },
    {
      title: "IZIN AKSES",
      dataIndex: "akses",
      key: "akses",
      render(value, record, index) {
        return (
          <Paragraph
            ellipsis={{
              rows: 1,
              expandable: "collapsible",
            }}
            style={{ fontSize: 12 }}
          >
            {record.menu.map((m) => (
              <>
                {m.nama} : [{m.akses.join(", ")}]
                <br />
              </>
            ))}
          </Paragraph>
        );
      },
    },
    {
      title: "Aksi",
      key: "action",
      width: 150,
      align: "center",
      render(value, record, index) {
        return (
          <div className="flex justify-center gap-2">
            {canUpdate && (
              <Button
                size="small"
                icon={<EditFilled />}
                type="primary"
                onClick={() =>
                  setSelected({ ...selected, openUpsert: true, data: record })
                }
              ></Button>
            )}
            {canDelete && (
              <Button
                size="small"
                icon={<DeleteFilled />}
                type="primary"
                danger
              ></Button>
            )}
          </div>
        );
      },
    },
  ];
  return (
    <div>
      <Title level={3}>Role Manajemen</Title>
      <Table
        columns={columns}
        loading={loading}
        rowKey="id"
        size="small"
        bordered
        dataSource={data}
        title={() => (
          <div className="flex justify-between items-center">
            {canWrite && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="small"
                onClick={() =>
                  setSelected({
                    ...selected,
                    openUpsert: true,
                    data: undefined,
                  })
                }
              >
                Tambah
              </Button>
            )}
            <div style={{ width: 170 }}>
              <Input.Search
                size="small"
                onChange={(e) => {
                  const filter = pagination.filter.filter(
                    (p) => p.key !== "search"
                  );
                  if (e.target.value) {
                    filter.push({ key: "search", value: e.target.value });
                  }
                  setPagination((prev) => ({ ...prev, filter: filter }));
                }}
              />
            </div>
          </div>
        )}
        pagination={{
          pageSizeOptions: [10, 50, 100, 500, 1000],
          total: pagination.total,
          pageSize: pagination.pageSize,
          current: pagination.page,
          onChange(page, pageSize) {
            setPagination({ ...pagination, page, pageSize });
          },
          size: "small",
        }}
      />
      <TambahEditRole
        open={selected.openUpsert}
        data={selected.data}
        setOpen={(value: boolean) =>
          setSelected({ ...selected, openUpsert: value })
        }
        getData={getData}
        key={selected.data ? selected.data.id : "Tambah Role"}
      />
    </div>
  );
}

const TambahEditRole = ({
  open,
  setOpen,
  data,
  getData,
}: {
  open: boolean;
  setOpen: Function;
  data?: IRole;
  getData: Function;
}) => {
  const [loading, setLoading] = useState(false);
  const [currData, setData] = useState<IRole>(
    data ? { ...data, menu: MergeMenu(defaultMenu, data.menu) } : defaultData
  );

  const handleSubmit = async () => {
    setLoading(true);
    try {
      currData.menu = currData.menu.filter(
        (m) => m.akses && m.akses.length !== 0
      );
      await api({
        method: data ? "put" : "post",
        url: data ? "/role/" + data.id : "/role",
        data: { ...data },
      });
      setOpen(false);
      await getData();
    } catch (err: any) {
      notification.error({
        message: err.response.data.pesan || "Internal Server Error",
      });
    }
    setLoading(false);
  };

  return (
    <div>
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        title={`${data ? "Edit" : "Tambah"} Data Role ${data ? data.nama : ""}`}
        loading={loading}
        width={window.innerWidth > 600 ? "60vw" : "98vw"}
        footer={[]}
      >
        <div className="my-4 mx-2">
          <Form labelCol={{ span: 3 }} onFinish={handleSubmit}>
            <Form.Item label="Nama Role">
              <Input
                value={currData.nama}
                onChange={(e) => setData({ ...currData, nama: e.target.value })}
              />
            </Form.Item>
            <Form.Item className="flex justify-end">
              <Button icon={<SaveFilled />} type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

const defaultMenu = listMenu.map((m) => ({
  nama: m.label,
  id: 0,
  role_id: 0,
  path: m.key,
  akses: [],
}));

function MergeMenu(menuItems: IMenu[], data: IMenu[]) {
  const mergedMenu = menuItems.map((item) => {
    const found = data.find((r) => r.path === item.path);
    return {
      ...item,
      akses: found ? found.akses : [],
    };
  });
  return mergedMenu;
}

const defaultData: IRole = {
  id: 1,
  nama: "",
  menu: defaultMenu,
};
