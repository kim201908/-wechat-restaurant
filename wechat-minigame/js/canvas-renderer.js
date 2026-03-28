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

// 导出 ctx 供其他模块使用
window.CanvasRendererCtx = () => ctx;

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
  if (!ctx) {
    console.error('[CanvasRenderer] ctx 未初始化，跳过渲染');
    return;
  }
  
  try {
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
    
    // 微信小游戏会自动渲染 Canvas，无需额外调用
  } catch (e) {
    console.error('[CanvasRenderer] 渲染错误:', e.message);
    // 兜底：显示错误信息
    ctx.fillStyle = '#FF0000';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('渲染错误：' + e.message, CONFIG.width / 2, CONFIG.height / 2);
  }
}

// 渲染首页
function renderHome(y, height, gameData) {
  // 标题
  ctx.fillStyle = CONFIG.colors.darkBrown;
  ctx.font = 'bold 18px sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('🏠 首页', 16, y + 16);
  
  // 餐厅场景可视化
  ctx.fillStyle = '#87CEEB';
  drawRoundRect(16, y + 50, CONFIG.width - 32, 200, 8);
  ctx.fill();
  
  // 地板
  ctx.fillStyle = '#DEB887';
  drawRoundRect(26, y + 130, CONFIG.width - 52, 110, 8);
  ctx.fill();
  
  // 显示已购买的家具
  if (gameData.furnitures && gameData.furnitures.length > 0) {
    gameData.furnitures.forEach((f) => {
      ctx.font = '28px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(f.icon, f.x + 10, y + 140 + f.y);
    });
  } else {
    ctx.fillStyle = CONFIG.colors.gray;
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('去商店购买家具装饰餐厅吧！', CONFIG.width / 2, y + 150);
  }
  
  // 顾客（简单表示）
  ctx.font = '24px sans-serif';
  for (let i = 0; i < Math.min(gameData.chefs.length, 3); i++) {
    ctx.fillText('👤', 50 + i * 100, y + 180);
  }
  
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
  // 子导航（餐厅/厨房/外卖）
  const subNavY = y + 40;
  const subTabs = [
    { key: 'restaurant', label: '🏪 餐厅' },
    { key: 'kitchen', label: '🍳 厨房' },
    { key: 'delivery', label: '🛵 外卖' }
  ];
  const subTabWidth = (CONFIG.width - 32) / 3;
  
  subTabs.forEach((tab, index) => {
    const x = 16 + index * subTabWidth;
    const isActive = gameData.businessSubTab === tab.key;
    
    ctx.fillStyle = isActive ? CONFIG.colors.primaryRed : '#E0E0E0';
    drawRoundRect(x, subNavY, subTabWidth - 4, 36, 8);
    ctx.fill();
    
    ctx.fillStyle = isActive ? '#FFFFFF' : CONFIG.colors.gray;
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(tab.label, x + subTabWidth / 2, subNavY + 18);
  });
  
  // 根据子 Tab 渲染内容
  const contentY = subNavY + 50;
  
  switch (gameData.businessSubTab || 'restaurant') {
    case 'restaurant':
      renderBusinessRestaurant(contentY, height, gameData);
      break;
    case 'kitchen':
      renderBusinessKitchen(contentY, height, gameData);
      break;
    case 'delivery':
      renderBusinessDelivery(contentY, height, gameData);
      break;
  }
}

