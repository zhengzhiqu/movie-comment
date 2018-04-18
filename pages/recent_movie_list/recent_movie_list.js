// pages/recent_movie_list/recent_movie_list.js
const common = require('../../common/common.js');
const app = getApp();

Page({
  data: {
    tab:{
      title: ['综合排序', '按时间', '按评分'],
      orderBy: ['created_at', '-release_date', '-score'],
      index:0
    },
    movie:[],
    param:{}
  },
  onLoad: function (options) {
    let that = this;
    that.getMovieData();
  },
  //影片切换
  movieTab:function(e){
    let that = this;
    let id = e.currentTarget.dataset.id;
    that.setData({
      "tab.index":id,
      "movie":[],
    })
    that.getMovieData();
  },
  //加载影片内容
  getMovieData:function(){
    let that = this;
    let param = {
      tableID: app.globalData.movie,
      orderBy: that.data.tab.orderBy[that.data.tab.index],
      limit: 9,
      offset: 0,
      more: true,
      text: '加载更多影片',
    }
    that.data.param = param;
    that.getMoreMovieData(param);
  },
  //加载更多
  getMoreMovieData: function (param){
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