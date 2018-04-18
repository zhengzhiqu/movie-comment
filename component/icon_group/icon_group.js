// template/icon_group/icon_group.js
const app = getApp()
let common = require('../../common/common.js');
let aqBehavior = require('../aq-behavior.js');
Component({
  behaviors: [aqBehavior],
  properties: {
    size:{
      type:String,
      value:'150*150*150'
    },
    title:{
      type: Boolean,
      value: false
    },
    desc: {
      type: Boolean,
      value: false
    },
  },
  data: {
    src: [],
    _title: [],
    _desc: [],
    path: [],
    width:150,
    iconWidth:150,
    iconHeight:150
  },
  ready:function(){
    this.getTableData(this.data.tableId);
    let s = [];
    s = this.stringToSize(this.properties.size);
    this.setData({
      "width":s.shift(),
      "iconWidth": s.shift(),
      "iconHeight": s.shift()
    })
  },
  methods: {
    stringToSize:function(s){
      if(s.indexOf("*")>0){
        s = s.split('*');
        return s;
      }else{
        w = [s,s,s];
        return w;
      }
    },
    navigateTo: function (e) {
      let url = e.currentTarget.dataset.url;
      common.navigateTo(url);
    },
    getTableData: function (tableID) {
      let that = this;
      let query = new wx.BaaS.Query()
      let src = [], path = [], title = [], desc = [];
      new wx.BaaS.TableObject(tableID).setQuery(query).orderBy('created_at').find().then((res) => {
        res.data.objects.forEach(function (value, index) {
          src.push(value.image.path);
          path.push(value.path);
          title.push(value.title);
          desc.push(value.desc);
        });
        that.setData({
          "src": src,
          "path": path,
          '_title':title,
          "_desc":desc
        })
      })
    }
  }
})
