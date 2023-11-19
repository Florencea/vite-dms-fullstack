import { BookOutlined, CameraOutlined } from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import { MenuItemType } from "antd/es/menu/hooks/useItems";
import { ReactNode, useEffect } from "react";
import { Title } from "react-head";
import { Outlet, useLocation } from "react-router-dom";
import { SITE_LOGO } from "../constants";
import { Path, useNavigate } from "../router";
import { MENU_WIDTH, NAV_HEIGHT } from "../theme";

const { Header, Content, Sider } = Layout;

/**
 * 約定：具有 itemIcon: "" 才是目錄列表 item，disabled 控制是否在側欄顯示
 *
 * 換言之：disabled: true 就是完全禁止路由跟目錄，disabled: true, 且不存在 itemIcon: ""，就是類似登入這種不需側欄的路由
 */
const menuItems: MenuItemType[] = [
  {
    key: "/albums",
    icon: <BookOutlined />,
    itemIcon: "",
    label: "Albums",
    disabled: false,
  },
  {
    key: "/photos",
    icon: <CameraOutlined />,
    itemIcon: "",
    label: "Photos",
    disabled: false,
  },
  {
    key: "/login",
    label: "Login",
    disabled: true,
  },
];

const SiteTitle = ({ children }: { children?: ReactNode }) => {
  return children ? (
    <Title>
      {children}
      {` - ${import.meta.env.VITE_TITLE}`}
    </Title>
  ) : (
    <Title>{import.meta.env.VITE_TITLE}</Title>
  );
};

export const RootLayout = () => {
  const { token } = theme.useToken();
  const { pathname } = useLocation();
  const to = useNavigate();
  const currentLabel = menuItems.find((item) => item.key === pathname)?.label;
  const disabledKeys = menuItems
    .filter(({ disabled, itemIcon }) => disabled && itemIcon === "")
    .map(({ key }) => key);
  const isCurrentRouteEnabled = !disabledKeys.includes(pathname);
  const isCurrentRouteInMenus = menuItems
    .filter(({ itemIcon }) => itemIcon === "")
    .map((item) => item.key)
    .includes(pathname);
  const disableLayout =
    pathname !== "/" && isCurrentRouteEnabled && !isCurrentRouteInMenus;

  useEffect(() => {
    if (disabledKeys.includes(pathname)) {
      window.location.replace(import.meta.env.VITE_WEB_BASE);
    }
  }, [disabledKeys, pathname]);

  return (
    <>
      <SiteTitle>{currentLabel}</SiteTitle>
      <Layout>
        {disableLayout ? (
          <Content>
            <Outlet />
          </Content>
        ) : (
          <>
            <Header className="sticky top-0 z-10 w-full flex justify-start items-stretch">
              <a
                className="flex justify-center items-center gap-3"
                style={{ color: token.colorText }}
                href={import.meta.env.VITE_WEB_BASE}
                rel="noopener"
              >
                <img src={SITE_LOGO} alt="logo" />
                <h1 className="font-bold text-lg">
                  {import.meta.env.VITE_TITLE}
                </h1>
              </a>
            </Header>
            <Layout>
              <Sider
                className="h-screen fixed top-0 left-0 bottom-0"
                width={MENU_WIDTH}
                style={{ paddingTop: NAV_HEIGHT }}
              >
                <Menu
                  mode="inline"
                  defaultSelectedKeys={[pathname]}
                  items={menuItems.filter(({ disabled }) => !disabled)}
                  onClick={({ key }) => {
                    to(key as Path);
                  }}
                />
              </Sider>
              <Layout
                style={{ marginLeft: MENU_WIDTH, marginTop: NAV_HEIGHT * -1 }}
              >
                <Content>
                  <Outlet />
                </Content>
              </Layout>
            </Layout>
          </>
        )}
      </Layout>
    </>
  );
};
