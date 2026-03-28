/**
 * 我的中餐厅 - 主逻辑
 * v1.2 Canvas 版本
 */

// 导入渲染引擎
import './canvas-renderer';
import './social-mall';

// 游戏全局状态
const GameGlobal = {
  // 玩家数据
  player: {
    gold: 1000,
    gem: 10,
    level: 1,
    exp: 0,
    reputation: 100
  },
  
  // 时间系统
  time: {
    hour: 10,
    minute: 0,
    day: 1,
    period: 'morning'
  },
  
  // 员工系统
  employees: {
    chefs: [     // 厨师
      { id: 1, name: '小王', level: 1, speed: 10, cuisine: '川菜', salary: 100 }
    ],
    waiters: [],  // 服务员
    cashiers: [   // 收银员
      { id: 1, name: '小李', level: 1, speed: 10, salary: 80 }
    ]
  },
  
  // 成本系统
  costs: {
    ingredientRate: 0.3,  // 食材成本占售价 30%
    lastPayTime: Date.now(),
    todayWages: 0,
    todayIngredientCost: 0
  },
  
  // 利润统计
  profit: {
    todayRevenue: 0,
    todayCost: 0,
    todayProfit: 0
  },
  
  // 菜品数据
  dishes: [
    { id: 1, name: '炒饭', level: 1, price: 10, cuisine: '川菜', unlocked: true },
    { id: 2, name: '宫保鸡丁', level: 1, price: 25, cuisine: '川菜', unlocked: true },
    { id: 3, name: '麻婆豆腐', level: 1, price: 18, cuisine: '川菜', unlocked: false }
  ],
  
  // 当前 Tab
  activeTab: 'home',
  
  // 经营子 Tab
  businessSubTab: 'restaurant',
  
  // 采购商品分类
  shoppingCategories: [
    { id: 'tables', name: '🪑 桌椅类', icon: '🪑' },
    { id: 'decorations', name: '🖼️ 装饰类', icon: '🖼️' },
    { id: 'lights', name: '💡 灯具类', icon: '💡' },
    { id: 'plants', name: '🌿 植物类', icon: '🌿' }
  ],
  
  // 商品列表（扩充）
  shoppingItems: [
    // 桌椅类
    { id: 'table1', category: 'tables', name: '餐桌', icon: '🪑', price: 500 },
    { id: 'table2', category: 'tables', name: '方桌', icon: '🪑', price: 600 },
    { id: 'chair1', category: 'tables', name: '椅子', icon: '🪑', price: 200 },
    { id: 'chair2', category: 'tables', name: '沙发', icon: '🛋️', price: 800 },
    { id: 'bar', category: 'tables', name: '吧台', icon: '🍸', price: 1200 },
    // 装饰类
    { id: 'painting1', category: 'decorations', name: '装饰画', icon: '🖼️', price: 300 },
    { id: 'mirror', category: 'decorations', name: '镜子', icon: '🪞', price: 400 },
    { id: 'clock', category: 'decorations', name: '挂钟', icon: '🕐', price: 250 },
    { id: 'rug', category: 'decorations', name: '地毯', icon: '🧶', price: 350 },
    // 灯具类
    { id: 'lamp1', category: 'lights', name: '吊灯', icon: '💡', price: 800 },
    { id: 'lamp2', category: 'lights', name: '台灯', icon: '💡', price: 300 },
    { id: 'chandelier', category: 'lights', name: '水晶灯', icon: '✨', price: 1500 },
    // 植物类
    { id: 'plant1', category: 'plants', name: '绿植', icon: '🌿', price: 100 },
    { id: 'pot1', category: 'plants', name: '盆栽', icon: '🪴', price: 150 },
    { id: 'flowers', category: 'plants', name: '鲜花', icon: '💐', price: 200 },
    { id: 'tree', category: 'plants', name: '大树', icon: '🌳', price: 500 }
  ],
  
  // 当前选中的采购分类
  selectedCategory: 'tables',
  
  // 顾客系统
  customers: [],
  maxCustomers: 5,
  
  // 顾客动画
  customerAnimationTimer: null,
  
  // 服务员系统
  waiters: [],
  waiterAnimationTimer: null,
  
  // 收银系统
  cashier: {
    x: 300,
    y: 260,
    isWorking: true
  },
  
  // 收入统计
  todayEarnings: 0,
  
  // 家具数据
  furnitures: [],
  
  // 拖拽状态
  dragState: {
    isDragging: false,
    dragIndex: -1,
    offsetX: 0,
    offsetY: 0
  },
  
  // 社交子 Tab
  socialSubTab: 'friends',
  
  // 商城子 Tab
  mallSubTab: 'recommend',
  
  // 社交数据
  social: {
    friendCode: 'MCR888',
    friends: [
      { name: '小明', restaurant: '川香阁', level: 15 },
      { name: '小红', restaurant: '粤味馆', level: 12 }
    ]
  },
  
  // 活动数据
  events: {
    active: [
      { name: '每日挑战', desc: '完成 100 个订单', reward: '💎×50', progress: 65, target: 100, limited: false },
      { name: '周末特惠', desc: '累计收益 10000 金币', reward: '🪙×2000', progress: 7500, target: 10000, limited: true }
    ],
    completed: [
      { name: '新店开业', reward: '🪙×1000' },
      { name: '首位厨师', reward: '💎×20' }
    ]
  },
  
  // 商城数据
  hasFirstCharge: false,
  monthCard: {
    isActive: false,
    expireDate: ''
  },
  
  // Canvas
  canvas: null
};

