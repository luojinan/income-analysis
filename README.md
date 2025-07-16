# Supabase 最基础增删改查接入指南

## 步骤

1. 安装依赖：

   ```sh
   pnpm add @supabase/supabase-js
   ```

2. 配置Supabase：
   - 打开 [Supabase官网](https://supabase.com/)，新建项目。
   - 获取 `SUPABASE_URL` 和 `SUPABASE_ANON_KEY`，替换 `src/App.tsx` 顶部的常量。
3. 创建表：
   - 在Supabase SQL编辑器执行：

     ```sql
     create table todos (
       id serial primary key,
       task text
     );
     ```

4. 本地开发：

   ```sh
   pnpm dev
   ```

5. 部署到Cloudflare Pages：
   - 直接构建产物，无需特殊配置。
   - 确保环境变量安全，前端仅用anon key。

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
