/**
 * 我的中餐厅 - Canvas 渲染引擎
 * v1.2 版本
 */

// 游戏配置
const CONFIG = {
  width: 375,
  height: 667,
  statusBarHeight: 44,
  navBarHeight: 60,
  colors: {
    primaryRed: '#C41E3A',
    primaryGold: '#FFD700',
    darkRed: '#8B0000',
    cream: '#FFF8DC',
    brown: '#8B4513',
    darkBrown: '#5C3317',
    green: '#228B22',
    gray: '#696969',
    purple: '#9370DB',
    blue: '#4169E1'
  }
};

// Canvas 上下文
let ctx = null;

// 初始化 Canvas
function initCanvas() {
  const canvas = wx.createCanvas();
  canvas.width = CONFIG.width;
  canvas.height = CONFIG.height;
  ctx = canvas.getContext('2d');
  
  console.log('Canvas 初始化完成:', CONFIG.width, 'x', CONFIG.height);
  return canvas;
}

// 绘制渐变背景
function drawBackground() {
  const gradient = ctx.createLinearGradient(0, 0, 0, CONFIG.height);
  gradient.addColorStop(0, CONFIG.colors.cream);
  gradient.addColorStop(1, '#FFE4B5');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, CONFIG.width, CONFIG.height);
}

// 绘制状态栏
function drawStatusBar(gameData) {
  // 背景渐变
  const gradient = ctx.createLinearGradient(0, 0, 0, CONFIG.statusBarHeight);
  gradient.addColorStop(0, CONFIG.colors.darkRed);
  gradient.addColorStop(1, CONFIG.colors.primaryRed);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, CONFIG.width, CONFIG.statusBarHeight);
  
  // 绘制状态项
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 12px sans-serif';
  ctx.textAlign = 'center';
  
  const items = [
    { icon: '🪙', value: gameData.player.gold, x: 53 },
    { icon: '⭐', value: gameData.player.reputation, x: 107 },
    { icon: '💎', value: gameData.player.gem, x: 161 },
    { icon: '🕐', value: `${gameData.time.hour.toString().padStart(2, '0')}:${gameData.time.minute.toString().padStart(2, '0')}`, x: 215 },
    { icon: '📅', value: `第${gameData.time.day}天`, x: 269 },
    { icon: '👨‍🍳', value: gameData.chefs.length, x: 323 }
  ];
  
  items.forEach(item => {
    ctx.fillText(`${item.icon} ${item.value}`, item.x, 28);
  });
}

// 绘制底部导航
function drawNavBar(activeTab) {
  const y = CONFIG.height - CONFIG.navBarHeight;
  
  // 背景
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, y, CONFIG.width, CONFIG.navBarHeight);
  
  // 阴影
  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  ctx.fillRect(0, y, CONFIG.width, 2);
  
  // 导航项
  const tabs = [
    { icon: '🏠', label: '首页', key: 'home' },
    { icon: '📈', label: '经营', key: 'business' },
    { icon: '👥', label: '社交', key: 'social' },
    { icon: '💎', label: '商城', key: 'mall' }
  ];
  
  const itemWidth = CONFIG.width / 4;
  
  tabs.forEach((tab, index) => {
    const x = index * itemWidth + itemWidth / 2;
    const isActive = tab.key === activeTab;
    
    // 图标
    ctx.font = isActive ? '24px sans-serif' : '22px sans-serif';
    ctx.fillStyle = isActive ? CONFIG.colors.primaryRed : CONFIG.colors.gray;
    ctx.textAlign = 'center';
    ctx.fillText(tab.icon, x, y + 28);
    
    // 文字
    ctx.font = '12px sans-serif';
    ctx.fillText(tab.label, x, y + 48);
  });
}

// 绘制圆角矩形（微信小游戏兼容）
function drawRoundRect(x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.arc(x + width - radius, y + radius, radius, Math.PI * 1.5, Math.PI * 2, false);
  ctx.lineTo(x + width, y + height - radius);
  ctx.arc(x + width - radius, y + height - radius, radius, 0, Math.PI * 0.5, false);
  ctx.lineTo(x + radius, y + height);
  ctx.arc(x + radius, y + height - radius, radius, Math.PI * 0.5, Math.PI, false);
  ctx.lineTo(x, y + radius);
  ctx.arc(x + radius, y + radius, radius, Math.PI, Math.PI * 1.5, false);
  ctx.closePath();
}

// 绘制按钮
function drawButton(text, x, y, width, height, type = 'primary') {
  const colors = {
    primary: { bg: CONFIG.colors.primaryRed, text: '#FFFFFF' },
    gold: { bg: CONFIG.colors.primaryGold, text: CONFIG.colors.darkBrown },
    green: { bg: CONFIG.colors.green, text: '#FFFFFF' },
    purple: { bg: CONFIG.colors.purple, text: '#FFFFFF' },
    blue: { bg: CONFIG.colors.blue, text: '#FFFFFF' }
  };
  
  const color = colors[type] || colors.primary;
  
  // 按钮背景（带渐变）
  const gradient = ctx.createLinearGradient(x, y, x, y + height);
  gradient.addColorStop(0, color.bg);
  gradient.addColorStop(1, darkenColor(color.bg, 20));
  
  ctx.fillStyle = gradient;
  drawRoundRect(x, y, width, height, 8);
  ctx.fill();
  
  // 按钮文字
  ctx.fillStyle = color.text;
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x + width / 2, y + height / 2);
}

// 颜色变暗辅助函数
function darkenColor(color, percent) {
  // 简化版本，实际应该解析 hex
  return color;
}

