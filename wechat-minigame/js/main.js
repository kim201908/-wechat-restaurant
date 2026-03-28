/**
 * 我的中餐厅 - 主逻辑
 * v1.2 Canvas 版本
 */

// 导入渲染引擎
import './canvas-renderer';

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
  
  // Canvas
  canvas: null
};

// 初始化游戏
function init() {
  console.log('我的中餐厅 v1.2 Canvas 版启动');
  
  // 加载存档
  loadGame();
  
  // 初始化 Canvas
  GameGlobal.canvas = CanvasRenderer.init();
  
  // 首次渲染
  render();
  
  // 启动游戏循环
  startGameLoop();
  
  // 绑定触摸事件
  bindTouchEvents();
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
      dishes: GameGlobal.dishes
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

// 绑定触摸事件
function bindTouchEvents() {
  wx.onTouchStart((res) => {
    const touch = res.touches[0];
    const x = touch.clientX;
    const y = touch.clientY;
    
    const action = CanvasRenderer.handleTouch(x, y, GameGlobal, GameGlobal.activeTab);
    
    if (action) {
      if (action.type === 'tab') {
        GameGlobal.activeTab = action.tab;
        render();
      } else if (action.type === 'subtab') {
        GameGlobal.businessSubTab = action.subtab;
        render();
      } else if (action.type === 'action') {
        handleAction(action);
      }
    }
  });
}

// 处理动作
function handleAction(action) {
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
