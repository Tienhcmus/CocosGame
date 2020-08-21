cc.Class({
    extends: cc.Component,
    statics: {
        instance: null
    },
    properties: {
        Bird: cc.Sprite,
        Intro: cc.Sprite,
        Pipe: cc.Node,
        Pipe2: cc.Node,
        GameOverPre: cc.Prefab,
        Replay: cc.Button,
        ScoreDisplay: cc.Label,
        HighScoreDisplay: cc.Label,
        Hit: cc.AudioClip,
        _Score: 0,
        Return: false
    },
    onLoad(){
        this.Bird.node.active = false;
        this.HighScoreDisplay.node.active = false;
        this.Replay.node.active = false;
    },
    start(){
        let Hide = true;
        this.node.on('mousedown',()=>{
            if(Hide === true){
                Hide = !Hide;
                this.Intro.node.active = false;
                this.Bird.node.active= true;
            }
        });
        this.Replay.node.on('mousedown',()=>{
            location.reload();
        })
    },
    update(dt){
        if(this.Pipe.x >= -45 && this.Pipe.x <= 7 ){
            if (this.Bird.node.y > this.Pipe.y + 75 || this.Bird.node.y < this.Pipe.y - 75)
                this.GameOver();
            else if(this.Return === false)
            {
                this._Score++;
                this.Return = !this.Return;
                this.ScoreDisplay.string = this._Score;

            }
        }
        if(this.Pipe2.x >= -45 && this.Pipe2.x <= 7){
            if (this.Bird.node.y > this.Pipe2.y + 75 || this.Bird.node.y < this.Pipe2.y - 75 )
                this.GameOver();
            else if(this.Return === true)
            {
                this._Score++;
                this.Return = !this.Return;
                this.ScoreDisplay.string = this._Score;
                cc.log(JSON.stringify(this._Score));
            }
        }
    },
    GameOver(){
        cc.audioEngine.playEffect(this.Hit,false);
        let GO = cc.instantiate(this.GameOverPre);
        this.node.addChild(GO);
        this.ScoreDisplay.node.active = false;
        this.HighScoreDisplay.node.active = true;
        this.Replay.node.active = true;
        this.HighScoreDisplay.string = 'HighScore: ' + this._Score;
        cc.director.pause();
    }
    });
