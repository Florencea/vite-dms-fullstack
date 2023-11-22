import type { Config } from "tailwindcss";

/**
 * 注意，若樣式需同時賦予 tailwindCSS 與 antd
 * 建議在 .env 與 src/vite-env.d.ts 建立 VITE_ 開頭的變數
 * 在 本檔案 使用 process.env.VITE_ 讀取
 * 在 src/theme.ts 使用 import.meta.env.VITE_ 讀取
 * 在編譯時決定樣式較不會出問題
 */
export default {
  important: `#${process.env.VITE_REACT_ROOT_ID}`,
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: `${process.env.VITE_THEME_PRIMARY}`,
      },
    },
  },
  plugins: [],
} satisfies Config;
