cc.Class({
    extends: cc.Component,

    properties: {
        InChy : cc.Sprite,
        GameOver: cc.Sprite
    },
    Announcement(){
       let aim = this.InChy.getComponent(cc.Animation);
       aim.play();
       this.schedule(()=>{
           this.GameOver.node.opacity += 5;
           if(this.GameOver.node.opacity === 255)
               this.unscheduleAllCallbacks();
       }, 0.02, cc.macro.REPEAT_FOREVER, 0);
    }
});
