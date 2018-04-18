// pages/recent_movie_list/recent_movie_list.js
const common = require('../../common/common.js');
const app = getApp();

Page({
  data: {
    tab: {
      title: ['想看', '看过'],
      content: ['want_to_see', 'have_seen'],
      index: 0
    },
    movie: [],
    userInfo:{},
    param: {}
  },
  onLoad: function (options) {
    let that = this;
    //获取当前用户信息
    common.getUserData(function(userObj){
      that.data.userObj = userObj;
      that.getMovieData();
    });
  },
  //影片切换
  movieTab: function (e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    that.setData({
      "tab.index": id,
      "movie": [],
    })
    that.getMovieData();
  },
  //加载影片内容
  getMovieData: function () {
    let that = this;
    let userObj = that.data.userObj;
    let content = that.data.tab.content[that.data.tab.index]
    let movie = [];
    userObj[content].forEach(function (value, i) {
      let seeParam = {
        tableID: app.globalData.movie,
        recordID: value,
      }
      common.getRecordData(seeParam, function (seeObj) {
        movie.push(seeObj);
        if (movie.length == userObj[content].length) {
          that.setData({
            movie: movie
          })
        }
      });
    });
  },
  //加载更多
  getMoreMovieData: function (param) {
    let that = this;
    common.getTableData(param, function (arr) {
      if (arr.length == 0) {
        that.setData({
          "param.more": false,
          "param.text": "没有更多电影了"
        })
        return false;
      }
      that.setData({
        movie: that.data.movie.concat(arr)
      })
    });
  },
  onReachBottom: function () {
    let that = this;
    let param = that.data.param;
    if (param.more) {
      param.offset = param.offset + param.limit;
      that.setData({
        param: param
      })
    }
    that.getMoreMovieData(param);
  },
  //跳转详情
  navigateToDetail: function (e) {
    let id = e.currentTarget.dataset.id;
    let param = {
      id: id
    }
    common.navigateTo("movie_detail", param);
  }
})