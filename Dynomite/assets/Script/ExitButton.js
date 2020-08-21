const ExitButton = cc.Class({
    extends: cc.Component,
    properties: {
        Click: cc.AudioClip,
        _Effect: false
    },
    onLoad(){
        ExitButton.instance = this;
    },
    start () {
        this.node.on('mousedown', ()=>{
            if(this._Effect === true)
                cc.audioEngine.playEffect(this.Click, false);
            cc.director.loadScene('Intro');
        })
    },
    Switch(key){
        this._Effect = key;
    }
});
