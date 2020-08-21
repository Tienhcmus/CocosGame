cc.Class({
    extends: cc.Component,
    statics: {
        instance: null
    },
    properties: {
        SoundTrack: cc.AudioClip,
        Welcome: cc.AudioClip,
        Click: cc.AudioClip,
        NodeButton: [cc.Button],
        NodeMenu: [cc.Node],
        NewGameBT: [cc.Node],
        ContinueBT: [cc.Node],
        Tutorial: [cc.Node],
        ArrowButton: [cc.Button],
        PlayButton: cc.Button,
        EasyMode: [cc.Node],
        NormalMode: [cc.Node],
        HardMode: [cc.Node],
        Introduction: [cc.Label],
        PressNewGame: true,
        PressContinue: false,
        PressTutorial:false,
        PressEasy: true,
        PressNormal: false,
        PressHard: false,
        _Effect: true,
        PressCount: 0,
        Page: 0,
        Level: 3,
        Speed: 5
    },
    onLoad () {
        cc.audioEngine.playEffect(this.Welcome, false);
        cc.audioEngine.playMusic(this.SoundTrack, true);
        this.NodeMenu[0].active = true;
        this.NodeMenu[1].active = false;
        this.ArrowButton[1].node.active = false;
        this.PlayButton.node.active = false;
        //Arrow Button
        this.ArrowButton[0].node.on('touchstart', ()=>{
            if(this._Effect === true)
                cc.audioEngine.playEffect(this.Click, false);
            if(this.PressContinue === true){
                cc.director.loadScene('Game');
            } else if(this.PressTutorial === true){
                cc.director.loadScene('Game');
            } else {
                this.NodeMenu[0].active = false;
                this.NodeMenu[1].active = true;
                this.ArrowButton[0].node.active = false;
                this.ArrowButton[1].node.active = true;
                this.PlayButton.node.x = this.ArrowButton[0].node.x;
                this.PlayButton.node.y = this.ArrowButton[0].node.y;
                this.scheduleOnce(()=>{
                    this.PlayButton.node.active = true;
                }, 0.1);
            }
        }); //Button NEXT
        this.ArrowButton[1].node.on('touchstart', ()=>{
            if(this._Effect === true)
                cc.audioEngine.playEffect(this.Click, false);
            this.NodeMenu[1].active = false;
            this.NodeMenu[0].active = true;
            this.ArrowButton[0].node.active = true;
            this.ArrowButton[1].node.active = false;
            this.PlayButton.node.active = false;
        }); //Button BACK
        this.PlayButton.node.on('touchstart', ()=>{
            if(this._Effect === true)
                cc.audioEngine.playEffect(this.Click, false);
            if(this.PressHard === true) {
                cc.director.loadScene('Game',()=>{
                    require('Gameplay').instance.CheckLevel(5, 7, 2);
                });
            } else if(this.PressNormal === true){
                cc.director.loadScene('Game',()=>{
                    require('Gameplay').instance.CheckLevel(4, 6, 1);
                });
            } else {
                cc.director.loadScene('Game',()=>{
                    require('Gameplay').instance.CheckLevel(3, 5, 0);
                });
            }
        }); //Button let play
    },
    start(){
        //Page 1
        this.NodeButton[0].node.on('touchstart', ()=>{
            if(this._Effect === true)
                cc.audioEngine.playEffect(this.Click, false);
            if(this.PressNewGame === false){
                this.PressNewGame = true;
                this.PressContinue = false;
                this.PressTutorial = false;
                this.PressCount = 1;
            }
            if(this.PressCount === 1){
                this.NewGameBT[0].opacity = 100;
                this.NewGameBT[1].opacity = 210;
                this.ContinueBT[0].opacity = 0;
                this.ContinueBT[1].opacity = 0;
                this.Tutorial[0].opacity = 0;
                this.Tutorial[1].opacity = 0;
                this.PressCount++;
            }
        });
        this.NodeButton[1].node.on('touchstart', ()=>{
            if(this._Effect === true)
                cc.audioEngine.playEffect(this.Click, false);
            if(this.PressContinue === false){
                this.PressContinue = true;
                this.PressNewGame = false;
                this.PressTutorial = false;
                this.PressCount = 1;
            }
            if(this.PressCount === 1){
                this.ContinueBT[0].opacity = 100;
                this.ContinueBT[1].opacity = 210;
                this.NewGameBT[0].opacity = 0;
                this.NewGameBT[1].opacity = 0;
                this.Tutorial[0].opacity = 0;
                this.Tutorial[1].opacity = 0;
                this.PressCount++;
            }
        });
        this.NodeButton[2].node.on('touchstart', ()=>{
            if(this._Effect === true)
                cc.audioEngine.playEffect(this.Click, false);
            if(this.PressTutorial === false){
                this.PressTutorial = true;
                this.PressNewGame = false;
                this.PressContinue = false;
                this.PressCount = 1;
            }
            if(this.PressCount === 1){
                this.Tutorial[0].opacity = 100;
                this.Tutorial[1].opacity = 210;
                this.NewGameBT[0].opacity = 0;
                this.NewGameBT[1].opacity = 0;
                this.ContinueBT[0].opacity = 0;
                this.ContinueBT[1].opacity = 0;
                this.PressCount++;
            }
        });

        //Page 2
        this.NodeButton[3].node.on('touchstart', ()=>{
            if(this._Effect === true)
                cc.audioEngine.playEffect(this.Click, false);
            if(this.PressEasy === false){
                this.PressEasy = true;
                this.PressNormal = false;
                this.PressHard = false;
                this.PressCount = 1;
            }
            if(this.PressCount === 1){
                this.EasyMode[0].opacity = 100;
                this.EasyMode[1].opacity = 210;
                this.NormalMode[0].opacity = 0;
                this.NormalMode[1].opacity = 0;
                this.HardMode[0].opacity = 0;
                this.HardMode[1].opacity = 0;
                this.PressCount++;
            }
        });
        this.NodeButton[4].node.on('touchstart', ()=>{
            if(this._Effect === true)
                cc.audioEngine.playEffect(this.Click, false);
            if(this.PressNormal === false){
                this.PressNormal = true;
                this.PressEasy = false;
                this.PressHard = false;
                this.PressCount = 1;
            }
            if(this.PressCount === 1){
                this.NormalMode[0].opacity = 100;
                this.NormalMode[1].opacity = 210;
                this.EasyMode[0].opacity = 0;
                this.EasyMode[1].opacity = 0;
                this.HardMode[0].opacity = 0;
                this.HardMode[1].opacity = 0;
                this.PressCount++;
            }
        });
        this.NodeButton[5].node.on('touchstart', ()=>{
            if(this._Effect === true)
                cc.audioEngine.playEffect(this.Click, false);
            if(this.PressHard === false){
                this.PressHard = true;
                this.PressNormal = false;
                this.PressEasy = false;
                this.PressCount = 1;
            }
            if(this.PressCount === 1){
                this.HardMode[0].opacity = 100;
                this.HardMode[1].opacity = 210;
                this.EasyMode[0].opacity = 0;
                this.EasyMode[1].opacity = 0;
                this.NormalMode[0].opacity = 0;
                this.NormalMode[1].opacity = 0;
                this.PressCount++;
            }
        });
    }
});