// 环境检测
function checkEnvironment() {
  const issues = [];
  
  // 检测 wx 对象
  if (typeof wx === 'undefined') {
    issues.push('wx 对象不存在，可能不在微信环境');
  }
  
  // 检测 Canvas API
  if (typeof wx.createCanvas !== 'function') {
    issues.push('wx.createCanvas 不可用');
  }
  
  if (issues.length > 0) {
    console.warn('[环境检测] 潜在问题:', issues);
    return false;
  }
  
  console.log('[环境检测] ✅ 环境正常');
  return true;
}

// 初始化游戏
function init() {
  console.log('我的中餐厅 v1.2 Canvas 版启动');
  
  // 环境检测
  if (!checkEnvironment()) {
    console.error('[初始化] 环境检测失败，尝试继续初始化...');
  }
  
  // 全局错误捕获
  wx.onError && wx.onError((err) => {
    console.error('[全局错误]', err);
  });
  
  // 加载存档
  loadGame();
  
  // 初始化 Canvas
  try {
    GameGlobal.canvas = CanvasRenderer.init();
  } catch (e) {
    console.error('[初始化] Canvas 初始化失败:', e);
  }
  
  // 首次渲染
  render();
  
  // 启动游戏循环
  startGameLoop();
  
  // 绑定触摸事件
  bindTouchEvents();
  
  console.log('[初始化] ✅ 游戏启动完成');
}

// 加载游戏存档
function loadGame() {
  try {
    const savedData = wx.getStorageSync('restaurant_save');
    if (savedData) {
      const saved = JSON.parse(savedData);
      Object.assign(GameGlobal.player, saved.player);
      Object.assign(GameGlobal.time, saved.time);
      if (saved.chefs) GameGlobal.chefs = saved.chefs;
      if (saved.dishes) GameGlobal.dishes = saved.dishes;
      if (saved.social) GameGlobal.social = saved.social;
      if (saved.events) GameGlobal.events = saved.events;
      if (saved.hasFirstCharge !== undefined) GameGlobal.hasFirstCharge = saved.hasFirstCharge;
      if (saved.monthCard) GameGlobal.monthCard = saved.monthCard;
      if (saved.furnitures) GameGlobal.furnitures = saved.furnitures;
      console.log('游戏存档加载成功');
    }
  } catch (e) {
    console.error('加载存档失败:', e);
  }
}

// 保存游戏存档
function saveGame() {
  try {
    wx.setStorageSync('restaurant_save', JSON.stringify({
      player: GameGlobal.player,
      time: GameGlobal.time,
      chefs: GameGlobal.chefs,
      dishes: GameGlobal.dishes,
      social: GameGlobal.social,
      events: GameGlobal.events,
      hasFirstCharge: GameGlobal.hasFirstCharge,
      monthCard: GameGlobal.monthCard,
      furnitures: GameGlobal.furnitures
    }));
  } catch (e) {
    console.error('保存存档失败:', e);
  }
}

// 渲染
function render() {
  CanvasRenderer.render(GameGlobal, GameGlobal.activeTab);
}

