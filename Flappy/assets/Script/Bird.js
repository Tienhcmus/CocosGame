cc.Class({
    extends: cc.Component,
    statics: {
        instance: null
    },
    properties: {
        FlyHeight: 0,
        FlyDuration: 0,
        FlySound: cc.AudioClip,
        _gravity: 0,
        _StartGame: false
    },
    onLoad() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    },
    start() {
    },
    onKeyDown(event){
        if(event.keyCode === 32 ){
            if(this._StartGame === false)
                this._StartGame = true;
            cc.audioEngine.playEffect(this.FlySound, false);
            this._gravity = 0;
            this.node.angle = 45;
            this.FlyAction = this.setFlyAction();
            this.node.runAction(this.FlyAction);
        }
    },
    setFlyAction(){
            let Fly = cc.moveBy(this.FlyDuration, cc.v2(0, this.FlyHeight));
            return Fly;
    },
    update (dt) {
        if(this.node.y > -150 && this._StartGame === true) {
            this._gravity += dt;
            this.node.angle -= dt * 150;
            if (this.node.angle < -90)
                this.node.angle = -90;
            if (this._gravity > 0.015)
                this._gravity = 0.015;
            this.node.y -= this._gravity * 200;
        }
        if(this.node.y < -150)
            this.node.y = -150;
        if(this.node.y > 240)
        {
            this.node.y = 240;
            this._gravity += dt;
            this.node.angle -= dt * 150;
            if (this.node.angle < -90)
                this.node.angle = -90;
            if (this._gravity > 0.02)
                this._gravity = 0.02;
            this.node.y -= this._gravity * 100;
        }
    },
});
