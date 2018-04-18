// template/scroll_group/scroll_group.js
let common = require('../../common/common.js');  //引入
let link = "https://cloud-minapp-9266.cloud.ifanrusercontent.com/";

Component({
  options:{
    multipleSlots:true
  },
  externalClasses:['scroll-group'],
  properties: {
    datas:{
      type:"Array",
      value: [{
        id:"5ac2e05cda6b7353a42423a6",
        cover_image: link+'1f3BCShybjotgABf.jpg',
        name_cn: "头号玩家",
        score: "9.2"
      }, 
      {
        id: "5ac33ab2a11ab039239ea3a2",
        cover_image: link + '1f3HF7HqphQTNfiG.jpg',
        name_cn: "环太平洋：雷霆再起",
        score: "5.1"
      },
      {
        id: "5acf0d89a11ab0622911febf",
        cover_image: link +'1f6WofFlNXlBTzcy.jpg',
        name_cn: "狂暴巨兽",
      },
      {
        id: "5acf0e73a11ab064590f1de2",
        cover_image: link +'1f6WsnYyFCBpfxjD.jpg',
        name_cn: "起跑线",
        score: "9.0"
      }, 
      {
        id: "5acf0f474a7baa09f9c6a752",
        cover_image: link + '1f6WwbbCSzyhpABO.jpg',
        name_cn: "暴裂无声",
        score: "8.6"
      }]
    },
    href:{
      type:"string",
      value:"index"
    }
  },
  data: {

  },
  ready: function () {
    
  },
  methods: {
    navigateToDetail: function (e) {
      let id = e.currentTarget.dataset.id;
      let param = {
        "id":id
      }
      let url = this.data.href;
      common.navigateTo(url, param);
    },
  }
})