// 游戏主循环
function startGameLoop() {
  // 每分钟更新一次游戏时间
  setInterval(() => {
    updateTime();
    render();
  }, 60000);
  
  // 自动收益（每 5 秒）
  setInterval(() => {
    autoEarnings();
    render();
  }, 5000);
}

// 更新时间
function updateTime() {
  GameGlobal.time.minute += 10;
  if (GameGlobal.time.minute >= 60) {
    GameGlobal.time.minute = 0;
    GameGlobal.time.hour += 1;
    
    if (GameGlobal.time.hour >= 22) {
      endOfDay();
    }
  }
  
  if (GameGlobal.time.hour < 12) {
    GameGlobal.time.period = 'morning';
  } else if (GameGlobal.time.hour < 17) {
    GameGlobal.time.period = 'afternoon';
  } else {
    GameGlobal.time.period = 'evening';
  }
  
  console.log(`游戏时间：${GameGlobal.time.hour}:${GameGlobal.time.minute}`);
}

// 自动收益
function autoEarnings() {
  const earnings = GameGlobal.chefs.length * 10;
  GameGlobal.player.gold += earnings;
  console.log(`自动收益：+${earnings} 金币`);
}

// 一天结束
function endOfDay() {
  console.log('打烊了！结算今日收益...');
  saveGame();
  
  GameGlobal.time.hour = 10;
  GameGlobal.time.minute = 0;
  GameGlobal.time.day += 1;
  
  wx.showModal({
    title: '打烊啦',
    content: `第 ${GameGlobal.time.day} 天结束，当前金币：${GameGlobal.player.gold}`,
    showCancel: false
  });
}

// 绑定触摸事件（带详细调试 + 拖拽）
function bindTouchEvents() {
  if (typeof wx.onTouchStart !== 'function') {
    console.warn('[触摸事件] wx.onTouchStart 不可用，使用降级方案');
    return;
  }
  
  // 触摸开始
  wx.onTouchStart((res) => {
    try {
      const touch = res.touches[0];
      const x = touch.pageX || touch.clientX;
      const y = touch.pageY || touch.clientY;
      
      console.log('====================');
      console.log(`[触摸开始] 坐标：(${x.toFixed(1)}, ${y.toFixed(1)})`);
      
      // 检查是否在拖拽家具（经营 - 餐厅 Tab）
      if (GameGlobal.activeTab === 'business' && GameGlobal.businessSubTab === 'restaurant') {
        console.log(`[拖拽检测] 家具数量：${GameGlobal.furnitures?.length || 0}`);
        const dragResult = CanvasRenderer.checkFurnitureDrag(x, y, GameGlobal);
        if (dragResult) {
          GameGlobal.dragState = dragResult;
          console.log('[拖拽检测] ✅ 开始拖拽家具', dragResult);
          return;
        } else {
          console.log('[拖拽检测] ❌ 未点击到家具');
        }
      }
      
      const action = CanvasRenderer.handleTouch(x, y, GameGlobal, GameGlobal.activeTab);
      console.log('[handleTouch 返回] action =', action);
      
      if (action) {
        console.log(`[触摸开始] ✅ 检测到动作：${action.type}`, action);
        
        if (action.type === 'tab') {
          console.log(`[Tab 切换] ${GameGlobal.activeTab} -> ${action.tab}`);
          GameGlobal.activeTab = action.tab;
          console.log('[render 调用] 准备渲染');
          render();
          console.log('[render 调用] 渲染完成');
        } else if (action.type === 'subtab') {
          if (action.tabGroup === 'business') {
            GameGlobal.businessSubTab = action.subtab;
          } else if (action.tabGroup === 'social') {
            GameGlobal.socialSubTab = action.subtab;
          } else if (action.tabGroup === 'mall') {
            GameGlobal.mallSubTab = action.subtab;
          }
          render();
        } else if (action.type === 'action') {
          handleAction(action);
        }
      } else {
        console.log('[触摸开始] ❌ 未检测到有效动作');
      }
    } catch (e) {
      console.error('[触摸事件] 处理错误:', e.message);
    }
  });
  
  // 触摸移动（拖拽）
  wx.onTouchMove((res) => {
    if (!GameGlobal.dragState.isDragging) return;
    
    try {
      const touch = res.touches[0];
      const x = touch.pageX || touch.clientX;
      const y = touch.pageY || touch.clientY;
      
      // 更新家具位置（使用绝对坐标）
      const furniture = GameGlobal.furnitures[GameGlobal.dragState.dragIndex];
      if (furniture) {
        // 限制在预览区域内（X: 16-359, Y: 40-340）- 扩大范围
        furniture.x = Math.max(16, Math.min(359, x - GameGlobal.dragState.offsetX));
        furniture.y = Math.max(0, Math.min(260, y - GameGlobal.dragState.offsetY));
        render();
      }
    } catch (e) {
      console.error('[触摸移动] 错误:', e.message);
    }
  });
  
  // 触摸结束（释放拖拽）
  wx.onTouchEnd(() => {
    if (GameGlobal.dragState.isDragging) {
      console.log('[触摸结束] 释放拖拽');
      GameGlobal.dragState = { isDragging: false, dragIndex: -1, offsetX: 0, offsetY: 0 };
      saveGame(); // 保存新位置
    }
  });
}

