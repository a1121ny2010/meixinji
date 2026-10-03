---
name: github-toolkit
version: 1.0.0
description: GitHub 仓库管理、代码协作与开发工作流自动化工具集
author: 顾言
tags: [GitHub, 代码管理, 协作开发, CI/CD]
---

# GitHub Toolkit - GitHub 完整操作技能

## 功能概述

集成 GitHub 完整 API 能力，让我能直接帮你管理代码仓库、处理 Issues、审查 PR、部署代码，无需手动操作 Git 命令或网页界面。

## 核心能力

### 1. 仓库管理
- **搜索仓库**：按关键词、语言、星标数查找开源项目
- **创建仓库**：快速初始化新项目，支持公开/私有、自动 README
- **Fork 仓库**：一键复刻他人项目到你的账号
- **查看仓库详情**：获取 stars、forks、语言分布、最新提交等信息

### 2. 文件与代码操作
- **读取文件**：查看任意分支、任意路径的文件内容
- **创建/更新文件**：直接在 GitHub 上编辑代码，自动生成 commit
- **批量推送**：一次 commit 推送多个文件，适合大规模重构
- **创建分支**：从任意基准分支创建新的开发分支

### 3. Issues 管理
- **列出 Issues**：按状态（open/closed）、标签、里程碑筛选
- **创建 Issue**：提交 bug 报告或功能请求，支持分配负责人和标签
- **更新 Issue**：修改标题、正文、状态，批量打标签
- **评论 Issue**：参与讨论，@提及其他开发者

### 4. Pull Request 工作流
- **创建 PR**：从功能分支向主分支提交合并请求
- **查看 PR 详情**：获取改动文件列表、diff、评审状态
- **审查代码**：添加行级评论、批准或请求修改
- **合并 PR**：支持 merge、squash、rebase 三种策略
- **更新 PR 分支**：同步最新主分支代码，解决冲突

### 5. 代码搜索与分析
- **搜索代码**：全 GitHub 范围搜索特定代码片段、函数调用
- **搜索 Issues/PRs**：按作者、标签、时间范围精准查找
- **搜索用户**：找到特定领域的活跃开发者

### 6. 提交历史
- **查看提交记录**：分支提交历史、作者、时间线
- **对比版本**：查看两个 commit 之间的差异

## 使用场景

### 场景 1：快速修复线上 Bug
```
你：生产环境发现一个拼写错误，README.md 第 23 行把 "recieve" 改成 "receive"

我：[自动操作]
1. 读取 main 分支的 README.md
2. 定位第 23 行，替换错误单词
3. 创建 commit "fix: correct typo in README"
4. 推送到 main 分支

完成 ✅ 修复已上线
```

### 场景 2：批量重构代码
```
你：把 src 目录下所有 .js 文件的 var 改成 const

我：[自动操作]
1. 用 glob 查找 src/**/*.js
2. 逐个读取并替换 var 声明
3. 创建新分支 refactor/var-to-const
4. 批量推送所有修改文件
5. 创建 PR 并附上改动清单

已创建 PR #42 等待你审查
```

### 场景 3：管理社区贡献
```
你：关闭所有标记为 "won't fix" 的 Issues，加上感谢评论

我：[自动操作]
1. 列出所有 open 状态 + "won't fix" 标签的 Issues
2. 逐个添加评论："感谢反馈，经团队评估暂不纳入计划"
3. 更新状态为 closed

已处理 8 个 Issues
```

### 场景 4：代码审查辅助
```
你：PR #35 有什么改动？帮我看看有没有潜在问题

我：[自动操作]
1. 获取 PR #35 的文件改动列表
2. 读取关键文件的 diff
3. 分析代码逻辑和安全风险
4. 生成审查意见

发现 3 处需要注意：
- api.js 第 45 行缺少错误处理
- config.json 暴露了敏感配置路径
- test 覆盖率下降 12%

要我直接在 PR 里评论吗？
```

## 典型工作流

### 工作流 A：Feature 开发完整流程
```bash
# 1. 创建功能分支
create_branch(repo, branch="feature/user-login", from_branch="main")

# 2. 开发并提交代码
push_files(repo, branch="feature/user-login", files=[...], message="feat: add login")

# 3. 提交 PR
create_pull_request(repo, head="feature/user-login", base="main", title="...")

# 4. CI 通过后合并
merge_pull_request(repo, pull_number=123, merge_method="squash")
```

## 常见问题

**Q: 我没有配置 GitHub Token，你能用吗？**  
A: 不能。需要你提供 Personal Access Token，在你的 GitHub Settings → Developer settings → Personal access tokens 里生成。

**Q: 会不会误删我的代码？**  
A: 放心，所有删除、强制推送等危险操作我都会先问你确认。而且 GitHub 有完整历史记录，随时可以回滚。

**Q: 能管理 GitHub Actions 工作流吗？**  
A: 能读取和触发，但创建/修改 workflow 文件和普通文件一样，用 `create_or_update_file` 即可。

---

**作者**：顾言  
**最后更新**：2026-10-03
