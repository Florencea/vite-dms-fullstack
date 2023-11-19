import {
  App,
  Button,
  DatePicker,
  Descriptions,
  Space,
  Tag,
  version,
} from "antd";
import { SITE_LOGO } from "../../constants";

export default function Index() {
  const { message } = App.useApp();

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-3 text-center">
      <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
        <img
          src={SITE_LOGO}
          className="pointer-events-none h-[20vmin]"
          alt={import.meta.env.VITE_TITLE}
        />
      </a>
      <h1 className="text-3xl font-bold text-primary">Login</h1>
      <Descriptions bordered>
        <Descriptions.Item label="antd">
          <Space>
            <Tag color="processing">{version}</Tag>
            <DatePicker
              onChange={(date) => {
                if (!date) return;
                void message.info(date.toDate().toLocaleString());
              }}
            />
            <Button
              onClick={() => {
                const fetchData = async () => {
                  const res = await fetch("/api/photos?id=1");
                  const data = (await res.json()) as unknown;
                  console.log(data);
                };
                void fetchData();
              }}
            >
              Fetch
            </Button>
          </Space>
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
}
