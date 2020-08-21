cc.Class({
    extends: cc.Component,
    properties: {
        Aim: cc.Animation,
        EggFried: cc.Sprite,
        Egg1: cc.Sprite, //LEFT
        Egg2: cc.Sprite, //RIGHT
        Egg3: cc.Sprite, //LEFT
        Egg4: cc.Sprite,  //RIGHT
        EggWhite: [cc.Sprite]
    },
    Break(){
        let vec = [cc.v2(60* Math.floor(Math.random()*2 + 1),80),cc.v2(80,40), cc.v2(130, -100),
            cc.v2(200, -150), cc.v2(250, -300)];
        let right = cc.bezierBy(0.8, vec);
        let vec1 = [cc.v2(-60* Math.floor(Math.random()*2 + 1),80), cc.v2(-80,40), cc.v2(-130, -100),
            cc.v2(-200, -150), cc.v2(-250,-300)];
        let left = cc.bezierBy(0.8, vec1);
        let vec2 = [cc.v2(30* Math.floor(Math.random()*2 + 1),0), cc.v2(70,-50), cc.v2(70, -100),
            cc.v2(100, -150), cc.v2(150,-300)];
        let right1 = cc.bezierBy(0.8, vec2);
        let vec3 = [cc.v2(-30* Math.floor(Math.random()*2 + 1),0), cc.v2(-70,-50), cc.v2(-70, -100),
            cc.v2(-100, -150),cc.v2(-150,-300)];
        let left1 = cc.bezierBy(0.8, vec3);
        for(let i = 0; i < 6; i++){
            let ran = Math.floor(Math.random()*5) - 2;
            let VecFall = [cc.v2(ran * 45,80), cc.v2(ran * 65,40), cc.v2(ran * 110,-120), cc.v2(ran * 200,-160),
                cc.v2(ran * 175, -280)];
            let fall = cc.bezierBy(0.5, VecFall);
            this.EggWhite[i].node.runAction(fall);
        }
        this.Aim.play();
        let t = 0.1;
        this.schedule(()=>{
           this.EggFried.node.y -= 0.5*230*Math.pow(t,2);
           t+= 0.01;
        }, 0.01, 70,0);
        this.Egg1.node.runAction(left);
        this.Egg2.node.runAction(right);
        this.Egg3.node.runAction(left1);
        this.Egg4.node.runAction(right1);
        this.scheduleOnce(()=>{
            this.Aim.node.active = false;
        },0.35);
        this.scheduleOnce(()=>{
            this.node.destroy();
        }, 0.9);
    },
    BreakGameOver(){
        this.Aim.node.active = false;
        let vec = [cc.v2(60,80),cc.v2(80,40), cc.v2(130, -100), cc.v2(200, -150), cc.v2(250, -300)];
        let right = cc.bezierBy(1, vec);
        let vec1 = [cc.v2(-60,80), cc.v2(-80,40), cc.v2(-130, -100), cc.v2(-200, -150), cc.v2(-250,-300)];
        let left = cc.bezierBy(1, vec1);
        let vec2 = [cc.v2(30,0), cc.v2(70,-50), cc.v2(70, -100),cc.v2(100, -150), cc.v2(150,-300)];
        let right1 = cc.bezierBy(1, vec2);
        let vec3 = [cc.v2(-30,0), cc.v2(-70,-50), cc.v2(-70, -100), cc.v2(-100, -150),cc.v2(-150,-300)];
        let left1 = cc.bezierBy(1, vec3);
        let t = 0.1;
        this.schedule(()=>{
            this.EggFried.node.y -= 0.5*230*Math.pow(t,2);
            t+= 0.01;
        }, 0.01, 90,0);
        this.Egg1.node.runAction(left);
        this.Egg2.node.runAction(right);
        this.Egg3.node.runAction(left1);
        this.Egg4.node.runAction(right1);
        this.scheduleOnce(()=>{
            this.node.destroy();
        }, 0.6);
    }
});

