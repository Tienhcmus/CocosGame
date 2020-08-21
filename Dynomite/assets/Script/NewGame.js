const NewGame = cc.Class({
    extends: cc.Component,

    properties: {
        Click: cc.AudioClip,
        _Effect: true
    },
    onLoad(){
      NewGame.instance = this;
    },
    start () {
        this.node.on('mousedown', ()=>{
            if(this._Effect === true)
                cc.audioEngine.playEffect(this.Click, false);
            cc.director.loadScene('MenuGame');
        })
    },
    Switch(key){
        this._Effect = key;
    }
});
