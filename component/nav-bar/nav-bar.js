// component/nav-bar/nav-bar.js
let common = require("../../common/common.js");

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    navigateTo:function(){
      common.navigateTo('search');
    }
  }
})
