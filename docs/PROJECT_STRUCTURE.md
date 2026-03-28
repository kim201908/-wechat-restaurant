# 《我的中餐厅》v0.1 - 项目结构

## 📁 目录结构

```
my-chinese-restaurant/
├── docs/                      # 文档
│   ├── ARCHITECTURE.md        # 技术架构文档
│   ├── DESIGN.md              # 设计规范
│   └── README.md              # 项目说明
│
├── src/                       # 源代码
│   ├── prototype.html         # HTML 高保真原型（单文件）
│   ├── main.js                # 入口文件
│   ├── game.js                # 游戏主循环
│   ├── storage.js             # 存档管理
│   │
│   ├── scene/                 # 场景模块
│   │   ├── main.js            # 主界面
│   │   ├── decor.js           # 装修界面
│   │   ├── chef.js            # 厨师管理
│   │   └── dish.js            # 菜品管理
│   │
│   ├── model/                 # 数据模型
│   │   ├── restaurant.js      # 餐厅数据
│   │   ├── chef.js            # 厨师数据
│   │   ├── dish.js            # 菜品数据
│   │   └── customer.js        # 顾客数据
│   │
│   ├── view/                  # 视图渲染
│   │   ├── renderer.js        # Canvas 渲染器
│   │   ├── ui.js              # UI 组件
│   │   └── animation.js       # 动画系统
│   │
│   ├── controller/            # 控制器
│   │   ├── input.js           # 输入处理
│   │   ├── event.js           # 事件系统
│   │   └── scene.js           # 场景管理
│   │
│   └── utils/                 # 工具函数
│       ├── format.js          # 格式化
│       ├── math.js            # 数学计算
│       └── storage.js         # 存储工具
│
├── assets/                    # 资源文件
│   ├── images/                # 图片资源
│   │   ├── bg/                # 背景图
│   │   ├── furniture/         # 家具图片
│   │   ├── chef/              # 厨师图片
│   │   └── dish/              # 菜品图片
│   │
│   ├── audio/                 # 音频资源
│   │   ├── bgm/               # 背景音乐
│   │   └── sfx/               # 音效
│   │
│   └── fonts/                 # 字体文件
│
├── config/                    # 配置文件
│   ├── game.json              # 游戏配置
│   ├── dishes.json            # 菜品数据
│   ├── chefs.json             # 厨师数据
│   └── furniture.json         # 家具数据
│
├── test/                      # 测试文件
│   ├── unit/                  # 单元测试
│   ├── integration/           # 集成测试
│   └── performance/           # 性能测试
│
├── game.json                  # 微信小游戏配置
├── project.config.json        # 项目配置
└── README.md                  # 项目说明
```

---

## 📄 文件组织

### 核心文件说明

#### `game.json` - 微信小游戏配置
```json
{
  "deviceOrientation": "portrait",
  "showStatusBar": false,
  "networkTimeout": {
    "request": 5000,
    "connectSocket": 5000,
    "uploadFile": 5000,
    "downloadFile": 5000
  },
  "subpackages": []
}
```

#### `project.config.json` - 项目配置
```json
{
  "description": "我的中餐厅",
  "packOptions": {
    "ignore": []
  },
  "setting": {
    "es6": true,
    "enhance": true,
    "compileHotReLoad": false
  },
  "appid": "your-appid",
  "projectname": "my-chinese-restaurant"
}
```

#### `src/main.js` - 入口文件
```javascript
import { Game } from './game.js';
import { Storage } from './storage.js';

// 游戏初始化
const game = new Game();
game.init();

// 生命周期
wx.onShow(() => {
  game.resume();
});

wx.onHide(() => {
  game.pause();
  game.save();
});
```

---

## 🔧 开发规范

### 代码风格

#### 命名规范
```javascript
// 变量：camelCase
let gameState = {};
let customerCount = 0;

// 常量：UPPER_CASE
const MAX_LEVEL = 10;
const GOLDEN_COIN = '#FFD700';

// 类：PascalCase
class GameController {}
class RestaurantModel {}

// 函数：camelCase
function updateUI() {}
function calculateEarnings() {}

// 文件：kebab-case
game-controller.js
restaurant-model.js
```

#### 注释规范
```javascript
/**
 * 计算菜品收益
 * @param {Object} dish - 菜品对象
 * @param {number} chefLevel - 厨师等级
 * @returns {number} 收益值
 */
function calculateDishEarnings(dish, chefLevel) {
  // 基础收益 + 厨师加成
  return dish.baseEarnings * (1 + chefLevel * 0.1);
}
```

### 文件模板

#### 模块模板
```javascript
/**
 * 模块名称
 * @module scene/main
 */

// ========== 依赖 ==========
import { EventSystem } from '../controller/event.js';

// ========== 常量 ==========
const SCENE_ID = 'main';

// ========== 状态 ==========
let state = {
  initialized: false
};

// ========== 公共方法 ==========
export function init() {
  // 初始化逻辑
}

export function render() {
  // 渲染逻辑
}

export function update(deltaTime) {
  // 更新逻辑
}

// ========== 私有方法 ==========
function _internalMethod() {
  // 内部逻辑
}
```

---

## 📊 数据流规范

