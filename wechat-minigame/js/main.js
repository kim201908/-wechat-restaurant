/**
 * 我的中餐厅 - 主逻辑
 * v1.2 版本
 */

// 游戏全局状态
const GameGlobal = {
  // 玩家数据
  player: {
    gold: 1000,      // 金币
    gem: 10,         // 宝石
    level: 1,        // 餐厅等级
    exp: 0,          // 经验值
    reputation: 100  // 声誉
  },
  
  // 时间系统
  time: {
    hour: 10,
    minute: 0,
    day: 1,
    period: 'morning'  // morning, afternoon, evening
  },
  
  // 厨师数据
  chefs: [],
  
  // 菜品数据
  dishes: [],
  
  // 家具数据
  furnitures: [],
  
  // 任务系统
  tasks: []
};

// 初始化游戏
function init() {
  console.log('我的中餐厅 v1.2 启动');
  
  // 加载存档
  loadGame();
  
  // 启动游戏循环
  startGameLoop();
}

// 加载游戏存档
function loadGame() {
  try {
    const savedData = wx.getStorageSync('restaurant_save');
    if (savedData) {
      Object.assign(GameGlobal, JSON.parse(savedData));
      console.log('游戏存档加载成功');
    } else {
      // 新游戏初始化
      initNewGame();
    }
  } catch (e) {
    console.error('加载存档失败:', e);
    initNewGame();
  }
}

// 新游戏初始化
function initNewGame() {
  console.log('开始新游戏');
  
  // 初始菜品
  GameGlobal.dishes = [
    { id: 1, name: '炒饭', level: 1, price: 10, cuisine: '川菜', unlocked: true },
    { id: 2, name: '宫保鸡丁', level: 1, price: 25, cuisine: '川菜', unlocked: true },
    { id: 3, name: '麻婆豆腐', level: 1, price: 18, cuisine: '川菜', unlocked: false }
  ];
  
  // 初始厨师
  GameGlobal.chefs = [
    { id: 1, name: '小王', level: 1, speed: 10, cuisine: '川菜' }
  ];
  
  saveGame();
}

// 保存游戏存档
function saveGame() {
  try {
    wx.setStorageSync('restaurant_save', JSON.stringify(GameGlobal));
  } catch (e) {
    console.error('保存存档失败:', e);
  }
}

// 游戏主循环
function startGameLoop() {
  // 每分钟更新一次游戏时间
  setInterval(() => {
    updateTime();
  }, 60000);
}

// 更新时间
function updateTime() {
  GameGlobal.time.minute += 10;
  if (GameGlobal.time.minute >= 60) {
    GameGlobal.time.minute = 0;
    GameGlobal.time.hour += 1;
    
    if (GameGlobal.time.hour >= 22) {
      // 打烊
      endOfDay();
    }
  }
  
  // 更新时段
  if (GameGlobal.time.hour < 12) {
    GameGlobal.time.period = 'morning';
  } else if (GameGlobal.time.hour < 17) {
    GameGlobal.time.period = 'afternoon';
  } else {
    GameGlobal.time.period = 'evening';
  }
  
  console.log(`游戏时间：${GameGlobal.time.hour}:${GameGlobal.time.minute} ${GameGlobal.time.period}`);
}

// 一天结束
function endOfDay() {
  console.log('打烊了！结算今日收益...');
  saveGame();
  
  // 重置时间到第二天
  GameGlobal.time.hour = 10;
  GameGlobal.time.minute = 0;
  GameGlobal.time.day += 1;
  
  wx.showModal({
    title: '打烊啦',
    content: `第 ${GameGlobal.time.day} 天结束，今日收益已结算`,
    showCancel: false
  });
}

// 导出全局函数
window.GameGlobal = GameGlobal;
window.init = init;
window.saveGame = saveGame;

// 启动游戏
init();
