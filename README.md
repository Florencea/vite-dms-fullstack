# Vite DMS

## Env Variables

- Variables prefixed with `VITE_` are [exposed](https://vitejs.dev/guide/env-and-mode.html#env-files) to Vite-processed code
- This template already done [IntelliSense for TypeScript](https://vitejs.dev/guide/env-and-mode.html#intellisense-for-typescript) and [HTML Env Replacement](https://vitejs.dev/guide/env-and-mode.html#html-env-replacement)

```sh
# Title of the Website
VITE_TITLE="DMS Demo"
# Favicon of Website in /public directory
VITE_FAVICON="vite.svg"
# React root element id
VITE_REACT_ROOT_ID="root"
# Base URL for Deployment
VITE_WEB_BASE="/"
# Backend api prefix for proxy server in development mode
VITE_API_PREFIX="/api"
# PORT in dev/preview mode
PORT=5173
# Theme Primary color
VITE_THEME_PRIMARY="#722ed1"
```

## Tested Environment

- node: `18.18.2`
- npm: `10.2.1`
- macOS: `14.0`
- google chorme: `118.0.5993.96`
- vscode: `1.83.1` with extensions and config:
  - [ESlint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
  - [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
  - [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

```json
{
  "[html][xml][vue][css][less][scss][graphql][json5][javascript][javascriptreact][typescript][typescriptreact][markdown][markdown-math][markdown_latex_combined][juliamarkdown][json][jsonc][yaml]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "css.validate": false,
  "editor.codeActionsOnSave": {
    "source.organizeImports": true
  },
  "editor.formatOnSave": true,
  "editor.quickSuggestions": {
    "strings": true
  }
}
```

## Docs

- [Vite](https://vitejs.dev/)
- [Ant Design](https://ant.design/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Generouted](https://github.com/oedotme/generouted)
- [vite-express](https://github.com/szymmis/vite-express)
