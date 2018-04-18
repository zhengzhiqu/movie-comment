const app = getApp();
const common = {
  //检测身份证号码
  checkIdCardNumber: function (s) {
    let reg = new RegExp('^\[0-9]{17}([0-9]|x)$');
    return reg.test(s);
  },
  //检测手机号
  checkPhoneNumber:function(s){
    let reg = new RegExp("0?(13|14|15|17|18|19)[0-9]{9}");
    return reg.test(s);
  },
  //去除数组重复元素
  arrUnique:function(arr){
    if (arr.length == 0) {
      return;
    }
    var a = {};
    for (var i = 0; i < arr.length; i++) {
      if (typeof a[arr[i]] == "undefined") {
        a[arr[i]] = 1;
      }
    }
    arr.length = 0;
    for (var i in a) {
      arr[arr.length] = i;
    }
    return arr;
  },
  //计算数组平均值,保留一位小数
  arrAverage:function(arr){
    if(arr.length == 0){
      return;
    }
    var s = 0;
    arr.forEach(function(item){
      s+=item.score;
    });
    s = s / arr.length * 2;
    s = s.toFixed(1);
    return s;
  },
  //数组随机打乱
  arrRandom:function(arr){
    if (arr.length == 0) {
      return;
    }
    return arr.sort(function(){
      return Math.random() - 0.5
    })
  },
  //查找数组元素，若没有，则增加，若有，则删除
  arrAddDel:function(arr, ele){
    let index = arr.indexOf(ele);
    index == -1 ? arr.push(ele) : arr.splice(index, 1);
    return arr;
  },
  //限制字数
  limitWord: function (s, m) {
    if (s.length > m) {
      s = s.substring(0, m) + '...';
    }
    return s;
  },
  //下划线转JS驼峰式
  formatJSON:function(ele){
    //数组形式
    if (ele.constructor == Array){
      ele.forEach(function (value) {
        let x;
        for (x in value) {
          //console.log(x);
          let y = x.split('_');
          if (y.length == 2) {
            y[1] = y[1].slice(0, 1).toUpperCase() + y[1].slice(1);
          }
          y = y.join('');
          value[y] = value[x];
        }
      });
      return ele;
    }
    //对象形式
    if (ele.constructor == Object){
      let x;
      for (x in ele) {
        //console.log(x);
        let y = x.split('_');
        if (y.length == 2) {
          y[1] = y[1].slice(0, 1).toUpperCase() + y[1].slice(1);
        }
        y = y.join('');
        ele[y] = ele[x];
      }
      return ele;
    }
  },
  //保留当前页面，跳转到应用内的某个页面
  navigateTo: function (url, param) {
    let x, y = '';
    if (param) {
      y = '?';
      for (x in param) {
        y = y + x + '=' + param[x] + '&'
      }
      y = y.substring(0, y.length - 1);
    }
    wx.navigateTo({
      url: '../../pages/' + url + '/' + url + y,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //关闭当前页面，跳转到应用内的某个页面
  redirectTo: function (url, param) {
    let x, y = '';
    if (param) {
      y = '?';
      for (x in param) {
        y = y + x + '=' + param[x] + '&'
      }
      y = y.substring(0, y.length - 1);
    }
    wx.redirectTo({
      url: '../../pages/' + url + '/' + url + y,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
  switchTab:function(url){
    wx.switchTab({
      url: '../../pages/' + url + '/' + url,
    })
  },
  //关闭当前页面，返回上一页面或多级页面
  navigateBack:function(delta){
    if (!delta){
      delta = 1;
    }
    wx.navigateBack({
      delta: delta
    })
  },
  //获取服务器信息
  getTableData: function (param, func) {
    if (!param || !param.tableID) return false;
    let table = new wx.BaaS.TableObject(param.tableID);
    for(value in param){
      switch(value){
        case "limit":
          table.limit(param[value]);
          continue;
        case "offset":
          table.offset(param[value]);
          continue;
        case "query":
          table.setQuery(param[value]);
          continue;
        case "orderBy":
          table.orderBy(param[value]);
          continue;
        default:
          continue;
      }
    }
    //console.log(param[value]);
    table.find().then(res => {
      let arr = res.data.objects;
      func(arr); 
    })
  },
  //获取服务器信息
  getRecordData: function (param, func) {
    if (!param || !param.tableID || !param.recordID) return false;
    let table = new wx.BaaS.TableObject(param.tableID);
    let record = table.get(param.recordID);
    for (value in param) {
      if (value != 'tableID' && value != 'recordID') {
        record[value](param[value]);
      }
      //console.log(param[value]);
    }
    record.then(res => {
      //console.log(res);
      let obj = res.data;
      func(obj);
    })
  },
  //获取当个用户信息
  getUserData:function(){
    let args = arguments;
    if (args.length == 0) return false;
    let uid, func;
    if(args.length == 1){
      let userInfo = app.globalData.userInfo;
      if (!userInfo || !userInfo.id) {
        app.getUserInfo();
      } else {
        uid = userInfo.id;
      }
      func = args[0];
    }else{
      uid = args[0];
      func = args[1];
    }
    new wx.BaaS.User().get(uid).then(res => {
      //console.log(res);
      func(res.data);
    })
  }
}

module.exports = common;