// component/star-score/star-score.js
Component({
  properties: {
    starId:{
      type:"string",
      value:"star"
    },
    score:{
      type:"string",
      value:"0"
    }
  },
  data: {

  },
  ready:function(){
    //console.log(this);
    //this.drawStar(this.data.starId, this.data.score);
    this.test();
  },
  methods: {
    test:function(){
      const ctx = wx.createCanvasContext("starCanvas");
      ctx.rect(0,0,200,200);
      ctx.setFillStyle("red");
      ctx.fill();
      ctx.draw();
    },
    //五星评分函数
    drawStar: function (id, score) {
      console.log(id);
      const ctx = wx.createCanvasContext(id);
      const r = 2.5, R = 6;
      let x = 10, y = 10, n, mod;
      score = (score / 2).toFixed(2);
      score = score.split(".");
      //console.log(score);
      n = score[0];
      mod = score[1] * 0.01;
      /**点亮金色星星 */
      for (let i = 0; i < n; i++) {
        ctx.beginPath();
        for (let j = 0; j < 5; j++) {
          ctx.lineTo(Math.cos((18 + 72 * j) * Math.PI / 180) * R + x, -Math.sin((18 + 72 * j) * Math.PI / 180) * R + y);
          ctx.lineTo(Math.cos((54 + 72 * j) * Math.PI / 180) * r + x, -Math.sin((54 + 72 * j) * Math.PI / 180) * r + y);
        }
        ctx.setFillStyle("#f9bc25");
        ctx.fill();
        x = x + 15;
      }
      /**一半星星 */
      if (n != 5) {
        ctx.beginPath();
        for (let j = 0; j < 5; j++) {
          ctx.lineTo(Math.cos((18 + 72 * j) * Math.PI / 180) * R + x, -Math.sin((18 + 72 * j) * Math.PI / 180) * R + y);
          ctx.lineTo(Math.cos((54 + 72 * j) * Math.PI / 180) * r + x, -Math.sin((54 + 72 * j) * Math.PI / 180) * r + y);
        }
        //ctx.setFillStyle("#f9bc25");
        const grd = ctx.createLinearGradient(x - 5, y, x + 5, y);
        grd.addColorStop(0, '#f9bc25');
        grd.addColorStop(mod, '#f9bc25');
        grd.addColorStop(mod, '#dddddd');
        grd.addColorStop(1, '#dddddd');
        ctx.setFillStyle(grd);
        ctx.fill();
        x = x + 15;
      }
      /**灰色星星 */
      for (let i = 0; i < 5 - n - 1; i++) {
        ctx.beginPath();
        for (let j = 0; j < 5; j++) {
          ctx.lineTo(Math.cos((18 + 72 * j) * Math.PI / 180) * R + x, -Math.sin((18 + 72 * j) * Math.PI / 180) * R + y);
          ctx.lineTo(Math.cos((54 + 72 * j) * Math.PI / 180) * r + x, -Math.sin((54 + 72 * j) * Math.PI / 180) * r + y);
        }
        ctx.setFillStyle("#dddddd");
        ctx.fill();
        x = x + 15;
      }
      ctx.closePath();
      ctx.draw();
    },
  }
})
