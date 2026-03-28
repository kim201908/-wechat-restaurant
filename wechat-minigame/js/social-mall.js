/**
 * 我的中餐厅 - 社交和商城系统
 * v1.2 版本
 */

// 从 CanvasRenderer 获取 CONFIG
const SM_CONFIG = {
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

// 辅助函数：获取 ctx
function getCtx() {
  return window.CanvasRendererCtx?.() || null;
}

// 辅助函数：绘制圆角矩形
function smDrawRoundRect(x, y, width, height, radius) {
  const ctx = getCtx();
  if (!ctx) return;
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

// 辅助函数：绘制按钮
function smDrawButton(text, x, y, width, height, type = 'primary') {
  const ctx = getCtx();
  if (!ctx) return;
  
  const colors = {
    primary: { bg: SM_CONFIG.colors.primaryRed, text: '#FFFFFF' },
    gold: { bg: SM_CONFIG.colors.primaryGold, text: SM_CONFIG.colors.darkBrown },
    green: { bg: SM_CONFIG.colors.green, text: '#FFFFFF' },
    purple: { bg: SM_CONFIG.colors.purple, text: '#FFFFFF' },
    blue: { bg: SM_CONFIG.colors.blue, text: '#FFFFFF' }
  };
  
  const color = colors[type] || colors.primary;
  ctx.fillStyle = color.bg;
  smDrawRoundRect(x, y, width, height, 8);
  ctx.fill();
  
  ctx.fillStyle = color.text;
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x + width / 2, y + height / 2);
}

// 辅助函数：绘制统计卡片
function smDrawStatCard(x, y, width, height, value, label) {
  const ctx = getCtx();
  if (!ctx) return;
  
  ctx.fillStyle = '#FFFFFF';
  smDrawRoundRect(x, y, width, height, 8);
  ctx.fill();
  
  ctx.fillStyle = SM_CONFIG.colors.primaryRed;
  ctx.font = 'bold 24px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(value, x + width / 2, y + height / 2 - 10);
  
  ctx.fillStyle = SM_CONFIG.colors.gray;
  ctx.font = '12px sans-serif';
  ctx.fillText(label, x + width / 2, y + height / 2 + 14);
}

// 渲染社交页
function renderSocialWithContext(y, height, gameData, ctx) {
  // 子导航（好友/排行/活动）
  const subNavY = y + 40;
  const subTabs = [
    { key: 'friends', label: '👥 好友' },
    { key: 'rankings', label: '🏆 排行' },
    { key: 'events', label: '🎉 活动' }
  ];
  const subTabWidth = (SM_CONFIG.width - 32) / 3;
  
  subTabs.forEach((tab, index) => {
    const x = 16 + index * subTabWidth;
    const isActive = gameData.socialSubTab === tab.key;
    
    ctx.fillStyle = isActive ? SM_CONFIG.colors.primaryRed : '#E0E0E0';
    smDrawRoundRect(x, subNavY, subTabWidth - 4, 36, 8);
    ctx.fill();
    
    ctx.fillStyle = isActive ? '#FFFFFF' : SM_CONFIG.colors.gray;
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(tab.label, x + subTabWidth / 2, subNavY + 18);
  });
  
  // 根据子 Tab 渲染内容
  const contentY = subNavY + 50;
  
  switch (gameData.socialSubTab || 'friends') {
    case 'friends':
      renderSocialFriendsWithContext(contentY, height, gameData, ctx);
      break;
    case 'rankings':
      renderSocialRankingsWithContext(contentY, height, gameData, ctx);
      break;
    case 'events':
      renderSocialEventsWithContext(contentY, height, gameData, ctx);
      break;
  }
}

// 渲染社交 - 好友
function renderSocialFriendsWithContext(y, height, gameData, ctx) {
  // 好友码卡片
  ctx.fillStyle = '#FFFFFF';
  smDrawRoundRect(16, y, SM_CONFIG.width - 32, 100, 8);
  ctx.fill();
  
  ctx.fillStyle = SM_CONFIG.colors.darkBrown;
  ctx.font = '14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('我的好友码', SM_CONFIG.width / 2, y + 25);
  
  ctx.fillStyle = SM_CONFIG.colors.primaryRed;
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText(gameData.social.friendCode, SM_CONFIG.width / 2, y + 60);
  
  // 复制按钮
  smDrawButton('📋 复制', 16, y + 75, SM_CONFIG.width - 32, 36, 'blue');
  
  // 好友列表标题
  ctx.fillStyle = SM_CONFIG.colors.darkBrown;
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('👥 好友列表', 16, y + 130);
  
  // 好友列表
  if (gameData.social.friends.length === 0) {
    ctx.fillStyle = SM_CONFIG.colors.gray;
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('暂无好友，快去添加吧！', SM_CONFIG.width / 2, y + 200);
  } else {
    gameData.social.friends.forEach((friend, index) => {
      const fy = y + 160 + index * 70;
      
      ctx.fillStyle = '#FFFFFF';
      smDrawRoundRect(16, fy, SM_CONFIG.width - 32, 60, 8);
      ctx.fill();
      
      ctx.font = '32px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('👤', 26, fy + 38);
      
      ctx.fillStyle = SM_CONFIG.colors.darkBrown;
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText(friend.name, 70, fy + 28);
      
      ctx.fillStyle = SM_CONFIG.colors.gray;
      ctx.font = '12px sans-serif';
      ctx.fillText(`${friend.restaurant} | Lv.${friend.level}`, 70, fy + 48);
      
      // 点赞按钮
      ctx.fillStyle = SM_CONFIG.colors.blue;
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('👍 点赞', SM_CONFIG.width - 70, fy + 38);
    });
  }
}

// 渲染社交 - 排行榜
function renderSocialRankingsWithContext(y, height, gameData, ctx) {
  // 等级榜
  ctx.fillStyle = SM_CONFIG.colors.darkBrown;
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('📊 等级榜', 16, y + 20);
  
  ctx.fillStyle = '#FFFFFF';
  smDrawRoundRect(16, y + 45, SM_CONFIG.width - 32, 150, 8);
  ctx.fill();
  
  ctx.fillStyle = SM_CONFIG.colors.gray;
  ctx.font = '14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🚧 功能开发中', SM_CONFIG.width / 2, y + 100);
  ctx.fillText('好友排行榜即将上线', SM_CONFIG.width / 2, y + 125);
  
  // 财富榜
  ctx.fillStyle = SM_CONFIG.colors.darkBrown;
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('💰 财富榜', 16, y + 215);
  
  ctx.fillStyle = '#FFFFFF';
  smDrawRoundRect(16, y + 240, SM_CONFIG.width - 32, 150, 8);
  ctx.fill();
  
  ctx.fillStyle = SM_CONFIG.colors.gray;
  ctx.font = '14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🚧 功能开发中', SM_CONFIG.width / 2, y + 295);
  ctx.fillText('好友排行榜即将上线', SM_CONFIG.width / 2, y + 320);
}

