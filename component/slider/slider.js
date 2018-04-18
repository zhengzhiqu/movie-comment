// template/slider/slider.js
const app = getApp()
let aqBehavior = require('../aq-behavior.js');
Component({
  options:{
    multipleSlots:true
  },
  behaviors: [aqBehavior],
  properties: {
    autoplay:{
      type:Boolean,
      value:true
    },
    interval:{
      type:Number,
      value:4000
    },
    indicatorDots:{
      type:Boolean,
      value:true
    },
    indicatorColor:{
      type:String,
      value:"rgba(0,0,0,.3)"
    },
    indicatorActiveColor:{
      type:String,
      value:"rgba(255,255,255,.8)"
    },
    circular:{
      type:Boolean,
      value:false
    }
  },
  data: {
    src:[],
    path:[]
  },
  ready:function(){
    this.getTableData(this.data.tableId);
  },
  methods: {
    navigateTo:function(e){
      let url = e.currentTarget.dataset.url;
      app.pageTo(url, "navigateTo");
    },
    getTableData: function (tableID) {
      let that = this;
      let query = new wx.BaaS.Query()
      let src = [], path = [];
      new wx.BaaS.TableObject(tableID).setQuery(query).orderBy('created_at').find().then((res) => {
        res.data.objects.forEach(function (value, index) {
          src.push(value.image.path);
          path.push(value.path);
        });
        that.setData({
          "src": src,
          "path": path
        })
      })
    }
  }
})