// 绘制卡片
function drawCard(x, y, width, height, title, content) {
  // 卡片背景
  ctx.fillStyle = '#FFFFFF';
  drawRoundRect(x, y, width, height, 8);
  ctx.fill();
  
  // 阴影
  ctx.shadowColor = 'rgba(0,0,0,0.1)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 2;
  ctx.stroke();
  ctx.shadowColor = 'transparent';
  
  // 标题
  if (title) {
    ctx.fillStyle = CONFIG.colors.darkBrown;
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(title, x + 12, y + 12);
  }
  
  // 内容
  if (content) {
    ctx.fillStyle = CONFIG.colors.gray;
    ctx.font = '12px sans-serif';
    ctx.fillText(content, x + 12, y + 32);
  }
}

// 绘制统计卡片
function drawStatCard(x, y, width, height, value, label) {
  // 卡片背景
  ctx.fillStyle = '#FFFFFF';
  drawRoundRect(x, y, width, height, 8);
  ctx.fill();
  
  // 数值
  ctx.fillStyle = CONFIG.colors.primaryRed;
  ctx.font = 'bold 24px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(value, x + width / 2, y + height / 2 - 10);
  
  // 标签
  ctx.fillStyle = CONFIG.colors.gray;
  ctx.font = '12px sans-serif';
  ctx.fillText(label, x + width / 2, y + height / 2 + 14);
}

// 主渲染循环
function render(gameData, activeTab) {
  if (!ctx) return;
  
  // 清空画布
  ctx.clearRect(0, 0, CONFIG.width, CONFIG.height);
  
  // 绘制背景
  drawBackground();
  
  // 绘制状态栏
  drawStatusBar(gameData);
  
  // 根据当前 Tab 绘制内容
  const contentY = CONFIG.statusBarHeight;
  const contentHeight = CONFIG.height - CONFIG.statusBarHeight - CONFIG.navBarHeight;
  
  switch (activeTab) {
    case 'home':
      renderHome(contentY, contentHeight, gameData);
      break;
    case 'business':
      renderBusiness(contentY, contentHeight, gameData);
      break;
    case 'social':
      renderSocial(contentY, contentHeight, gameData);
      break;
    case 'mall':
      renderMall(contentY, contentHeight, gameData);
      break;
  }
  
  // 绘制底部导航
  drawNavBar(activeTab);
  
  // 提交绘制
  wx.canvasToTempFilePath({
    canvas: wx.createCanvas()
  });
}

// 渲染首页
function renderHome(y, height, gameData) {
  // 标题
  ctx.fillStyle = CONFIG.colors.darkBrown;
  ctx.font = 'bold 18px sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('🏠 首页', 16, y + 16);
  
  // 餐厅场景占位
  ctx.fillStyle = '#87CEEB';
  ctx.fillRect(16, y + 50, CONFIG.width - 32, 200);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('餐厅场景（开发中）', CONFIG.width / 2, y + 150);
  
  // 统计卡片
  const statsY = y + 270;
  drawStatCard(24, statsY, 160, 80, gameData.player.gold.toString(), '金币');
  drawStatCard(191, statsY, 160, 80, gameData.player.reputation.toString(), '声誉');
  drawStatCard(24, statsY + 90, 160, 80, gameData.chefs.length.toString(), '厨师');
  drawStatCard(191, statsY + 90, 160, 80, gameData.dishes.length.toString(), '菜品');
  
  // 快速操作按钮
  const btnY = y + 460;
  drawButton('💰 收取收益', 24, btnY, 160, 44, 'gold');
  drawButton('📈 升级管理', 191, btnY, 160, 44, 'primary');
}

// 渲染经营页
function renderBusiness(y, height, gameData) {
  ctx.fillStyle = CONFIG.colors.darkBrown;
  ctx.font = 'bold 18px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('📈 经营', 16, y + 16);
  
  ctx.fillStyle = CONFIG.colors.gray;
  ctx.font = '14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('厨师管理、菜品升级', CONFIG.width / 2, y + 100);
}

// 渲染社交页
function renderSocial(y, height, gameData) {
  ctx.fillStyle = CONFIG.colors.darkBrown;
  ctx.font = 'bold 18px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('👥 社交', 16, y + 16);
  
  ctx.fillStyle = CONFIG.colors.gray;
  ctx.font = '14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('好友系统（开发中）', CONFIG.width / 2, y + 100);
}

// 渲染商城页
function renderMall(y, height, gameData) {
  ctx.fillStyle = CONFIG.colors.darkBrown;
  ctx.font = 'bold 18px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('💎 商城', 16, y + 16);
  
  ctx.fillStyle = CONFIG.colors.gray;
  ctx.font = '14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('充值系统（开发中）', CONFIG.width / 2, y + 100);
}

// 触摸事件处理
function handleTouch(x, y, gameData, activeTab) {
  // 检测底部导航点击
  const navY = CONFIG.height - CONFIG.navBarHeight;
  if (y >= navY) {
    const itemWidth = CONFIG.width / 4;
    const tabIndex = Math.floor(x / itemWidth);
    const tabs = ['home', 'business', 'social', 'mall'];
    return { type: 'tab', tab: tabs[tabIndex] };
  }
  
  // 检测首页按钮点击
  if (activeTab === 'home') {
    const btnY = CONFIG.statusBarHeight + 460;
    if (y >= btnY && y <= btnY + 44) {
      if (x >= 24 && x <= 184) {
        return { type: 'action', action: 'collectEarnings' };
      }
      if (x >= 191 && x <= 351) {
        return { type: 'tab', tab: 'business' };
      }
    }
  }
  
  return null;
}

// 导出
window.CanvasRenderer = {
  init: initCanvas,
  render: render,
  handleTouch: handleTouch,
  CONFIG: CONFIG
};