// 处理动作（带错误处理）
function handleAction(action) {
  try {
    console.log('[动作]', action.action, action);
    
    switch (action.action) {
    case 'collectEarnings':
      const earnings = GameGlobal.chefs.length * 50;
      GameGlobal.player.gold += earnings;
      wx.showToast({
        title: `收取 ${earnings} 金币`,
        icon: 'success'
      });
      saveGame();
      render();
      break;
      
    case 'recruitChef':
      if (GameGlobal.player.gold >= 500) {
        GameGlobal.player.gold -= 500;
        const newChef = {
          id: GameGlobal.chefs.length + 1,
          name: `厨师${GameGlobal.chefs.length + 1}`,
          level: 1,
          speed: 10,
          cuisine: '川菜'
        };
        GameGlobal.chefs.push(newChef);
        wx.showToast({
          title: '雇佣成功！',
          icon: 'success'
        });
        saveGame();
        render();
      } else {
        wx.showToast({
          title: '金币不足',
          icon: 'none'
        });
      }
      break;
      
    case 'upgradeDish':
      const dish = GameGlobal.dishes.find(d => d.id === action.dishId);
      if (dish && dish.unlocked) {
        const upgradeCost = dish.level * 100;
        if (GameGlobal.player.gold >= upgradeCost) {
          GameGlobal.player.gold -= upgradeCost;
          dish.level += 1;
          dish.price += 5;
          wx.showToast({
            title: `升级到 Lv.${dish.level}`,
            icon: 'success'
          });
          saveGame();
          render();
        } else {
          wx.showToast({
            title: '金币不足',
            icon: 'none'
          });
        }
      }
      break;
      
    case 'generateOrder':
      wx.showToast({
        title: '订单生成中...',
        icon: 'loading'
      });
      setTimeout(() => {
        wx.showToast({
          title: '订单已生成',
          icon: 'success'
        });
      }, 1000);
      break;
      
    case 'copyFriendCode':
      wx.setClipboardData({
        data: GameGlobal.social.friendCode
      });
      wx.showToast({
        title: '好友码已复制',
        icon: 'success'
      });
      break;
      
    case 'buyFirstCharge':
      wx.showModal({
        title: '首充礼包',
        content: '确认支付 ¥6？（模拟支付）',
        success(res) {
          if (res.confirm) {
            GameGlobal.hasFirstCharge = true;
            GameGlobal.player.gem += 180;
            GameGlobal.player.gold += 5000;
            wx.showToast({
              title: '购买成功！',
              icon: 'success'
            });
            saveGame();
            render();
          }
        }
      });
      break;
      
    case 'buyMonthCard':
      wx.showModal({
        title: '尊享月卡',
        content: '确认支付 ¥30？（模拟支付）',
        success(res) {
          if (res.confirm) {
            GameGlobal.monthCard.isActive = true;
            const expire = new Date();
            expire.setDate(expire.getDate() + 30);
            GameGlobal.monthCard.expireDate = expire.toISOString().split('T')[0];
            wx.showToast({
              title: '开通成功！',
              icon: 'success'
            });
            saveGame();
            render();
          }
        }
      });
      break;
      
    case 'buyDiamonds':
      wx.showModal({
        title: '充值钻石',
        content: `确认支付 ¥${action.price} 购买 ${action.amount} 钻石？（模拟支付）`,
        success(res) {
          if (res.confirm) {
            GameGlobal.player.gem += action.amount;
            wx.showToast({
              title: '充值成功！',
              icon: 'success'
            });
            saveGame();
            render();
          }
        }
      });
      break;
      
    case 'buyFurniture':
    case 'buyItem':
      const item = action.furniture || action.item;
      if (GameGlobal.player.gold >= item.price) {
        wx.showModal({
          title: '购买商品',
          content: `确认购买 ${item.name}（💰${item.price}）？`,
          success(res) {
            if (res.confirm) {
              GameGlobal.player.gold -= item.price;
              if (!GameGlobal.furnitures) GameGlobal.furnitures = [];
              // 新购买的家具放在预览区域
              const index = GameGlobal.furnitures.length;
              GameGlobal.furnitures.push({
                id: item.id,
                icon: item.icon,
                name: item.name,
                x: 50 + (index % 5) * 60,
                y: (index < 5 ? 20 : 70)
              });
              wx.showToast({
                title: '购买成功！',
                icon: 'success'
              });
              saveGame();
              render();
            }
          }
        });
      } else {
        wx.showToast({
          title: '金币不足',
          icon: 'none'
        });
      }
      break;
      
    case 'selectCategory':
      GameGlobal.selectedCategory = action.categoryId;
      render();
      break;
      
    case 'selectEmpTab':
      GameGlobal.selectedEmpTab = action.empTab;
      render();
      break;
      
    case 'recruitEmployee':
      const empType = action.empType;
      if (GameGlobal.player.gold >= 500) {
        GameGlobal.player.gold -= 500;
        const empId = (GameGlobal.employees[empType]?.length || 0) + 1;
        const names = { chefs: ['小王', '老张', '阿强'], waiters: ['小红', '小丽', '阿芳'], cashiers: ['小李', '小陈', '阿明'] };
        const nameList = names[empType] || ['员工'];
        const newEmp = {
          id: empId,
          name: nameList[Math.floor(Math.random() * nameList.length)],
          level: 1,
          speed: 10,
          salary: empType === 'chefs' ? 100 : empType === 'waiters' ? 80 : 80
        };
        
        if (!GameGlobal.employees[empType]) GameGlobal.employees[empType] = [];
        GameGlobal.employees[empType].push(newEmp);
        
        wx.showToast({
          title: `雇佣${empType === 'chefs' ? '厨师' : empType === 'waiters' ? '服务员' : '收银员'}成功！`,
          icon: 'success'
        });
        saveGame();
        render();
      } else {
        wx.showToast({
          title: '金币不足',
          icon: 'none'
        });
      }
      break;
    }
  } catch (e) {
    console.error('[动作处理] 错误:', e.message);
    wx.showToast({
      title: '操作失败',
      icon: 'none'
    });
  }
}

