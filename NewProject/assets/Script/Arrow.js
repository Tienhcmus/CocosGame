const Arrow = cc.Class({
    extends: cc.Component,
    properties: {
        ArrowT: cc.Node,
        Tail: cc.Node,
        ArrowNode: cc.Node
    },
    onLoad(){
        Arrow.instance = this;
        this.ArrowNode.active = false;
    },
    CreateArrow(X, Y, Pos){
        let Up = cc.v2(0,1);
        let tempX = X - Pos.x;
        let tempY = Y - Pos.y;
        let Vec = cc.v2(tempX,tempY);
        let alpha = 0;
        if(tempX > 0)
            alpha = -Vec.angle(Up)*180/3.14;
        else
            alpha = Vec.angle(Up)*180/3.14;
        this.Tail.height = tempY;
        this.ArrowT.x = Pos.x;
        this.ArrowT.y = tempY;
        this.ArrowNode.active = true;
        this.ArrowNode.angle = alpha;
    }
});
