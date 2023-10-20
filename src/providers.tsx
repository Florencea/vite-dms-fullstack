import { StyleProvider } from "@ant-design/cssinjs";
import { App, ConfigProvider } from "antd";
import zhTW from "antd/es/locale/zh_TW";
import "dayjs/locale/zh-tw";
import { StrictMode } from "react";
import { HeadProvider } from "react-head";
import {
  RouteObject,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
// import NotFound from "./pages/404";
import "./styles/main.css";
import { theme } from "./styles/theme";

interface Props {
  container: HTMLDivElement;
  children: RouteObject[];
}

export const Providers = ({ container, children }: Props) => {
  return (
    <StrictMode>
      <HeadProvider
        headTags={[<title key="title">{import.meta.env.VITE_TITLE}</title>]}
      >
        <ConfigProvider
          getPopupContainer={() => container}
          locale={zhTW}
          theme={theme}
        >
          <StyleProvider hashPriority="high">
            <App>
              <RouterProvider
                router={createBrowserRouter(children, {
                  basename: import.meta.env.VITE_WEB_BASE,
                })}
              />
            </App>
          </StyleProvider>
        </ConfigProvider>
      </HeadProvider>
    </StrictMode>
  );
};