// 切换场景
function switchScene(scene) {
  GameGlobal.activeTab = scene;
  render();
}

// 导出全局函数
window.GameGlobal = GameGlobal;
window.init = init;
window.saveGame = saveGame;
window.switchScene = switchScene;

// 启动顾客动画系统
function startCustomerAnimation() {
  // 每 3 秒生成一个顾客
  setInterval(() => {
    if (GameGlobal.customers.length < GameGlobal.maxCustomers) {
      // 50% 概率生成顾客
      if (Math.random() > 0.5) {
        GameGlobal.customers.push({
          id: Date.now(),
          x: 320,  // 从右侧门口进入
          y: 280,  // 门口位置
          targetX: 50 + Math.random() * 200,  // 随机目标位置
          targetY: 80 + Math.random() * 150,
          state: 'entering',  // entering, walking_in, ordering, eating, leaving, walking_out
          walkFrame: 0,  // 走路动画帧
          orderTime: 0,
          eatTime: 0
        });
      }
    }
  }, 3000);
  
  // 每 100ms 更新顾客位置
  setInterval(() => {
    updateCustomers();
    render();
  }, 100);
}

// 检测家具障碍物
function checkFurnitureCollision(x, y, radius = 20) {
  if (!GameGlobal.furnitures || GameGlobal.furnitures.length === 0) {
    return false;
  }
  
  for (const furniture of GameGlobal.furnitures) {
    const fx = furniture.x || 0;
    const fy = furniture.y || 0;
    // 家具在预览区域内的绝对位置
    const furnitureAbsX = fx;
    const furnitureAbsY = 40 + fy;
    
    // 检测碰撞（家具视为 40x40 的方块）
    const dx = x - furnitureAbsX;
    const dy = y - furnitureAbsY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < radius + 20) {  // 20 是家具半径
      return true;
    }
  }
  return false;
}

