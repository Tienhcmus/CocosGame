cc.Class({
    extends: cc.Component,

    properties: {
    },

    start () {
        this.node.on("mousedown", ()=>{
            cc.director.loadScene('game');
        })
    },

    // update (dt) {},
});
