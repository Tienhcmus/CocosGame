cc.Class({
    extends: cc.Component,

    properties: {
        Board: cc.Node,
        Done: cc.Button,
        Effect: cc.Slider,
        Music: cc.Slider,
        HandleEf: cc.Button,
        HandleMs: cc.Button,
        Click: cc.AudioClip,
        _Effect: true,
        _Click: false
    },
    onLoad(){
      this.Effect.progress = cc.audioEngine.getEffectsVolume();
      this.Music.progress = cc.audioEngine.getEffectsVolume();
    },
    start () {
        this.Board.active = false;
        this.node.on('mousedown', ()=>{
            if(this._Effect === true)
                cc.audioEngine.playEffect(this.Click, false);
           if(this._Click === false){
               this._Click = true;
               this.Board.active = true;
           }
        });
        this.Done.node.on('mousedown', ()=>{
            if(this._Effect === true)
                cc.audioEngine.playEffect(this.Click, false);
            this.scheduleOnce(()=>{
                this.Board.active = false;
                this._Click = false;
            }, 0.3);
        });
        this.HandleEf.node.on('mousemove', ()=>{
            if(this.Effect.progress === 0)
                cc.audioEngine.setEffectsVolume(0);
            else{
                cc.audioEngine.setEffectsVolume(this.Effect.progress);
            }

        });
        this.HandleMs.node.on('mousemove', ()=> {
            if (this.Music.progress === 0){
                cc.audioEngine.pauseMusic();
                cc.audioEngine.setMusicVolume(0);
            }
            else{
                cc.audioEngine.resumeMusic();
                cc.audioEngine.setMusicVolume(this.Music.progress);
            }
        });
    }
});
