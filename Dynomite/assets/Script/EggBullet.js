cc.Class({
    extends: cc.Component,
    properties:{
        _velocity: cc.v2(0, 0),
        Bonus: [cc.Prefab],
        _Contact: true
    },
    fire(start, target) {
        if(target === undefined)
            return;
        const normalVector = cc.v2(target.x - start.x, target.y - start.y).normalizeSelf();
        this._velocity = normalVector.mulSelf(7);
        this.schedule(this.updateFire.bind(this), 0, cc.macro.REPEAT_FOREVER, 0);
    },
    updateFire(){
        this.node.x += this._velocity.x;
        this.node.y += this._velocity.y;
        if (this.node.x < -70) {
            this._velocity.x = Math.abs(this._velocity.x);
        } else if (this.node.x > 185) {
            this._velocity.x = -Math.abs(this._velocity.x);
        }
    },
    onCollisionEnter(other, self) { //other là đối tượng bị chạm, self là đối tượng chạm
        if(other.node.group === 'Whirley'){
            this.unscheduleAllCallbacks();
            require('Whirley').instance.updateSpeed();
            require('Gameplay').instance.WhirLeyContact(self, other);
        }
        if(self.node.group === 'bullet' && other.node.group === 'map'){
            this.unscheduleAllCallbacks();
            self.node.group = 'map';
            require('Gameplay').instance.onCollisionEgg(self, other); //Truyền biến self tới hàm onCollisionEgg trong script Gameplay
        }
        if(self.node.group === 'map' && other.node.group === 'Rope'){
            require('Gameplay').instance.GameOver();
        }
    },
    Invisible(){
        this.schedule(()=>{
            this.node.opacity = 0;
            this.scheduleOnce(()=>{
                this.node.opacity = 255;
            }, 0.05);
        },0.1, cc.macro.REPEAT_FOREVER, 0);
    }
});
