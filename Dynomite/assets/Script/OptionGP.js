const OptionGP = cc.Class({
    extends: cc.Component,

    properties: {
        Board: cc.Node,
        Done: cc.Button,
        Effect: cc.Slider,
        Music: cc.Slider,
        HandleEf: cc.Button,
        HandleMs: cc.Button,
        Sound: cc.AudioClip,
        _Effect: true,
        _Click: false
    },
    onLoad(){
      OptionGP.instance = this;
    },
    start () {
        this.Effect.progress = cc.audioEngine.getEffectsVolume();
        this.Music.progress = cc.audioEngine.getMusicVolume();
        this.Board.active = false;
        this.node.on('mousedown', ()=>{
            if(this._Click === false){
                if(this._Effect === true)
                    cc.audioEngine.playEffect(this.Sound, false);
                this._Click = true;
                this.Board.active = true;
                require('Gameplay').instance.ClickOption();
            }
        });
        this.Done.node.on('mousedown', ()=>{
            if(this._Effect === true)
                cc.audioEngine.playEffect(this.Sound, false);
            this.scheduleOnce(()=>{
                this.Board.active = false;
                this._Click = false;
                require('Gameplay').instance.ClickOption();
            }, 0.3);
        });
        this.HandleEf.node.on('mousemove', ()=>{
            let key = true;
            if(this.Effect.progress === 0){
                key = false;
                require('Gameplay').instance.SwitchEffect(key);
            }
            else{
                require('Gameplay').instance.SwitchEffect(key);
                cc.audioEngine.setEffectsVolume(this.Effect.progress);
            }
        });
        this.HandleMs.node.on('mousemove', ()=>{
            if (this.Music.progress === 0){
                cc.audioEngine.pauseMusic();
                cc.audioEngine.setMusicVolume(0);
            }
            else{
                cc.audioEngine.resumeMusic();
                cc.audioEngine.setMusicVolume(this.Music.progress);
            }
        });
    },
    Switch(key){
        this._Effect = key;
    }
});
