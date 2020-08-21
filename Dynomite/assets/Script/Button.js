cc.Class({
    extends: cc.Component,
    statics: {
        instance: null
    },
    properties: {
        Sound: cc.AudioClip,
        Label1: cc.Label,
        Label2: cc.Label
    },
    start () {
        cc.audioEngine.playMusic(this.Sound, true);
        this.node.on('mouseenter',()=>{
            this.Label1.node.color = cc.color(255,255,255,255);
            this.Label2.node.color = cc.color(255,255,255,255);
        });
        this.node.on('mouseleave',()=>{
            this.Label1.node.color = cc.color(255,255,0,255);
            this.Label2.node.color = cc.color(255,255,0,255);
        });
        this.node.on('mousedown', ()=>{
            cc.audioEngine.stopMusic();
            cc.director.loadScene('MenuGame');
        })
    },
});
