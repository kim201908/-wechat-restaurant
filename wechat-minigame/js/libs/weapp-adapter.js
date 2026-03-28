/**
 * 微信小游戏适配器
 * 将 HTML5 游戏适配到微信小游戏环境
 */

// 微信小游戏环境已经有 window 对象，只需要补充缺失的 API

// 模拟 localStorage
if (!window.localStorage) {
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
}

// 模拟 document（微信小游戏没有 DOM）
if (!window.document) {
  window.document = {
    createElement: function(tag) {
      return {};
    }
  };
}

console.log('WeApp Adapter 加载完成');
