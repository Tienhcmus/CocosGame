const NewGame = cc.Class({
    extends: cc.Component,
    properties: {
    },
    onLoad(){
      NewGame.instance = this;
      this.node.on('touchstart', ()=>{
          cc.director.loadScene('Game');
      })
    }
});