// 渲染经营 - 餐厅
function renderBusinessRestaurant(y, height, gameData) {
  ctx.fillStyle = CONFIG.colors.darkBrown;
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('🏪 餐厅装修', 16, y + 20);
  
  // 预览区域（可摆放家具）
  ctx.fillStyle = '#87CEEB';
  drawRoundRect(16, y + 40, CONFIG.width - 32, 200, 8);
  ctx.fill();
  
  // 地板
  ctx.fillStyle = '#DEB887';
  drawRoundRect(26, y + 120, CONFIG.width - 52, 110, 8);
  ctx.fill();
  
  // 显示已购买的家具（可拖拽）
  if (gameData.furnitures && gameData.furnitures.length > 0) {
    gameData.furnitures.forEach((f, index) => {
      const fx = f.x || (36 + (index % 4) * 70);
      const fy = f.y !== undefined ? f.y : Math.floor(index / 4) * 45;
      
      // 如果正在拖拽，绘制高亮
      if (gameData.dragState.isDragging && gameData.dragState.dragIndex === index) {
        ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
        drawRoundRect(fx - 15, y + 130 + fy - 15, 50, 50, 8);
        ctx.fill();
      }
      
      ctx.font = '28px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(f.icon, fx, y + 140 + fy);
      
      // 提示文字
      ctx.fillStyle = CONFIG.colors.gray;
      ctx.font = '10px sans-serif';
      ctx.fillText('👆 拖拽', fx, y + 165 + fy);
    });
  } else {
    ctx.fillStyle = CONFIG.colors.gray;
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('点击下方家具购买摆放', CONFIG.width / 2, y + 140);
  }
  
  // 家具商店标题
  ctx.fillStyle = CONFIG.colors.darkBrown;
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('🛒 家具商店', 16, y + 260);
  
  // 家具网格
  const furnitures = [
    { icon: '🪑', name: '餐桌', price: 500, id: 'table' },
    { icon: '🪑', name: '椅子', price: 200, id: 'chair' },
    { icon: '🌿', name: '绿植', price: 100, id: 'plant' },
    { icon: '🖼️', name: '装饰画', price: 300, id: 'painting' },
    { icon: '💡', name: '吊灯', price: 800, id: 'lamp' },
    { icon: '🪴', name: '盆栽', price: 150, id: 'pot' }
  ];
  
  furnitures.forEach((f, index) => {
    const x = 16 + (index % 3) * 110;
    const fy = y + 290 + Math.floor(index / 3) * 75;
    
    ctx.fillStyle = '#FFFFFF';
    drawRoundRect(x, fy, 100, 65, 8);
    ctx.fill();
    
    ctx.font = '28px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(f.icon, x + 50, fy + 28);
    
    ctx.fillStyle = CONFIG.colors.darkBrown;
    ctx.font = '12px sans-serif';
    ctx.fillText(f.name, x + 50, fy + 48);
    
    ctx.fillStyle = CONFIG.colors.primaryRed;
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(`💰${f.price}`, x + 50, fy + 62);
  });
}

// 渲染经营 - 厨房
function renderBusinessKitchen(y, height, gameData) {
  // 厨师列表
  ctx.fillStyle = CONFIG.colors.darkBrown;
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('👨‍🍳 厨师管理', 16, y + 20);
  
  gameData.chefs.forEach((chef, index) => {
    const fy = y + 50 + index * 70;
    
    ctx.fillStyle = '#FFFFFF';
    drawRoundRect(16, fy, CONFIG.width - 32, 60, 8);
    ctx.fill();
    
    ctx.font = '32px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('👨‍🍳', 26, fy + 38);
    
    ctx.fillStyle = CONFIG.colors.darkBrown;
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(`${chef.name} Lv.${chef.level}`, 70, fy + 28);
    
    ctx.fillStyle = CONFIG.colors.gray;
    ctx.font = '12px sans-serif';
    ctx.fillText(`速度：${chef.speed}`, 70, fy + 48);
  });
  
  // 雇佣按钮
  const btnY = y + 50 + gameData.chefs.length * 70 + 20;
  drawButton('📢 雇佣新厨师 (💰500)', 16, btnY, CONFIG.width - 32, 44, 'primary');
  
  // 菜品管理
  const dishesY = btnY + 60;
  ctx.fillStyle = CONFIG.colors.darkBrown;
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('🍜 菜品管理', 16, dishesY);
  
  gameData.dishes.forEach((dish, index) => {
    const fy = dishesY + 30 + index * 70;
    
    ctx.fillStyle = dish.unlocked ? '#FFFFFF' : '#E0E0E0';
    drawRoundRect(16, fy, CONFIG.width - 32, 60, 8);
    ctx.fill();
    
    const icon = dish.unlocked ? '🍜' : '🔒';
    ctx.font = '28px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(icon, 26, fy + 38);
    
    ctx.fillStyle = dish.unlocked ? CONFIG.colors.darkBrown : CONFIG.colors.gray;
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(`${dish.name} Lv.${dish.level}`, 70, fy + 28);
    
    ctx.fillStyle = CONFIG.colors.gray;
    ctx.font = '12px sans-serif';
    ctx.fillText(`价格：💰${dish.price}`, 70, fy + 48);
  });
}

