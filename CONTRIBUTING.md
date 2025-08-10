# 贡献指南

感谢您对API Key Organizer项目的关注！我们欢迎所有形式的贡献，包括但不限于代码、文档、测试、反馈等。

## 🤝 如何贡献

### 报告问题
如果您发现了bug或有功能建议，请：
1. 在提交Issue前，先搜索是否已有类似问题
2. 使用清晰的标题描述问题
3. 提供详细的复现步骤
4. 包含系统环境信息（浏览器版本、操作系统等）

### 提交代码
1. Fork项目到您的GitHub账户
2. 创建功能分支：`git checkout -b feature/your-feature-name`
3. 提交更改：`git commit -m 'Add some feature'`
4. 推送到分支：`git push origin feature/your-feature-name`
5. 创建Pull Request

### 改进文档
- 修正拼写错误
- 改进说明文档
- 添加使用示例
- 翻译成其他语言

## 🛠️ 开发环境设置

### 前置要求
- Node.js 16+
- Chrome浏览器
- Git

### 本地开发
1. 克隆项目
```bash
git clone https://github.com/your-username/api-key-organizer-extension.git
cd api-key-organizer-extension
```

2. 在Chrome中加载扩展
- 打开 `chrome://extensions/`
- 开启"开发者模式"
- 点击"加载已解压的扩展程序"
- 选择项目文件夹

3. 开发调试
- 修改代码后，在扩展管理页面点击"重新加载"
- 使用Chrome DevTools调试

## 📝 代码规范

### JavaScript规范
- 使用ES6+语法
- 遵循ESLint规则
- 使用有意义的变量和函数名
- 添加适当的注释

### HTML规范
- 使用语义化标签
- 保持结构清晰
- 添加适当的aria标签

### CSS规范
- 使用BEM命名规范
- 保持样式模块化
- 支持响应式设计

### 文件组织
```
├── manifest.json          # 扩展配置
├── background.js          # 后台脚本
├── popup.html            # 弹出窗口
├── sidepanel.html        # 侧边栏
├── standalone.html       # 独立窗口
├── options.html          # 设置页面
├── shared.js             # 共享工具
├── ui.js                 # 界面逻辑
├── styles.css            # 样式文件
└── docs/                 # 文档目录
```

## 🧪 测试指南

### 功能测试
- 测试所有主要功能
- 验证错误处理
- 检查边界情况
- 测试不同浏览器版本

### 兼容性测试
- Chrome 88+ (Manifest V3)
- Edge (Chromium内核)
- 其他基于Chromium的浏览器

### 性能测试
- 检查内存使用
- 验证响应速度
- 测试大数据量处理

## 📋 Pull Request指南

### 提交前检查
- [ ] 代码符合项目规范
- [ ] 添加了必要的测试
- [ ] 更新了相关文档
- [ ] 通过了所有检查

### PR描述模板
```markdown
## 描述
简要描述此PR的更改内容

## 类型
- [ ] Bug修复
- [ ] 新功能
- [ ] 文档更新
- [ ] 重构
- [ ] 其他

## 测试
描述如何测试这些更改

## 截图
如果涉及UI更改，请添加截图

## 检查清单
- [ ] 我的代码遵循项目风格指南
- [ ] 我进行了自我检查
- [ ] 我添加了必要的注释
- [ ] 我更新了相关文档
```

## 🏷️ 版本发布

### 版本号规则
- 主版本号：不兼容的API更改
- 次版本号：向后兼容的功能添加
- 修订号：向后兼容的问题修复

### 发布流程
1. 更新版本号
2. 更新CHANGELOG
3. 创建Git标签
4. 发布到GitHub Releases

## 📞 沟通渠道

### 讨论
- GitHub Discussions: 功能讨论和问题解答
- GitHub Issues: Bug报告和功能请求

### 实时交流
- 项目Wiki: 开发文档和指南
- 邮件列表: 重要通知和讨论

## 🎯 贡献者奖励

### 贡献者名单
所有贡献者都会在以下地方被感谢：
- README.md贡献者部分
- GitHub贡献者页面
- 发布说明

### 特殊贡献
- 重大功能贡献者
- 长期维护贡献者
- 社区建设贡献者

## 📚 学习资源

### 相关技术
- [Chrome Extensions Documentation](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Migration](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Chrome Storage API](https://developer.chrome.com/docs/extensions/reference/storage/)

### 开发工具
- Chrome DevTools
- Chrome Extension Developer Tools
- ESLint和Prettier

---

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者！您的贡献让这个项目变得更好。

如果您有任何问题或需要帮助，请随时联系我们！
