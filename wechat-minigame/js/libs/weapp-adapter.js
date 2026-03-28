/**
 * 微信小游戏适配器
 * 将 HTML5 游戏适配到微信小游戏环境
 */

// 模拟 window 对象
window = {
  innerWidth: 375,
  innerHeight: 667,
  devicePixelRatio: 2
};

// 模拟 document
document = {
  createElement: function(tag) {
    return {};
  }
};

// 模拟 localStorage
window.localStorage = {
  getItem: function(key) {
    try {
      return wx.getStorageSync(key);
    } catch (e) {
      return null;
    }
  },
  setItem: function(key, value) {
    try {
      wx.setStorageSync(key, value);
    } catch (e) {
      console.error('localStorage setItem error:', e);
    }
  }
};

console.log('WeApp Adapter 加载完成');
