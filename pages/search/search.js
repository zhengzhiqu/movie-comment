// pages/search/search.js
let common = require("../../common/common.js");
let app = getApp();

Page({
  data: {
    param:{},
    movie:[],
    searchName:[],
    searchHotName:[],
    search:{}
  },
  onLoad: function (options) {
    let that = this;
    //获取历史记录
    that.getStorage();
    let param = {
      tableID: app.globalData.movie,
      limit:20,
      text:"加载更多",
      more:true
    }
    //获取热门搜索
    that.searchHotMovie();
    that.data.param = param;
  },
  cancel: function () {
    common.navigateBack();
  },
  //热门搜索
  searchHotMovie:function(){
    let that = this;
    let param = {
      tableID:app.globalData.movie,
      orderBy:'-search_count',
      limit:6
    }
    common.getTableData(param, function(arr){
      that.setData({
        searchHotName:arr
      })
    });
  },
  //输入框监听事件
  searchMovie:function(e){
    //console.log(e);
    let that = this;
    let search = {
      show: true,
      loading: true,
      text: "正在查找影片信息..."
    }
    that.setData({
      search: search,
      searchName:[],
      searchHotName: [],
      movie: [],
    })
    let searchValue = e.detail.value;
    if (!searchValue){
      return false;
    }
    let query = new wx.BaaS.Query();
    query.contains("name_cn", searchValue);
    let param = that.data.param;
    param.query = query;
    common.getTableData(param, function(arr){
      console.log(arr);
      if(arr.length == 0){
        let search = {
          show: true,
          loading: false,
          text: "没有相关的影片信息"
        }
        that.setData({
          search: search
        })
        return false;
      }else{
        let search = {
          show:false,
          loading: false,
          text: "没有相关的影片信息"
        }
        that.setData({
          search: search
        })
      }
      //格式化时间
      arr.forEach(function(value){
        value.release_date = value.release_date.match(/\d+/g)[0];
      });
      that.setData({
        movie:arr
      })
    });
  },
  //点击历史记录搜索
  searchHistory:function(e){
    let that = this;
    let searchName = e.currentTarget.dataset.name;
    let searchValue = {
      detail:{
        value: searchName
      }
    }
    that.searchMovie(searchValue);
  },
  //获取历史记录
  getStorage:function(){
    let that = this;
    let searchName = wx.BaaS.storage.get('searchname');
    console.log(searchName);
    if (searchName){
      if (searchName.indexOf('|') > 0){
        searchName = searchName.split('|');
      }else{
        searchName[0] = searchName;
      }
      that.setData({
        searchName: searchName
      })
    }
  },
  //存储历史记录
  setSearchName:function(e){
    let searchValue = e.detail.value;
    let searchName = wx.BaaS.storage.get('searchname');
    if (!searchValue || searchName.indexOf(searchValue) >= 0) {
      return false;
    }
    if (searchName){
      searchName = searchName + '|' + searchValue;
    }else{
      searchName = searchValue;
    }
    wx.BaaS.storage.set('searchname', searchName);
    console.log(searchName);
  },
  //清除历史记录
  clearSearchName:function(){
    let that = this;
    wx.clearStorage();
    that.setData({
      searchName: []
    })
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