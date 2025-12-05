
# LoveSpace 网站 - 树莓派部署指南 (DeepSeek 版)

本文档将指导你如何在树莓派上构建并部署“LoveSpace”恋爱纪念日网站，并使用 Cloudflare Tunnel 将其发布到公网。本项目已针对中国内地网络环境优化，使用 DeepSeek API 替代 Google Gemini。

## 准备工作

*   **硬件**: 树莓派 (Raspberry Pi 3B+ 或更佳)，已安装 Raspberry Pi OS。
*   **网络**: 树莓派已连接网络。
*   **域名**: 你拥有的一个域名 (已托管在 Cloudflare)。
*   **DeepSeek API Key**: 访问 [DeepSeek 开放平台](https://platform.deepseek.com/) 注册并申请 API Key。

---

## 第一步：环境配置 (树莓派)

1.  **更新系统**:
    ```bash
    sudo apt update && sudo apt upgrade -y
    ```

2.  **安装 Node.js 和 npm**:
    (建议安装 Node 18 或更高版本)
    ```bash
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
    # 验证安装
    node -v
    npm -v
    ```

3.  **安装 Git**:
    ```bash
    sudo apt install git -y
    ```

---

## 第二步：构建项目

由于浏览器无法直接运行 `.tsx` 代码，我们需要使用构建工具 (Vite) 将其编译为静态网页。

1.  **创建项目脚手架**:
    在树莓派上运行以下命令创建新项目：
    ```bash
    npm create vite@latest lovespace -- --template react-ts
    cd lovespace
    ```

2.  **安装依赖**:
    安装项目所需的库（已移除 Google GenAI，改用原生 fetch）：
    ```bash
    npm install lucide-react date-fns
    ```

3.  **迁移代码**:
    将你现在的代码文件复制到 `lovespace/src` 目录中。
    *   删除 `src/App.css` (我们使用 Tailwind CSS)。
    *   **重要**：如果你之前有 `services/geminiService.ts`，请删除它，并确保使用了新的 `services/aiService.ts`。
    *   确保文件结构如下：
        ```
        lovespace/
        ├── index.html  <-- 需要修改以包含 Tailwind CDN
        ├── package.json
        ├── src/
        │   ├── main.tsx (或者 index.tsx)
        │   ├── App.tsx
        │   ├── types.ts
        │   ├── components/
        │   │   ├── DaysCounter.tsx
        │   │   ├── ...
        │   └── services/
        │       └── aiService.ts  <-- 核心 AI 服务文件
        ```

4.  **修改 `index.html`**:
    确保 `lovespace/index.html` 包含 Tailwind CSS CDN（参考提供的 index.html 代码）。

5.  **配置环境变量 (API Key)**:
    在项目根目录创建 `.env` 文件：
    ```bash
    nano .env
    ```
    输入以下内容（替换为你的 DeepSeek API Key）：
    ```env
    VITE_API_KEY=sk-你的DeepSeekKey
    ```
    *注意：DeepSeek 的 Key 通常以 sk- 开头。*

6.  **编译打包**:
    ```bash
    npm run build
    ```
    构建完成后，会在 `dist` 目录下生成最终的静态文件。

---

## 第三步：本地预览与服务

我们使用一个轻量级的静态文件服务器来运行打包好的网站。

1.  **安装 `serve`**:
    ```bash
    sudo npm install -g serve
    ```

2.  **启动服务**:
    ```bash
    serve -s dist -p 3000
    ```
    现在，通过浏览器访问 `http://树莓派IP:3000` 应该可以看到网站运行。

    *为了让它在后台一直运行，可以使用 `pm2`*:
    ```bash
    sudo npm install -g pm2
    pm2 start serve --name "lovespace" -- -s dist -p 3000
    pm2 save
    pm2 startup
    ```

---

## 第四步：Cloudflare Tunnel 内网穿透

使用 Cloudflare Tunnel (cloudflared) 可以让你无需公网 IP 就能从外网访问树莓派。

1.  **安装 cloudflared**:
    ```bash
    # 下载 cloudflared (以 arm64 为例)
    wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64.deb
    sudo dpkg -i cloudflared-linux-arm64.deb
    ```

2.  **登录 Cloudflare**:
    ```bash
    cloudflared tunnel login
    ```
    这会给出一个 URL，在电脑浏览器打开它并授权你的域名。

3.  **创建隧道**:
    ```bash
    cloudflared tunnel create lovespace
    ```
    记下输出的 Tunnel ID。

4.  **配置路由 (DNS)**:
    将你的域名指向这个隧道。假设你想用 `love.yourdomain.com`：
    ```bash
    cloudflared tunnel route dns lovespace love.yourdomain.com
    ```

5.  **配置隧道文件**:
    创建配置文件：
    ```bash
    mkdir -p ~/.cloudflared
    nano ~/.cloudflared/config.yml
    ```
    写入以下内容 (替换 `<Tunnel-ID>` 为实际 ID)：
    ```yaml
    tunnel: <Tunnel-ID>
    credentials-file: /home/pi/.cloudflared/<Tunnel-ID>.json

    ingress:
      - hostname: love.yourdomain.com
        service: http://localhost:3000
      - service: http_status:404
    ```

6.  **运行隧道**:
    ```bash
    cloudflared tunnel run lovespace
    ```
    或注册为服务后台运行：
    ```bash
    sudo cloudflared service install
    sudo systemctl start cloudflared
    ```

## 完成！
现在通过你的域名即可访问。AI 功能将由 DeepSeek 强力驱动！
