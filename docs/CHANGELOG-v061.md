# 《我的中餐厅》v0.6.1 修复日志

**发布日期：** 2026-03-27  
**版本：** v0.6.1  
**存档版本：** v061

---

## Bug 修复

### Bug #1: 任务进度 ID 不匹配

**问题描述：**
- 任务模板中定义的 ID 为 `serve_customers`（复数）
- 但在 `game.autoEarn()` 和 `tasks.updateTaskProgress()` 中使用的是 `serve_customer`（单数）
- 导致"服务顾客"任务进度永远无法更新

**影响范围：**
- 每日任务中的"服务顾客"任务
- 任务进度追踪系统

**修复内容：**
1. `game.autoEarn()` 中调用改为 `tasks.updateTaskProgress('serve_customers', 1)`
2. `tasks.updateTaskProgress()` 中匹配条件改为 `action === 'serve_customers'`
3. 统一使用复数形式 `serve_customers`

**修改位置：**
- Line ~481: `game.autoEarn()` 函数
- Line ~795: `tasks.updateTaskProgress()` 函数

---

### Bug #2: 外卖订单定时器内存泄漏

**问题描述：**
- `simulateDelivery()` 和 `startTimeout()` 创建的定时器未存储引用
- 订单被收集或取消时，定时器未清理
- 长时间运行后会导致大量定时器累积，性能下降

**影响范围：**
- 外卖订单系统
- 长时间运行的游戏会话
- 内存使用

**修复内容：**
1. 订单对象新增字段：`deliveryTimer` 和 `timeoutTimer`
2. `simulateDelivery()` 中将定时器引用存储到 `order.deliveryTimer`
3. `startTimeout()` 中将定时器引用存储到 `order.timeoutTimer`
4. 定时器回调中添加清理逻辑：
   ```javascript
   if (order.deliveryTimer) {
     clearInterval(order.deliveryTimer);
     order.deliveryTimer = null;
   }
   ```
5. `collectOrder()` 中添加定时器清理逻辑，防止收割后定时器继续运行

**修改位置：**
- Line ~886: `delivery.generateOrder()` - 初始化定时器字段
- Line ~899: `delivery.simulateDelivery()` - 存储并清理定时器
- Line ~913: `delivery.startTimeout()` - 存储并清理定时器
- Line ~933: `delivery.collectOrder()` - 收割时清理定时器

---

## 其他改进

### 存档系统升级
- 存档 key 从 `mcr_v06_save` 升级为 `mcr_v061_save`
- `loadGame()` 支持向下兼容，可加载 v06 存档
- 标题更新为"我的中餐厅 - v0.6.1 Bug 修复版"

### 初始化顺序优化
- `game.init()` 中显式调用 `delivery.init()`，确保外卖系统正确初始化

---

## 技术细节

### 代码质量改进
- 所有定时器清理都使用"检查 - 清理 - 置 null"模式
- 防止重复清理导致的错误
- 添加注释说明 Bug 修复内容

### 测试建议
1. 测试"服务顾客"任务进度是否正常更新
2. 长时间运行后检查浏览器性能（DevTools Performance tab）
3. 生成多个外卖订单并收集，检查定时器数量

---

## 版本对比

| 项目 | v0.6 | v0.6.1 |
|------|------|--------|
| 任务 ID 一致性 | ❌ | ✅ |
| 定时器清理 | ❌ | ✅ |
| 存档兼容 | - | 向下兼容 v06 |
| 文件命名 | prototype-v06.html | prototype-v061.html |

---

**下一步计划：**
- 继续测试其他潜在 Bug
- 收集玩家反馈
- 规划 v0.7 新功能
