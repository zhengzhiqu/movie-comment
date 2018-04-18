let common = require('../../common/common.js');  //引入
const app = getApp()

Page({
  data:{
    movieTime:[],
    movieComment: [],
  },
  onLoad:function(){
    let that = this;
    let paramTime = {
      tableID: app.globalData.movie,
      limit:6,
      orderBy: '-release_date',
    }
    let paramComment = {
      tableID: app.globalData.movie,
      limit: 6,
      orderBy: '-total_num'
    }
    //从服务器获取数据
    common.getTableData(paramTime, function(arr){
      that.setData({
        "movieTime": arr
      })
    });
    common.getTableData(paramComment, function (arr) {
      that.setData({
        "movieComment": arr
      })
    });
  },
  //跳转到详情
  navigateToDetail: function (e) {
    let param = {};
    param.id = e.currentTarget.dataset.id;
    //console.log(param);
    common.navigateTo("movie_detail", param);
  },
  //跳转到列表
  navigateToList:function(){
    common.navigateTo("recent_movie_list");
  }
})