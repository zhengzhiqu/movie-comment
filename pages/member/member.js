// pages/member/member.js
let common = require('../../common/common.js');
const app = getApp()

Page({
  data: {
    userInfo:{},
    wantToSee:[],
    haveSeen:[],
    comments:[],
    commentsParam:{}
  },
  onLoad: function (options) {
    let that = this;
    //获取当前用户信息
    common.getUserData(function(userObj){
      //获取想看的影片信息
      let wantToSee = [];
      userObj.want_to_see.forEach(function(value, i){
        if(i >= 3){
          return false;
        }
        let seeParam = {
          tableID: app.globalData.movie,
          recordID: value,
        }
        common.getRecordData(seeParam, function(seeObj){
          wantToSee.push(seeObj);
          if (wantToSee.length == 3 || userObj.want_to_see.length){
            that.setData({
              wantToSee: wantToSee
            })
          }
        });
      });
      //获取看过的影片信息
      let haveSeen = [];
      userObj.have_seen.forEach(function (value, i) {
        if (i >= 3) {
          return false;
        }
        let seeParam = {
          tableID: app.globalData.movie,
          recordID: value,
        }
        common.getRecordData(seeParam, function (seeObj) {
          //console.log(seeObj);
          haveSeen.push(seeObj);
          if (haveSeen.length == 3 || haveSeen.length == userObj.have_seen.length) {
            that.setData({
              haveSeen: haveSeen
            })
          }
        });
      });
      //绑定用户数据
      that.setData({
        userInfo: userObj
      })
      //获取当前用户的评论信息
      let commentsParam = {
        tableID: app.globalData.comments,
        limit: 6,
        offset: 0,
        more: "true",
        text: '加载更多短评',
      }
      let query = new wx.BaaS.Query();
      query.compare('created_by', '=', that.data.userInfo.id);
      commentsParam.query = query;
      that.setData({
        commentsParam: commentsParam
      })
      that.getCommentsData(commentsParam);
    });
  },
  //获取当前用户的评论信息
  getCommentsData: function (commentsParam){
    let that = this;
    common.getTableData(commentsParam, function (arr) {
      if(arr.length == 0){
        that.setData({
          "commentsParam.more":false,
          "commentsParam.text": "没有更多短评了"
        })
        return false;
      }
      //获取评论对应的影片信息
      let index = 0;
      arr.forEach(function(value){
        let movieParam = {
          tableID: app.globalData.movie,
          recordID: value.movie_id
        }
        common.getRecordData(movieParam, function (obj) {
          //处理数据
          obj.release_date = obj.release_date.match(/\d+-\d+-\d+/g)[0];
          value = Object.assign(value, obj);
          index++;
          if (arr.length == index) {
            that.setData({
              comments: that.data.comments.concat(arr)
            })
            console.log(that.data);
          }
        });
      });
    })
  },
  //上拉加载更多
  onReachBottom: function () {
    let that = this;
    let commentsParam = that.data.commentsParam;
    if (commentsParam.more){
      commentsParam.offset = commentsParam.offset + commentsParam.limit;
      that.setData({
        commentsParam: commentsParam
      })
    }
    that.getCommentsData(commentsParam);
  },
  //跳转详情
  navigateToDetail:function(e){
    let id = e.currentTarget.dataset.id;
    let param = {
      id:id
    }
    common.navigateTo("movie_detail", param);
  },
  //跳转到列表
  navigateToList: function () {
    common.navigateTo("member_movie_list");
  }
})