# Web client

- `public/` — 当前线上使用的 React（CDN + htm）静态客户端，由 FastAPI 直接托管
- `src/` — 同构 TypeScript/Vite 源码，便于后续切到完整构建链（`npm install && npm run build`）