### 状态管理
```javascript
// 单一数据源
const gameState = {
  restaurant: {},
  chefs: [],
  dishes: [],
  customers: []
};

// 状态变更必须通过 action
function dispatch(action, payload) {
  switch (action.type) {
    case 'ADD_CUSTOMER':
      gameState.customers.push(payload);
      break;
    case 'REMOVE_CUSTOMER':
      gameState.customers = gameState.customers.filter(c => c.id !== payload.id);
      break;
  }
  // 通知视图更新
  notifyViews();
}
```

### 事件系统
```javascript
// 事件总线
const EventBus = {
  events: {},
  
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  },
  
  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(cb => cb(data));
    }
  }
};

// 使用示例
EventBus.on('customer_arrived', (customer) => {
  // 处理顾客到达
});

EventBus.emit('customer_arrived', customerData);
```

---

## 🎮 游戏循环

### 主循环结构
```javascript
class GameLoop {
  constructor() {
    this.lastTime = 0;
    this.running = false;
  }
  
  start() {
    this.running = true;
    this.lastTime = performance.now();
    requestAnimationFrame(this.tick.bind(this));
  }
  
  tick(currentTime) {
    if (!this.running) return;
    
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;
    
    // 更新逻辑
    this.update(deltaTime);
    
    // 渲染画面
    this.render();
    
    requestAnimationFrame(this.tick.bind(this));
  }
  
  update(deltaTime) {
    // 处理游戏逻辑
  }
  
  render() {
    // 渲染画面
  }
}
```

---

## 💾 存档规范

### 存档数据结构
```javascript
const SaveData = {
  version: '0.1.0',
  timestamp: Date.now(),
  
  // 玩家数据
  player: {
    coins: 1000,
    reputation: 100,
    day: 1
  },
  
  // 餐厅数据
  restaurant: {
    level: 1,
    layout: [],
    decorations: []
  },
  
  // 员工数据
  chefs: [],
  waiters: [],
  
  // 菜品数据
  dishes: [],
  
  // 统计数据
  stats: {
    totalCustomers: 0,
    totalEarnings: 0,
    playTime: 0
  }
};
```

### 存档操作
```javascript
const Storage = {
  KEY: 'myChineseRestaurant_save',
  
  save(data) {
    try {
      data.timestamp = Date.now();
      data.checksum = this._calculateChecksum(data);
      wx.setStorageSync(this.KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Save failed:', e);
    }
  },
  
  load() {
    try {
      const data = wx.getStorageSync(this.KEY);
      if (!data) return null;
      
      const parsed = JSON.parse(data);
      if (!this._verifyChecksum(parsed)) {
        console.warn('Checksum verification failed');
        return null;
      }
      
      return parsed;
    } catch (e) {
      console.error('Load failed:', e);
      return null;
    }
  },
  
  _calculateChecksum(data) {
    // 简单 checksum 实现
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
    }
    return hash;
  },
  
  _verifyChecksum(data) {
    const checksum = data.checksum;
    delete data.checksum;
    return this._calculateChecksum(data) === checksum;
  }
};
```

---

## 🧪 测试规范

### 单元测试
```javascript
// test/unit/storage.test.js
import { Storage } from '../../src/storage.js';

describe('Storage', () => {
  test('save and load', () => {
    const data = { coins: 1000 };
    Storage.save(data);
    const loaded = Storage.load();
    expect(loaded.coins).toBe(1000);
  });
  
  test('checksum verification', () => {
    // 测试校验和验证
  });
});
```

### 性能测试
```javascript
// test/performance/fps.test.js
function measureFPS(duration = 5000) {
  let frames = 0;
  const startTime = performance.now();
  
  function countFrame() {
    frames++;
    if (performance.now() - startTime < duration) {
      requestAnimationFrame(countFrame);
    }
  }
  
  countFrame();
  
  return new Promise(resolve => {
    setTimeout(() => {
      const fps = frames / (duration / 1000);
      resolve(fps);
    }, duration);
  });
}
```

---

## 🚀 构建与发布

### 开发环境
```bash
# 安装微信开发者工具
# 导入项目
# 选择项目目录：my-chinese-restaurant/

# 开发时启用实时编译
# 设置 → 通用设置 → 启用代码编译时自动预览
```

### 发布流程
1. 微信开发者工具 → 详情 → 本地设置
2. 勾选「上传时代码压缩」
3. 点击「上传」
4. 填写版本号和备注
5. 提交审核（如需上线）

### 版本管理
```
v0.1.0 - 内测版（MVP）
  - 主界面
  - 装修系统
  - 厨师管理
  - 菜品管理

v0.2.0 - 功能完善
  - 音效系统
  - 更多菜品
  - 成就系统

v1.0.0 - 正式版
  - 完整内容
  - 云存档
  - 社交功能
```

---

## 📝 提交规范

### Git Commit Message
```
feat: 添加厨师升级功能
fix: 修复存档加载 bug
refactor: 重构场景切换逻辑
docs: 更新架构文档
test: 添加存储单元测试
chore: 更新依赖版本
```

### 分支管理
```
main          - 主分支（稳定版本）
develop       - 开发分支
feature/xxx   - 功能分支
bugfix/xxx    - 修复分支
release/v0.1  - 发布分支
```

---

*简单、清晰、可维护。*