// 渲染社交 - 活动
function renderSocialEventsWithContext(y, height, gameData, ctx) {
  // 当前活动
  ctx.fillStyle = SM_CONFIG.colors.darkBrown;
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('🎉 当前活动', 16, y + 20);
  
  if (gameData.events.active.length === 0) {
    ctx.fillStyle = SM_CONFIG.colors.gray;
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('暂无活动', SM_CONFIG.width / 2, y + 80);
  } else {
    gameData.events.active.forEach((event, index) => {
      const fy = y + 50 + index * 140;
      
      // 活动卡片背景
      const gradient = ctx.createLinearGradient(16, fy, 16, fy + 130);
      if (event.limited) {
        gradient.addColorStop(0, '#FFE4E4');
        gradient.addColorStop(1, '#FFB6B6');
      } else {
        gradient.addColorStop(0, '#FFF8DC');
        gradient.addColorStop(1, '#FFE4B5');
      }
      ctx.fillStyle = gradient;
      smDrawRoundRect(16, fy, SM_CONFIG.width - 32, 130, 8);
      ctx.fill();
      
      // 限时标签
      if (event.limited) {
        ctx.fillStyle = SM_CONFIG.colors.primaryRed;
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText('限时', SM_CONFIG.width - 50, fy + 20);
      }
      
      // 活动标题
      ctx.fillStyle = SM_CONFIG.colors.darkBrown;
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(event.name, 26, fy + 20);
      
      // 活动描述
      ctx.fillStyle = SM_CONFIG.colors.gray;
      ctx.font = '12px sans-serif';
      ctx.fillText(event.desc, 26, fy + 45);
      
      // 活动奖励
      ctx.fillStyle = SM_CONFIG.colors.primaryRed;
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(`奖励：${event.reward}`, 26, fy + 70);
      
      // 进度条背景
      ctx.fillStyle = '#E0E0E0';
      smDrawRoundRect(26, fy + 85, SM_CONFIG.width - 52, 8, 4);
      ctx.fill();
      
      // 进度条填充
      const progress = Math.min(event.progress / event.target, 1);
      ctx.fillStyle = SM_CONFIG.colors.primaryGold;
      smDrawRoundRect(26, fy + 85, (SM_CONFIG.width - 52) * progress, 8, 4);
      ctx.fill();
      
      // 进度文字
      ctx.fillStyle = SM_CONFIG.colors.gray;
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${event.progress}/${event.target}`, SM_CONFIG.width / 2, fy + 105);
    });
  }
  
  // 已完成活动
  const completedY = y + 50 + Math.max(1, gameData.events.active.length) * 140 + 30;
  ctx.fillStyle = SM_CONFIG.colors.darkBrown;
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('🏆 已完成', 16, completedY);
  
  if (gameData.events.completed.length === 0) {
    ctx.fillStyle = SM_CONFIG.colors.gray;
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('暂无完成记录', SM_CONFIG.width / 2, completedY + 40);
  } else {
    gameData.events.completed.slice(0, 3).forEach((event, index) => {
      const fy = completedY + 50 + index * 50;
      
      ctx.fillStyle = '#F0F0F0';
      smDrawRoundRect(16, fy, SM_CONFIG.width - 32, 40, 8);
      ctx.fill();
      
      ctx.fillStyle = SM_CONFIG.colors.gray;
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`${event.name} | 奖励：${event.reward}`, 26, fy + 25);
    });
  }
}

// 渲染商城页
function renderMallWithContext(y, height, gameData, ctx) {
  // 子导航（推荐/道具/装饰）
  const subNavY = y + 40;
  const subTabs = [
    { key: 'recommend', label: '⭐ 推荐' },
    { key: 'items', label: '🎒 道具' },
    { key: 'decorations', label: '🎨 装饰' }
  ];
  const subTabWidth = (SM_CONFIG.width - 32) / 3;
  
  subTabs.forEach((tab, index) => {
    const x = 16 + index * subTabWidth;
    const isActive = gameData.mallSubTab === tab.key;
    
    ctx.fillStyle = isActive ? SM_CONFIG.colors.primaryRed : '#E0E0E0';
    smDrawRoundRect(x, subNavY, subTabWidth - 4, 36, 8);
    ctx.fill();
    
    ctx.fillStyle = isActive ? '#FFFFFF' : SM_CONFIG.colors.gray;
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(tab.label, x + subTabWidth / 2, subNavY + 18);
  });
  
  // 根据子 Tab 渲染内容
  const contentY = subNavY + 50;
  
  switch (gameData.mallSubTab || 'recommend') {
    case 'recommend':
      renderMallRecommendWithContext(contentY, height, gameData, ctx);
      break;
    case 'items':
      renderMallItemsWithContext(contentY, height, gameData, ctx);
      break;
    case 'decorations':
      renderMallDecorationsWithContext(contentY, height, gameData, ctx);
      break;
  }
}

// 渲染商城 - 推荐
function renderMallRecommendWithContext(y, height, gameData, ctx) {
  // 首充礼包
  if (!gameData.hasFirstCharge) {
    const gradient = ctx.createLinearGradient(16, y, 16, y + 280);
    gradient.addColorStop(0, '#FFD700');
    gradient.addColorStop(1, '#FFA500');
    ctx.fillStyle = gradient;
    smDrawRoundRect(16, y, SM_CONFIG.width - 32, 280, 8);
    ctx.fill();
    
    // 限时特惠标签
    ctx.save();
    ctx.translate(SM_CONFIG.width - 40, y + 40);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = SM_CONFIG.colors.primaryRed;
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('限时特惠', 0, 0);
    ctx.restore();
    
    // 标题
    ctx.fillStyle = SM_CONFIG.colors.darkBrown;
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🎁 首充礼包', SM_CONFIG.width / 2, y + 30);
    
    // 奖励内容
    ctx.fillStyle = '#FFFFFF';
    smDrawRoundRect(26, y + 50, 150, 100, 8);
    ctx.fill();
    ctx.font = '32px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('💎', 101, y + 90);
    ctx.fillStyle = SM_CONFIG.colors.darkBrown;
    ctx.font = '12px sans-serif';
    ctx.fillText('钻石×180', 101, y + 120);
    
    ctx.fillStyle = '#FFFFFF';
    smDrawRoundRect(196, y + 50, 150, 100, 8);
    ctx.fill();
    ctx.font = '32px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🪙', 271, y + 90);
    ctx.fillStyle = SM_CONFIG.colors.darkBrown;
    ctx.font = '12px sans-serif';
    ctx.fillText('金币×5000', 271, y + 120);
    
    // 价格
    ctx.fillStyle = SM_CONFIG.colors.primaryRed;
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('¥6', SM_CONFIG.width / 2, y + 190);
    
    // 购买按钮
    smDrawButton('立即充值', 16, y + 215, SM_CONFIG.width - 32, 50, 'primary');
  }
  
  // 尊享月卡
  const monthCardY = gameData.hasFirstCharge ? y : y + 290;
  
  const gradient = ctx.createLinearGradient(16, monthCardY, 16, monthCardY + 120);
  gradient.addColorStop(0, SM_CONFIG.colors.purple);
  gradient.addColorStop(1, '#6A5ACD');
  ctx.fillStyle = gradient;
  smDrawRoundRect(16, monthCardY, SM_CONFIG.width - 32, 120, 8);
  ctx.fill();
  
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 18px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('💎 尊享月卡', SM_CONFIG.width / 2, monthCardY + 30);
  
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '12px sans-serif';
  ctx.fillText('每日领取 100 钻石', SM_CONFIG.width / 2, monthCardY + 55);
  ctx.fillText('特权：外卖收益 +20%', SM_CONFIG.width / 2, monthCardY + 75);
  
  if (gameData.monthCard.isActive) {
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(`有效期至：${gameData.monthCard.expireDate}`, SM_CONFIG.width / 2, monthCardY + 100);
  } else {
    smDrawButton('¥30 开通', 16, monthCardY + 95, SM_CONFIG.width - 32, 40, 'gold');
  }
  
  // 充值选项
  const rechargeY = monthCardY + 130;
  ctx.fillStyle = SM_CONFIG.colors.darkBrown;
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('💎 充值中心', 16, rechargeY);
  
  const recharges = [
    { amount: 60, price: 6, popular: false },
    { amount: 300, price: 30, popular: true },
    { amount: 980, price: 98, popular: false },
    { amount: 2480, price: 248, popular: false }
  ];
  
  recharges.forEach((r, index) => {
    const x = 16 + (index % 2) * 170;
    const ry = rechargeY + 30 + Math.floor(index / 2) * 90;
    
    ctx.fillStyle = r.popular ? '#FFF8DC' : '#FFFFFF';
    smDrawRoundRect(x, ry, 160, 80, 8);
    ctx.fill();
    
    if (r.popular) {
      ctx.fillStyle = SM_CONFIG.colors.primaryRed;
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('热门推荐', x + 80, ry - 5);
    }
    
    ctx.fillStyle = SM_CONFIG.colors.purple;
    ctx.font = '32px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('💎', x + 80, ry + 30);
    
    ctx.fillStyle = SM_CONFIG.colors.darkBrown;
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(`${r.amount} 钻石`, x + 80, ry + 55);
    
    ctx.fillStyle = SM_CONFIG.colors.primaryRed;
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(`¥${r.price}`, x + 80, ry + 75);
  });
}

// 渲染商城 - 道具
function renderMallItemsWithContext(y, height, gameData, ctx) {
  ctx.fillStyle = SM_CONFIG.colors.gray;
  ctx.font = '14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('道具商城开发中', SM_CONFIG.width / 2, y + 100);
}

// 渲染商城 - 装饰
function renderMallDecorationsWithContext(y, height, gameData, ctx) {
  ctx.fillStyle = SM_CONFIG.colors.gray;
  ctx.font = '14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('装饰商城开发中', SM_CONFIG.width / 2, y + 100);
}

// 导出
window.SocialMallRenderer = {
  renderSocialWithContext,
  renderMallWithContext,
  renderSocialFriendsWithContext,
  renderSocialRankingsWithContext,
  renderSocialEventsWithContext,
  renderMallRecommendWithContext,
  renderMallItemsWithContext,
  renderMallDecorationsWithContext
};
