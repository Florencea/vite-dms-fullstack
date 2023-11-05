# vite dms fullstack

- A fullstack project
- Frontend: vite + antd + tailwindCSS + generouted + react-query
- Backend: express + prisma + jwt
- API and Type: zod + zodios

## Usage

- Set `JWT_SECRET` in `.env.local` file.
- Development: `npm run dev`
- Build: `npm run build`
- Prodction: `npm start`
- Database migrate: `npm run migrate`

## Feature

- Unified API definition, using same type and type validation in both frontend and backend
- Good DX by Vite in both frontend and backend
- Highly customizable
  - Frontend part is a common SPA site use Vite + React
  - Backend part is a common Express project (in src/server)

## API Type Flow

```text
zod -> zodios -> @zodios/express -> express (with type on controller)
              -> @zodios/openapi -> swagger-ui
              -> @zodios/react   -> @tanstack/react-query (with type on hooks)
```

## Docs

- [Vite](https://vitejs.dev/)
- [Ant Design](https://ant.design/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Generouted](https://github.com/oedotme/generouted)
- [vite-express](https://github.com/szymmis/vite-express)
- [Zodios](https://www.zodios.org/)
- [Zod](https://zod.dev/)
