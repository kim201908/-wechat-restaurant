# 《我的中餐厅》v0.1 - 设计规范

## 🎨 配色方案

### 主色调（中国风）

| 颜色 | 色值 | 用途 |
|-----|------|------|
| 中国红 | `#C41E3A` | 主按钮、重要提示、品牌色 |
| 金色 | `#FFD700` | 升级按钮、货币、高亮 |
| 深红 | `#8B0000` | 渐变暗色、边框 |
| 米白 | `#FFF8DC` | 背景、卡片底色 |
| 棕色 | `#8B4513` | 边框、文字 |
| 深棕 | `#5C3317` | 标题文字、强调 |
| 绿色 | `#228B22` | 成功状态、确认按钮 |
| 灰色 | `#696969` | 次要文字、禁用状态 |

### 配色使用原则

```
主按钮 → 中国红渐变（#C41E3A → #8B0000）
金币相关 → 金色渐变（#FFD700 → #DAA520）
成功操作 → 绿色渐变（#228B22 → #006400）
背景 → 米白渐变（#FFF8DC → #FFE4B5）
文字 → 深棕（#5C3317）/ 灰色（#696969）
```

---

## 📝 字体规范

### 字体族

```css
--font-main: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 
             "Helvetica Neue", Arial, sans-serif;
--font-title: "STHeiti", "Microsoft YaHei", sans-serif;
```

### 字号层级

| 层级 | 字号 | 字重 | 用途 |
|-----|------|------|------|
| 超大标题 | 24px | Bold | 页面标题 |
| 大标题 | 18px | Bold | 模块标题 |
| 正文大 | 16px | Normal | 主要内容 |
| 正文 | 14px | Normal | 通用文本 |
| 小字 | 12px | Normal | 说明文字、标签 |
| 微小 | 10px | Normal | 辅助信息 |

### 行高

- 标题：1.2
- 正文：1.5
- 小字：1.4

---

## 🧩 组件规范

### 按钮（Button）

#### 主要按钮（Primary）
```css
背景：linear-gradient(180deg, #C41E3A 0%, #8B0000 100%)
文字：white
圆角：8px
内边距：8px 16px
阴影：0 2px 4px rgba(0,0,0,0.2)
点击效果：scale(0.95)
```

#### 金色按钮（Gold）
```css
背景：linear-gradient(180deg, #FFD700 0%, #DAA520 100%)
文字：#5C3317
圆角：8px
内边距：8px 16px
阴影：0 2px 4px rgba(0,0,0,0.2)
```

#### 绿色按钮（Green）
```css
背景：linear-gradient(180deg, #228B22 0%, #006400 100%)
文字：white
圆角：8px
内边距：8px 16px
阴影：0 2px 4px rgba(0,0,0,0.2)
```

### 卡片（Card）
```css
背景：white
圆角：8px
阴影：0 2px 8px rgba(0,0,0,0.1)
内边距：16px
```

### 进度条（Progress Bar）
```css
轨道：#E0E0E0，高度 8px，圆角 4px
填充：linear-gradient(90deg, #FFD700 0%, #C41E3A 100%)
动画：transition width 0.3s
```

### 图标（Icon）
- 尺寸：20px（行内）、24px（导航）、32-48px（展示）
- 风格：Emoji 优先，保持统一
- 间距：图标右侧 4px

---

## 📐 间距规范

### 间距系统（8px 基准）

| 变量 | 值 | 用途 |
|-----|-----|------|
| `--spacing-xs` | 4px | 图标与文字间距 |
| `--spacing-sm` | 8px | 小组件间距 |
| `--spacing-md` | 16px | 标准间距 |
| `--spacing-lg` | 24px | 大模块间距 |

### 使用原则
- 相关元素：8px
- 同组元素：16px
- 不同模块：24px
- 页面边缘：16px

---

## 🎭 动效规范

### 点击反馈
```css
transition: all 0.2s;
transform: scale(0.95);
```

### 悬浮效果
```css
transition: all 0.2s;
transform: translateY(-2px);
box-shadow: 0 4px 8px rgba(0,0,0,0.15);
```

### 弹窗动画
```css
@keyframes floatUp {
  0% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-50px); }
}
```

### 弹跳动画
```css
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
```

### 动画时长
- 快速反馈：0.2s
- 标准过渡：0.3s
- 慢速动画：0.5s

---

## 📱 响应式规范

### 断点
- 小游戏环境：固定宽度（320px - 414px）
- 高度自适应：100vh - 状态栏 - 导航栏

### 适配原则
- 使用相对单位（%、vh、vw）
- 弹性布局（Flexbox、Grid）
- 最小点击区域：44px × 44px

---

## 🔊 音效规范（v0.2 预留）

### 音效列表
| 场景 | 音效 | 时长 |
|-----|------|------|
| 点击按钮 | click.mp3 | 0.1s |
| 获得金币 | coin.mp3 | 0.3s |
| 升级成功 | upgrade.mp3 | 0.5s |
| 顾客到来 | customer.mp3 | 0.2s |
| 背景音乐 | bgm.mp3 | 循环 |

### 音频格式
- 格式：MP3 / AAC
- 采样率：44.1kHz
- 比特率：128kbps

---

## 🖼️ 资源规范

### 图标资源
- 格式：PNG（透明背景）
- 尺寸：@2x、@3x 倍率
- 命名：`icon_{name}_{size}.png`

### 背景资源
- 格式：JPG / WebP
- 质量：80%
- 尺寸：适配主流设备

### 资源命名规范
```
{type}_{name}_{variant}.{ext}

示例：
bg_restaurant_day.jpg
icon_chef_male.png
btn_upgrade_normal.png
btn_upgrade_pressed.png
```

---

## ♿ 无障碍规范

### 色彩对比度
- 文字与背景：≥ 4.5:1
- 大文字（18px+）：≥ 3:1

### 点击区域
- 最小尺寸：44px × 44px
- 间距：≥ 8px

### 文字大小
- 最小字号：12px
- 推荐字号：14px+

---

## 📋 检查清单

### 上线前检查
- [ ] 所有按钮有点击反馈
- [ ] 色彩对比度符合标准
- [ ] 点击区域 ≥ 44px
- [ ] 文字字号 ≥ 12px
- [ ] 动效流畅（60FPS）
- [ ] 加载时间 < 2s
- [ ] 存档功能正常
- [ ] 不同设备适配

### 设计规范遵循
- [ ] 使用标准配色
- [ ] 使用标准间距
- [ ] 使用标准字号
- [ ] 动效时长一致
- [ ] 组件样式统一

---

*设计原则：简洁、统一、中国风、易上手。*
