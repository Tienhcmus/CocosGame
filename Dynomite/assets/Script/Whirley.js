const Whirley = cc.Class({
    extends: cc.Component,
    statics: {
        instance: null
    },
    properties: {
        _velocityFly: cc.v2(0,0),
        _Speed: 2,
        _Fly: false,
        _Contact: false,
        _Aim: null,
        Num: null
    },
    onLoad(){
      Whirley.instance = this;
    },
    flying(choose, value) {
        if(this.Num === null)
            this.Num = value;
        else if(this.Num < value)
            this._Speed = 2;
        this._Fly = true;
        let Vec = [];
        this._Aim = this.node.getComponent(cc.Animation);
        Vec[0] = cc.v2(4, 2).normalizeSelf();
        Vec[1] = cc.v2(-4, 2).normalizeSelf();
        const normal = Vec[choose];
        this._velocityFly = normal.mulSelf(this._Speed);
        if(this._velocityFly.x > 0)
            this._Aim.play('Right');
        else
            this._Aim.play('Left');
        this.schedule(this.updateFlying.bind(this), 0, cc.macro.REPEAT_FOREVER, 0);
    },
    updateFlying(){
        if(this.node.y > 120){
            this.node.x += this._velocityFly.x;
            this.node.y += this._velocityFly.y;
            if (this.node.x < 250) {
                this._Aim.play('Right');
                this._velocityFly.x = Math.abs(this._velocityFly.x);
            } else if (this.node.x > 500) {
                this._Aim.play('Left');
                this._velocityFly.x = -Math.abs(this._velocityFly.x);
            }
            if(this.node.y > 500){
                this.unscheduleAllCallbacks();
                this._Speed = 2;
                this._Fly = false;
                this._velocityFly = cc.v2(0,0);
                require('Gameplay').instance.WhirLeyOut();
            }
        }
        else
            this.node.y += this._velocityFly.y * 2;
    },
    updateSpeed(){
        this.unscheduleAllCallbacks();
        this._Fly = false;
        this._velocityFly = cc.v2(0,0);
        this._Speed += 1;
    }
});
