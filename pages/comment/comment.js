// pages/eval/eval.js
const common = require('../../common/common.js');  //引入
const app = getApp();

Page({
  data: {
    movie:{},
    comment:{
      star:['太差了','较差','一般般','值得一看','强烈推荐'],
      choose:-1,
      content:'',
      maxLength:150,
    }
  },
  onLoad: function (options) {
    let that = this;
    let movieID = options.id;
    that.getRecordData(app.globalData.movie, movieID);
  },
  //点击星星评分
  commentScore:function(e){
    let that = this;
    let choose = e.currentTarget.dataset.id;
    that.setData({
      "comment.choose":choose
    })
  },
  //填写详细描述
  contentInput:function(e){
    console.log(e);
    let that = this;
    let value = e.detail.value;
    that.setData({
      "comment.content": value
    })
  },
  //提交表单
  submitScore:function(e){
    let that = this;
    let comment = that.data.comment;
    //检测
    if (comment.choose == -1){
      wx.showToast({
        icon:"none",
        title: '请为影片打个分数吧',
      })
      return false;
    }
    if (comment.content.length < 6){
      wx.showToast({
        icon: "none",
        title: '评价内容不少于6个字',
      })
      return false;
    }
    //提交到服务器
    wx.showLoading({
      title: '',
      mask: true
    })
    let param = {
      "movie_id": that.data.movie.id,
      "score": (comment.choose + 1) * 2,
      "content": comment.content,
      "avatar":app.globalData.userInfo.avatarUrl,
      "nickname": app.globalData.userInfo.nickName,
      "like":[]
    }
    that.addData(app.globalData.comments, param);
    //更新影片评分
    let totalScore = that.data.movie.total_score + (comment.choose + 1) * 2;
    let totalNum = that.data.movie.total_num + 1;
    let score = (totalScore / totalNum).toFixed(1);
    //console.log(score);
    let movieParam = {
      "total_score": totalScore,
      "total_num": totalNum,
      "score": score
    }
    that.updateData(app.globalData.movie, that.data.movie.id, movieParam);
    //更新用户信息
    that.updateUserInfoData(that.data.movie.id);
  },
  //新增一条评价
  addData: function (tableID, data) {
    new wx.BaaS.TableObject(tableID).create().set(data).save().then(res => {
      console.log(res);
    }, err => {
      console.log(err);
    })
  },
  //获取影片数据
  getRecordData:function(tableID, recordID){
    let that = this;
    new wx.BaaS.TableObject(tableID).get(recordID).then(res => {
      let obj = res.data;
      that.setData({
        movie:obj
      })
    });
  },
  //更新影片评分
  updateData:function(tableID, recordID, data){
    new wx.BaaS.TableObject(tableID).getWithoutData(recordID).set(data).update().then(res => {
      console.log(res);
    }, err => {
      console.log(err);
    })
  },
  //更新用户信息
  updateUserInfoData: function (data) {
    let that = this;
    new wx.BaaS.User().getCurrentUserWithoutData().append('have_seen',data).update().then((res) => {
      console.log(res);
      wx.hideLoading()
      wx.showModal({
        title: '评论成功',
        content: '',
        showCancel: true,
        cancelText: "返回影片",
        confirmText: "查看评价",
        success: (res) => {
          if (res.confirm) {
            common.switchTab("member")
          }
          if (res.cancel) {
            let param = {
              id:that.data.movie.id
            }
            common.redirectTo("movie_detail", param);
          }
        }
      })
    }, (err) => {
      console.log(err);
    })
  },
})