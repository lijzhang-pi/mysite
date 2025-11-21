# 个人网站

这是一个使用纯 HTML、CSS 和 JavaScript 构建的轻量级个人网站。

## 技术栈

- HTML5
- CSS3（响应式设计）
- JavaScript（原生）

## 功能特点

- ✅ 响应式设计，支持移动端、平板和桌面
- ✅ 现代化的UI设计
- ✅ 平滑滚动和动画效果
- ✅ 零构建工具，直接部署

## 项目结构

```
mysite/
├── index.html          # 主页面
├── styles/
│   └── main.css       # 样式文件
├── scripts/
│   └── main.js        # JavaScript交互
├── images/            # 图片资源（如需要）
├── .gitignore
└── README.md
```

## 本地预览

直接用浏览器打开 `index.html` 文件即可预览。

或者使用简单的本地服务器：

```bash
# 使用 Python 3
python -m http.server 8000

# 使用 Python 2
python -m SimpleHTTPServer 8000
```

然后访问 `http://localhost:8000`

## 部署到 GitHub Pages

1. 在 GitHub 创建一个新仓库
2. 推送代码到仓库
3. 在仓库设置中启用 GitHub Pages
4. 选择 `main` 分支作为源
5. 访问 `https://你的用户名.github.io/仓库名/`

## 自定义内容

编辑 `index.html` 文件，修改以下内容：
- 个人信息和介绍
- 项目展示
- 技能列表
- 联系方式

## 许可

MIT License
