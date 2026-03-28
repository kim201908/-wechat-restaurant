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
  
  // 厨师数据
  chefs: [
    { id: 1, name: '小王', level: 1, speed: 10, cuisine: '川菜' }
  ],
  
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
      monthCard: GameGlobal.monthCard
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

// 绑定触摸事件（带错误处理）
function bindTouchEvents() {
  if (typeof wx.onTouchStart !== 'function') {
    console.warn('[触摸事件] wx.onTouchStart 不可用，使用降级方案');
    return;
  }
  
  wx.onTouchStart((res) => {
    try {
      const touch = res.touches[0];
      const x = touch.clientX;
      const y = touch.clientY;
      
      const action = CanvasRenderer.handleTouch(x, y, GameGlobal, GameGlobal.activeTab);
      
      if (action) {
        if (action.type === 'tab') {
          GameGlobal.activeTab = action.tab;
          render();
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
      }
    } catch (e) {
      console.error('[触摸事件] 处理错误:', e.message);
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

// 启动游戏
init();
