const Kroney = cc.Class({
    extends: cc.Component,
    statics: {
        instance: null,
    },
    properties: {
        _Start: true,
        _Stop: false,
        _Timer: 0,
        _Count: 0
    },
    onLoad(){
      Kroney.instance = this;
    },
    StartTiming(){
        let aim = this.getComponent(cc.Animation);
        if(this._Stop === false){
            aim.play('Sheet');
            this.schedule(()=>{
                this._Count++;
                this._Timer++;
                if(this._Count > 29 && this._Start === true){
                    this.unscheduleAllCallbacks();
                    this.RunAim(aim);
                }
                if(this._Timer > 59){
                    this._Timer = 0;
                    require('Gameplay').instance.UpdateGravity();
                }
            }, 1, cc.macro.REPEAT_FOREVER, 0);
        }
    },
    RunAim(aim){
        aim.play('Kroney');
        this.scheduleOnce(()=>{
            require('Gameplay').instance.WhirLeyComing();
            this._Count = 0;
            this.StartTiming();
        }, 0.6);
    },
    Flag(flag){
        this._Start = flag;
    },
    StopTiming(){
        this._Stop = !this._Stop;
    }
});