// 渲染经营 - 外卖
function renderBusinessDelivery(y, height, gameData) {
  ctx.fillStyle = CONFIG.colors.darkBrown;
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('🛵 外卖订单', 16, y + 20);
  
  // 统计
  drawStatCard(16, y + 50, 100, 60, '0', '今日单数');
  drawStatCard(126, y + 50, 100, 60, '¥0', '今日收入');
  drawStatCard(236, y + 50, 100, 60, '¥0', '历史收入');
  
  // 生成订单按钮
  const btnY = y + 130;
  drawButton('➕ 生成订单', 16, btnY, CONFIG.width - 32, 44, 'primary');
  
  // 订单列表
  ctx.fillStyle = CONFIG.colors.gray;
  ctx.font = '14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('暂无订单', CONFIG.width / 2, btnY + 70);
}

// 渲染社交页 - 转发到 social-mall.js
function renderSocial(y, height, gameData) {
  if (window.SocialMallRenderer) {
    window.SocialMallRenderer.renderSocialWithContext(y, height, gameData, ctx);
  }
}

// 渲染商城页 - 转发到 social-mall.js
function renderMall(y, height, gameData) {
  if (window.SocialMallRenderer) {
    window.SocialMallRenderer.renderMallWithContext(y, height, gameData, ctx);
  }
}

