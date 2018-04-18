let common = require('../../common/common.js');  //引入
let util = require('../../utils/util.js');  //引入
const app = getApp()

Page({
  data: {
    movie:{},
    userInfo:{},
    comments:[],
    load:{
      text:'加载更多短评',
      more:true,
      limit:4,
      offset:0,
    }
  },
  onLoad: function (options) {
    //console.log(options);
    let that = this;
    let recordID = options.id;
    that.setData({
      "movie.id": recordID
    })
    that.getRecordData(app.globalData.movie, recordID);
    that.searchCommentsData(app.globalData.comments, that.data.movie.id, that.data.load.limit, that.data.load.offset);
    that.getUserInfo();
  },
  //获取本机用户信息
  getUserInfo:function(){
    let obj = {}, that = this;
    let uid = wx.BaaS.storage.get('uid').toString();
    //获取用户信息
    new wx.BaaS.User().get(uid).then((res) => {
      //console.log(res);
      obj = res.data;
      obj.uid = uid;
      that.setData({
        userInfo:obj
      })
    }, (err) => {

    }).then(function(){
      //想看
      let movie = that.data.movie;
      let index = obj.want_to_see.indexOf(movie.id);
      if(index == -1){
        movie.wantToSee = false;
      }else{
        movie.wantToSee = true;
      }
      index = obj.have_seen.indexOf(movie.id);
      if (index == -1) {
        movie.haveSeen = false;
      } else {
        movie.haveSeen = true;
      }
      that.setData({
        movie: movie
      })
    })
  },
  //想看
  collection:function(){
    let that = this;
    let movie = that.data.movie;
    let userInfo = that.data.userInfo;
    movie.wantToSee = !movie.wantToSee;
    common.arrAddDel(userInfo.want_to_see, movie.id);
    that.setData({
      movie:movie
    })
    //更新用户数据
    let param = {
      "want_to_see": userInfo.want_to_see
    }
    that.updateUserInfoData(param);
  },
  //获取影片数据
  getRecordData: function (tableID, recordID) {
    let that = this;
    new wx.BaaS.TableObject(tableID).get(recordID).then((res) => {
      let obj = res.data;
      //评分
      app.drawStar(obj.score);
      //处理数据
      obj.release_date = obj.release_date.match(/\d+-\d+-\d+/g)[0];
      //比较上映时间
      let currentDate = util.formatTime(new Date());
      if (obj.release_date.split('-').join('') > currentDate.split('/').join('')){
        obj.release = false;
      }else{
        obj.release = true;
      }
      obj.cast = obj.cast.join('/');
      if (obj.plot.length > 100){
        obj.plotTab = true;
        obj.plotFlag = true;
        obj.plotPre = obj.plot.substring(0, 100) + '...';
      }
      obj = Object.assign(obj,that.data.movie);
      that.setData({
        movie:obj
      })
      //console.log(obj);
    })
  },
  //获取评价列表
  searchCommentsData: function (tableID, movieID, limit, offset) {
    let that = this;
    //设置查询条件
    let query = new wx.BaaS.Query();
    query.compare('movie_id', '=', movieID);
    new wx.BaaS.TableObject(tableID).setQuery(query).orderBy('-created_at').limit(limit).offset(offset).find().then((res) => {
      let arr = res.data.objects;
      //console.log(arr);
      //返回最后一层数据
      if (arr.length == 0 || (arr.length < limit && offset != 0)){
        that.setData({
          "load.text":"没有更多短评了",
          "load.more":false
        })
      }
      //处理数据
      let index = 0;
      arr.forEach(function(value){
        //时间格式化
        let date = new Date(value.created_at*1000);
        value.created_at = util.formatTime(date);
        //查询当前用户是否点赞
        if (!value.like || value.like.length == 0 || value.like.indexOf(that.data.userInfo.uid) == -1){
          value.liked = false;
        }else{
          value.liked = true;
        }
        //获取用户信息失败
        if (!value.avatar){
          value.avatar = app.globalData.defaultAvatar;
          value.nickname = '匿名';
        }
      });
      offset = offset + limit;
      that.setData({
        comments: that.data.comments.concat(arr),
        "load.offset": offset
      })
      //console.log(that.data.comments);
    })
  },
  //触发点赞
  toLike:function(e){
    let that = this;
    let index = e.currentTarget.dataset.id;
    let comment = that.data.comments[index];
    //点赞交互
    comment.liked = !comment.liked;
    common.arrAddDel(comment.like, that.data.userInfo.uid);
    let s = 'comments['+index+']'
    that.setData({
      [s]:comment
    })
    //更新服务器数据
    let param = {
      "like":comment.like
    }
    that.updateCommentData(app.globalData.comments, comment.id, param);
  },
  //更新点赞数据
  updateCommentData: function (tableID, recordID, data){
    new wx.BaaS.TableObject(tableID).getWithoutData(recordID).set(data).update().then(res => {
      //console.log(res);
    }, err => {
      console.log(err);
    })
  },
  //更新用户数据
  updateUserInfoData: function (data) {
    new wx.BaaS.User().getCurrentUserWithoutData().set(data).update().then(res => {
      //console.log(res);
    }, err => {
      console.log(err);
    })
  },
  //剧情简介展开收起
  plotCut:function(e){
    let obj = this.data.movie;
    obj.plotFlag = !obj.plotFlag;
    this.setData({
      movie:obj
    })
  },
  //上拉加载更多
  onReachBottom: function () {
    let that = this;
    that.searchCommentsData(app.globalData.comments, that.data.movie.id, that.data.load.limit, that.data.load.offset);
  },
  //看过
  navigatorToEval:function(){
    let param = {
      id:this.data.movie.id
    }
    common.navigateTo("comment", param);
  },
  //我的评价
  switchTabMember:function(){
    common.switchTab("member");
  },
  onHide:function(){
    
  }
})