// 避障移动：检测障碍物并绕行
function moveWithAvoidance(entity, targetX, targetY, speed = 1.5) {
  const dx = targetX - entity.x;
  const dy = targetY - entity.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  
  if (dist > 5) {
    // 计算下一步位置
    const nextX = entity.x + (dx / dist) * speed;
    const nextY = entity.y + (dy / dist) * speed;
    
    // 检测是否会碰撞
    if (checkFurnitureCollision(nextX, nextY, 15)) {
      // 有障碍，尝试绕行：垂直于目标方向移动
      const perpendicularX = -dy / dist;
      const perpendicularY = dx / dist;
      
      // 尝试左右两个方向
      const leftX = entity.x + perpendicularX * speed;
      const leftY = entity.y + perpendicularY * speed;
      const rightX = entity.x - perpendicularX * speed;
      const rightY = entity.y - perpendicularY * speed;
      
      if (!checkFurnitureCollision(leftX, leftY, 15)) {
        entity.x = leftX;
        entity.y = leftY;
      } else if (!checkFurnitureCollision(rightX, rightY, 15)) {
        entity.x = rightX;
        entity.y = rightY;
      } else {
        // 都被挡住，尝试小幅度后退
        entity.x -= (dx / dist) * 0.5;
        entity.y -= (dy / dist) * 0.5;
      }
    } else {
      // 无障碍，直接移动
      entity.x = nextX;
      entity.y = nextY;
    }
    
    return true;  // 还在移动中
  }
  return false;  // 已到达目标
}

