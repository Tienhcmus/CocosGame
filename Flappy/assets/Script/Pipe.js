cc.Class({
    extends: cc.Component,
    statics:{
        instance: null
    },
    properties: {
        Bird: cc.Sprite,
        ScoreSound: cc.AudioClip,
        RunDuration: 0,
        Return: false,
        Check: false
    },

    onLoad(){
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.Run, this);
    },
    Run(){
        if(this.Check === false)
        {
            this.Check = !false;
            this.Run = this.RunAction();
            this.node.runAction(this.Run);
        }
    },
    update(dt) {
        if (this.node.x < -200) {
            this.node.x = 175;
            this.node.y = Math.floor(Math.random() * 141) - 40;
            this.Return = !this.Return;
        }
        if(this.node.x < this.Bird.node.x && this.Return === false)
        {
            cc.audioEngine.playEffect(this.ScoreSound, false);
            this.Return = !this.Return;
        }
    },
    RunAction(){
        let Run = cc.moveBy(this.RunDuration, -600, 0);
        return cc.repeatForever(Run);
    }
});
