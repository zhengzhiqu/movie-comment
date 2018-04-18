//app.js
App({
  onLaunch: function (options) {
    //加载 SDK
    require("./sdk-v1.3.0.js");
    //初始化 SDK
    let clientID = '9406da9126b96424cba7'
    wx.BaaS.init(clientID)
    this.getUserInfo();
  },
  //获取用户信息
  getUserInfo: function () {
    let that = this;
    //获取用户信息
    let uid = wx.BaaS.storage.get('uid'),userInfo;
    if (uid){
      userInfo = wx.BaaS.storage.get('userinfo');
      that.globalData.userInfo = userInfo;
      //console.log(userInfo);
    }else{
      that.login();
    }
  },
  //授权登录
  login:function(){
    let that = this;
    wx.BaaS.login().then((res) => {
      //console.log(res);
      that.globalData.userInfo = res;
    },(res) => {
      //授权失败
      that.authorizeSetting();
    })
  },
  //打开授权设置
  authorizeSetting: function () {
    let that = this;
    wx.openSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          that.login();
        }
      }
    })
  },
  //五星评分函数
  drawStar: function (score) {
    const ctx = wx.createCanvasContext('star');
    const r = 2.5, R = 6;
    let x = 10, y = 10, n, mod;
    score = (score / 2).toFixed(2);
    score = score.split(".");
    //console.log(score);
    n = score[0];
    mod = score[1] * 0.01;
    /**点亮金色星星 */
    for (let i = 0; i < n; i++) {
      ctx.beginPath();
      for (let j = 0; j < 5; j++) {
        ctx.lineTo(Math.cos((18 + 72 * j) * Math.PI / 180) * R + x, -Math.sin((18 + 72 * j) * Math.PI / 180) * R + y);
        ctx.lineTo(Math.cos((54 + 72 * j) * Math.PI / 180) * r + x, -Math.sin((54 + 72 * j) * Math.PI / 180) * r + y);
      }
      ctx.setFillStyle("#f9bc25");
      ctx.fill();
      x = x + 15;
    }
    /**一半星星 */
    if (n != 5) {
      ctx.beginPath();
      for (let j = 0; j < 5; j++) {
        ctx.lineTo(Math.cos((18 + 72 * j) * Math.PI / 180) * R + x, -Math.sin((18 + 72 * j) * Math.PI / 180) * R + y);
        ctx.lineTo(Math.cos((54 + 72 * j) * Math.PI / 180) * r + x, -Math.sin((54 + 72 * j) * Math.PI / 180) * r + y);
      }
      //ctx.setFillStyle("#f9bc25");
      const grd = ctx.createLinearGradient(x - 5, y, x + 5, y);
      grd.addColorStop(0, '#f9bc25');
      grd.addColorStop(mod, '#f9bc25');
      grd.addColorStop(mod, '#dddddd');
      grd.addColorStop(1, '#dddddd');
      ctx.setFillStyle(grd);
      ctx.fill();
      x = x + 15;
    }
    /**灰色星星 */
    for (let i = 0; i < 5 - n - 1; i++) {
      ctx.beginPath();
      for (let j = 0; j < 5; j++) {
        ctx.lineTo(Math.cos((18 + 72 * j) * Math.PI / 180) * R + x, -Math.sin((18 + 72 * j) * Math.PI / 180) * R + y);
        ctx.lineTo(Math.cos((54 + 72 * j) * Math.PI / 180) * r + x, -Math.sin((54 + 72 * j) * Math.PI / 180) * r + y);
      }
      ctx.setFillStyle("#dddddd");
      ctx.fill();
      x = x + 15;
    }
    ctx.closePath();
    ctx.draw();
  },
  globalData: {
    comments: 30735,
    movie: 30654,
    defaultAvatar:'https://cloud-minapp-9266.cloud.ifanrusercontent.com/1f5pXfGhFgVmswkS.jpg',
    userInfo:{}
  },
})