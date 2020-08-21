const ExitButton = cc.Class({
    extends: cc.Component,
    properties: {
    },
    onLoad(){
        ExitButton.instance = this;
        this.node.on('touchstart', ()=>{
            cc.director.loadScene('MenuGame');
        })
    }
});