// 触摸事件处理
function handleTouch(x, y, gameData, activeTab) {
  // 检测底部导航点击（优先检查，允许 Y 超出 Canvas）
  const navY = CONFIG.height - CONFIG.navBarHeight;
  
  // 底部导航：Y >= navY 且 X 在范围内（微信开发者工具坐标可能超出 Canvas）
  if (y >= navY && x >= 0 && x <= CONFIG.width) {
    const itemWidth = CONFIG.width / 4;
    const tabIndex = Math.floor(x / itemWidth);
    const tabs = ['home', 'business', 'social', 'mall'];
    return { type: 'tab', tab: tabs[tabIndex] };
  }
  
  // 经营 Tab 子导航检测（根据实际点击调整）
  if (activeTab === 'business') {
    // 根据日志 Y=90-97 能点中，Y=127+ 点不中，说明按钮在 95-130 左右
    if (y >= 90 && y <= 140 && x >= 16 && x <= CONFIG.width - 16) {
      const subTabWidth = (CONFIG.width - 32) / 3;
      const subTabIndex = Math.floor((x - 16) / subTabWidth);
      const subTabs = ['restaurant', 'kitchen', 'delivery'];
      
      if (subTabIndex >= 0 && subTabIndex < 3) {
        return { type: 'subtab', subtab: subTabs[subTabIndex], tabGroup: 'business' };
      }
    }
    
    // 经营 - 厨房：雇佣厨师按钮
    if (gameData.businessSubTab === 'kitchen') {
      const btnY = CONFIG.statusBarHeight + 50 + gameData.chefs.length * 70 + 20;
      if (y >= btnY && y <= btnY + 44 && x >= 16 && x <= CONFIG.width - 16) {
        return { type: 'action', action: 'recruitChef' };
      }
      
      // 菜品点击（升级）
      gameData.dishes.forEach((dish, index) => {
        const dishY = CONFIG.statusBarHeight + 50 + 60 + 30 + index * 70;
        if (y >= dishY && y <= dishY + 60 && x >= 16 && x <= CONFIG.width - 16 && dish.unlocked) {
          return { type: 'action', action: 'upgradeDish', dishId: dish.id };
        }
      });
    }
    
    // 经营 - 外卖：生成订单按钮
    if (gameData.businessSubTab === 'delivery') {
      // 根据日志，点击 Y=361，所以检测范围 340-400
      if (y >= 340 && y <= 400 && x >= 16 && x <= CONFIG.width - 16) {
        return { type: 'action', action: 'generateOrder' };
      }
    }
    
    // 经营 - 餐厅：购买家具
    console.log(`[家具检测] businessSubTab=${gameData.businessSubTab}, 点击 Y=${y}, X=${x}`);
    
    if (gameData.businessSubTab === 'restaurant') {
      const furnitures = [
        { icon: '🪑', name: '餐桌', price: 500, id: 'table' },
        { icon: '🪑', name: '椅子', price: 200, id: 'chair' },
        { icon: '🌿', name: '绿植', price: 100, id: 'plant' },
        { icon: '🖼️', name: '装饰画', price: 300, id: 'painting' },
        { icon: '💡', name: '吊灯', price: 800, id: 'lamp' },
        { icon: '🪴', name: '盆栽', price: 150, id: 'pot' }
      ];
      
      // 根据日志，点击 Y=584-605，说明实际渲染位置在 550-650 左右
      furnitures.forEach((f, index) => {
        const fx = 16 + (index % 3) * 110;
        const fy = 550 + Math.floor(index / 3) * 75;
        
        console.log(`[家具${index}] ${f.name} 位置：(${fx},${fy}), 点击：(${x},${y})`);
        
        if (y >= fy && y <= fy + 75 && x >= fx && x <= fx + 100) {
          console.log(`[家具购买] ✅ 点击到 ${f.name}`);
          return { type: 'action', action: 'buyFurniture', furniture: f };
        }
      });
      
      console.log('[家具购买] ❌ 未点击到任何家具');
    } else {
      console.log(`[家具检测] ❌ 当前不在餐厅 Tab，当前是：${gameData.businessSubTab}`);
    }
  }
  
  // 社交 Tab 子导航检测
  if (activeTab === 'social') {
    console.log(`[社交子导航] 检测：Y=${y}, X=${x}, 范围 90-140`);
    if (y >= 90 && y <= 140 && x >= 16 && x <= CONFIG.width - 16) {
      const subTabWidth = (CONFIG.width - 32) / 3;
      const subTabIndex = Math.floor((x - 16) / subTabWidth);
      const subTabs = ['friends', 'rankings', 'events'];
      
      console.log(`[社交子导航] ✅ 索引:${subTabIndex}, 结果:${subTabs[subTabIndex]}`);
      
      if (subTabIndex >= 0 && subTabIndex < 3) {
        return { type: 'subtab', subtab: subTabs[subTabIndex], tabGroup: 'social' };
      }
    } else {
      console.log('[社交子导航] ❌ 不在范围内');
    }
    
    // 好友页：复制好友码按钮
    if (gameData.socialSubTab === 'friends') {
      // 根据日志，点击 Y=290，所以检测范围 270-330
      if (y >= 270 && y <= 330 && x >= 16 && x <= CONFIG.width - 16) {
        return { type: 'action', action: 'copyFriendCode' };
      }
    }
  }
  
  // 商城 Tab 子导航检测
  if (activeTab === 'mall') {
    console.log(`[商城子导航] 检测：Y=${y}, X=${x}, 范围 90-140`);
    if (y >= 90 && y <= 140 && x >= 16 && x <= CONFIG.width - 16) {
      const subTabWidth = (CONFIG.width - 32) / 3;
      const subTabIndex = Math.floor((x - 16) / subTabWidth);
      const subTabs = ['recommend', 'items', 'decorations'];
      
      console.log(`[商城子导航] ✅ 索引:${subTabIndex}, 结果:${subTabs[subTabIndex]}`);
      
      if (subTabIndex >= 0 && subTabIndex < 3) {
        return { type: 'subtab', subtab: subTabs[subTabIndex], tabGroup: 'mall' };
      }
    } else {
      console.log('[商城子导航] ❌ 不在范围内');
    }
    
    // 推荐页：首充礼包购买
    if (gameData.mallSubTab === 'recommend' && !gameData.hasFirstCharge) {
      const btnY = CONFIG.statusBarHeight + 215;
      if (y >= btnY && y <= btnY + 50 && x >= 16 && x <= CONFIG.width - 16) {
        return { type: 'action', action: 'buyFirstCharge' };
      }
    }
    
    // 推荐页：月卡购买
    const monthCardY = gameData.hasFirstCharge ? CONFIG.statusBarHeight + 290 : CONFIG.statusBarHeight + 290;
    if (gameData.mallSubTab === 'recommend' && !gameData.monthCard.isActive) {
      const btnY = monthCardY + 95;
      if (y >= btnY && y <= btnY + 40 && x >= 16 && x <= CONFIG.width - 16) {
        return { type: 'action', action: 'buyMonthCard' };
      }
    }
    
    // 推荐页：充值选项点击
    const rechargeY = monthCardY + 130;
    if (gameData.mallSubTab === 'recommend') {
      for (let i = 0; i < 4; i++) {
        const rx = 16 + (i % 2) * 170;
        const ry = rechargeY + 30 + Math.floor(i / 2) * 90;
        if (y >= ry && y <= ry + 80 && x >= rx && x <= rx + 160) {
          const amounts = [60, 300, 980, 2480];
          const prices = [6, 30, 98, 248];
          return { type: 'action', action: 'buyDiamonds', amount: amounts[i], price: prices[i] };
        }
      }
    }
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

// 检查是否点击了家具（用于拖拽）
function checkFurnitureDrag(x, y, gameData) {
  if (!gameData.furnitures || gameData.furnitures.length === 0) {
    console.log('[拖拽检测] 没有家具');
    return null;
  }
  
  // 预览区域的 Y 范围
  const previewY = CONFIG.statusBarHeight + 40;
  const previewHeight = 200;
  
  console.log(`[拖拽检测] 点击 (${x.toFixed(1)}, ${y.toFixed(1)}), 预览区域 Y: ${previewY}-${previewY + previewHeight}`);
  
  // 检查 Y 是否在预览区域内
  if (y < previewY || y > previewY + previewHeight) {
    console.log('[拖拽检测] Y 不在预览区域');
    return null;
  }
  
  // 检查每个家具
  for (let i = 0; i < gameData.furnitures.length; i++) {
    const f = gameData.furnitures[i];
    const fx = f.x || (36 + (i % 4) * 70);
    const fy = f.y !== undefined ? f.y : Math.floor(i / 4) * 45;
    const furnitureY = previewY + 130 + fy;
    
    console.log(`[拖拽检测] 家具${i}: ${f.icon} 位置 (${fx}, ${furnitureY})`);
    
    // 检查是否点击在家具范围内（40x40 的区域）
    if (x >= fx - 20 && x <= fx + 20 && y >= furnitureY - 20 && y <= furnitureY + 20) {
      console.log(`[拖拽检测] ✅ 点击到家具${i}`);
      return {
        isDragging: true,
        dragIndex: i,
        offsetX: x - fx,
        offsetY: y - furnitureY
      };
    }
  }
  
  console.log('[拖拽检测] ❌ 未点击到任何家具');
  return null;
}

// 导出
window.CanvasRenderer = {
  init: initCanvas,
  render: render,
  handleTouch: handleTouch,
  checkFurnitureDrag: checkFurnitureDrag,
  CONFIG: CONFIG,
  // 辅助函数导出（供 social-mall.js 使用）
  drawRoundRect: drawRoundRect,
  drawButton: drawButton,
  drawStatCard: drawStatCard
};
