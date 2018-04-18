module.exports = Behavior({
  behaviors:[],
  properties:{
    tableId: {
      type: Number,
      value: ""
    },
  },
  data:{
    
  },
  attached:function(){

  },
  methods:{
    //获得父组件
    getParent: function (name) {
      let nodes = this.getRelationNodes('../${name}/${name}');
      if (nodes && nodes.length > 0) {
        return nodes[0]
      } else {
        return this
      }
    },
    //获得兄弟组件
    getSibling: function (parent, child) {
      let nodes = this.getParent(parent).getRelationNodes('../${child}/${child}');
      if (nodes && nodes.length > 0) {
        return nodes[0]
      } else {
        return this
      }
    }
  }
})