// 更新顾客状态
function updateCustomers() {
  const canvasWidth = window.CanvasRenderer?.CONFIG?.width || 375;
  const canvasHeight = 340;  // 预览区域高度
  
  // 检查是否有服务员
  const hasWaiter = GameGlobal.employees && GameGlobal.employees.waiters && GameGlobal.employees.waiters.length > 0;
  
  GameGlobal.customers.forEach(customer => {
    switch (customer.state) {
      case 'entering':
        // 从门口走进来（带避障）
        const dxEnter = customer.targetX - customer.x;
        const dyEnter = customer.targetY - customer.y;
        const distEnter = Math.sqrt(dxEnter * dxEnter + dyEnter * dyEnter);
        
        if (distEnter > 5) {
          moveWithAvoidance(customer, customer.targetX, customer.targetY, 1.5);
          customer.walkFrame += 0.3;  // 走路动画
        } else {
          customer.state = 'waiting_food';  // 改为 waiting_food
          customer.waitFoodTime = Date.now();
        }
        break;
        
      case 'waiting_food':
        // 等待上菜
        if (hasWaiter) {
          // 检查是否有服务员正在为此顾客服务
          const beingServed = GameGlobal.waiters && GameGlobal.waiters.some(w => w.servingCustomerId === customer.id);
          
          if (!beingServed) {
            // 分配一个空闲服务员
            const idleWaiter = GameGlobal.waiters.find(w => w.state === 'idle');
            if (idleWaiter) {
              idleWaiter.state = 'serving';
              idleWaiter.servingCustomerId = customer.id;
              idleWaiter.targetX = customer.x;
              idleWaiter.targetY = customer.y;
            }
          }
        }
        
        // 等待 5 秒后如果没有服务员，直接进入 eating 状态
        if (Date.now() - customer.waitFoodTime > 5000) {
          customer.state = 'eating';
          customer.eatTime = Date.now();
        }
        break;
        
      case 'eating':
        if (Date.now() - customer.eatTime > 3000) {
          customer.state = 'leaving';
        }
        break;
        
      case 'leaving':
        // 走向门口（右下角）（带避障）
        const doorX = 320;
        const doorY = 280;
        const dxLeave = doorX - customer.x;
        const dyLeave = doorY - customer.y;
        const distLeave = Math.sqrt(dxLeave * dxLeave + dyLeave * dyLeave);
        
        if (distLeave > 5) {
          moveWithAvoidance(customer, doorX, doorY, 2);
          customer.walkFrame += 0.3;  // 走路动画
        } else {
          customer.state = 'walking_out';
        }
        break;
        
      case 'walking_out':
        // 走向收银台付款（带避障）
        const cashierX = 300;
        const cashierY = 260;
        const dxCash = cashierX - customer.x;
        const dyCash = cashierY - customer.y;
        const distCash = Math.sqrt(dxCash * dxCash + dyCash * dyCash);
        
        if (distCash > 10) {
          moveWithAvoidance(customer, cashierX, cashierY, 1.5);
          customer.walkFrame += 0.3;
        } else {
          // 到达收银台，付款
          customer.state = 'paying';
          customer.payTime = Date.now();
        }
        break;
        
      case 'paying':
        if (Date.now() - customer.payTime > 1000) {
          // 付款完成，计算收入和成本
          const bill = Math.floor(Math.random() * 30) + 20;  // 20-50 元
          const ingredientCost = Math.floor(bill * GameGlobal.costs.ingredientRate);  // 食材成本
          const profit = bill - ingredientCost;
          
          GameGlobal.todayEarnings += bill;
          GameGlobal.player.gold += profit;
          
          // 更新统计
          GameGlobal.profit.todayRevenue += bill;
          GameGlobal.costs.todayIngredientCost += ingredientCost;
          GameGlobal.profit.todayCost = GameGlobal.costs.todayIngredientCost + GameGlobal.costs.todayWages;
          GameGlobal.profit.todayProfit = GameGlobal.profit.todayRevenue - GameGlobal.profit.todayCost;
          
          customer.state = 'walking_out_final';
        }
        break;
        
      case 'walking_out_final':
        customer.x += 2;  // 走出门口
        if (customer.x > canvasWidth + 30) {
          // 移除离开的顾客
          GameGlobal.customers = GameGlobal.customers.filter(c => c.id !== customer.id);
        }
        break;
    }
  });
  
  // 更新服务员状态
  if (GameGlobal.waiters) {
    GameGlobal.waiters.forEach(waiter => {
      if (waiter.state === 'serving' && waiter.servingCustomerId) {
        // 找到对应的顾客
        const customer = GameGlobal.customers.find(c => c.id === waiter.servingCustomerId);
        
        if (customer && customer.state === 'waiting_food') {
          // 移动到顾客位置（带避障）
          const arrived = moveWithAvoidance(waiter, waiter.targetX, waiter.targetY, 2);
          
          if (!arrived) {
            // 到达顾客位置，上菜
            customer.state = 'eating';
            customer.eatTime = Date.now();
            
            // 服务员返回空闲
            waiter.state = 'returning';
            waiter.returnTargetX = 300;  // 返回厨房/服务区
            waiter.returnTargetY = 50;
          }
        } else if (!customer) {
          // 顾客已离开，返回空闲
          waiter.state = 'returning';
          waiter.returnTargetX = 300;
          waiter.returnTargetY = 50;
          waiter.servingCustomerId = null;
        }
      } else if (waiter.state === 'returning') {
        // 返回服务区
        const arrived = moveWithAvoidance(waiter, waiter.returnTargetX, waiter.returnTargetY, 2);
        
        if (!arrived) {
          waiter.state = 'idle';
          waiter.servingCustomerId = null;
        }
      }
    });
  }
}

// 启动游戏
init();

// 启动顾客动画（延迟 2 秒，等 Canvas 初始化）
setTimeout(startCustomerAnimation, 2000);

// 启动工资支付系统（每小时支付一次）
setInterval(() => {
  const totalWages = 
    GameGlobal.employees.chefs.reduce((sum, e) => sum + e.salary, 0) +
    GameGlobal.employees.waiters.reduce((sum, e) => sum + e.salary, 0) +
    GameGlobal.employees.cashiers.reduce((sum, e) => sum + e.salary, 0);
  
  if (totalWages > 0) {
    GameGlobal.costs.todayWages += totalWages;
    GameGlobal.profit.todayCost = GameGlobal.costs.todayIngredientCost + GameGlobal.costs.todayWages;
    GameGlobal.profit.todayProfit = GameGlobal.profit.todayRevenue - GameGlobal.profit.todayCost;
    
    console.log(`[工资] 支付工资 💰${totalWages}，今日总工资：${GameGlobal.costs.todayWages}`);
  }
}, 3600000);  // 1 小时 = 3600 秒（测试时可改为 60000 = 1 分钟）
