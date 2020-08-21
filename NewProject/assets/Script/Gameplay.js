const Gameplay = cc.Class({
    extends: cc.Component,
    statics: {
        instance: null
    },
    properties: {
        //Effect
        SoundTrack: cc.AudioClip,
        SoundEnd: cc.AudioClip,
        Shoot: [cc.AudioClip],
        SoundGO: cc.AudioClip,
        _Gravity: 10,

        //Sprite
        Wall: cc.Sprite,
        Tank: cc.Sprite,
        SteGgy: cc.Sprite,
        WhirLey: cc.Sprite,
        KroNey: cc.Sprite,
        Foot: cc.Sprite,
        Rope: cc.Sprite,
        SlingShot: cc.Sprite,
        Terror: [cc.Sprite],
        ImageScore: cc.Label,
        Score: cc.Label,
        WhirLeyEgg: null,

        //Key
        _CheckGameOver: false,
        _Start: false,
        _ContactRope: true,
        _Stop: false,
        _Update: false,

        //Init map
        EggSheet: [cc.Prefab],
        _MatrixEgg: [],
        _EggSheet: [],
        _RandomEgg: 3,

        //Mode Game
        Puzzle: cc.Node,
        Clone: cc.Node,
        End: cc.Node,

        //Fire
        SteGgyNode: cc.Node,
        ReplaceBullet: cc.Node,
        _Bullet: [],

        //Break Egg
        Break: [cc.Prefab],
        _EggBreak: [],

        //Other
        Button: [cc.Node],
        Board: cc.Node,
        Tool: cc.Node,
        _MusicKey: true,
        _EffectKey: true,
        _Pause: false,
        _Width: 48,
        _Height: 48,
        _NumberEgg: 9,
        _Col: 27,
        _Score: 0,
        _Left: 0,
        _Right: 0,
        _posx: 0,
        _posy: 0
    },
    onLoad() {
        Gameplay.instance = this;
        //Khai báo va chạm
        const manager = cc.director.getCollisionManager();
        manager.enabled = true; //Bật chức năng quản lý va chạm
        manager.enabledDebugDraw = false; //Vẽ box Collision
        this.End.active = false;
        this._Width = 48;
        this._Height = 48;
        this._NumberEgg = 9;
        this._Col = 27;
        this._Score = 0;
        this._Gravity = 10;
    },
    start(){
        this.Score.node.active = false;
        this.Board.active = false;
        cc.audioEngine.playMusic(this.SoundTrack, true);
        this.InitMap();
        for(let j = 0; j < this._MatrixEgg[0].length; j++){
            for(let i = 0; i < this._NumberEgg; i++){
                if(this._MatrixEgg[i][j] !== 9){
                    this._EggSheet[i][j].runAction(cc.moveBy(0.5, 0,-150));
                }
            }
        }
        this.Terror[0].node.active = false;
        this.Terror[1].node.active = false;
        this.KroNey.node.runAction(cc.moveBy(0.5, 0, -500));
        this.Button[0].on('touchstart',()=>{
            if(this._EffectKey)
                cc.audioEngine.playEffect(this.Shoot[2], false);
            if(this.Button[0].opacity === 255) {
                this.Button[0].opacity = 0;
                this._MusicKey = false;
                cc.audioEngine.pauseMusic();
            }
            else {
                this.Button[0].opacity = 255;
                this._MusicKey = true;
                cc.audioEngine.resumeMusic();
            }
        });
        this.Button[1].on('touchstart',()=>{
            if(this._EffectKey)
                cc.audioEngine.playEffect(this.Shoot[2], false);
            if(this.Button[1].opacity === 255) {
                this.Button[1].opacity = 0;
                this._EffectKey = false;
            }
            else {
                this.Button[1].opacity = 255;
                this._EffectKey = true;
            }
        });
        this.Button[2].on('touchstart',()=>{
            if(this._EffectKey)
                cc.audioEngine.playEffect(this.Shoot[2], false);
            this.Resume();
            this.Board.active = false;
        });
        this.Tool.on('touchstart',()=>{
            if(this._EffectKey)
                cc.audioEngine.playEffect(this.Shoot[2], false);
            this._Pause = true;
            this.Pause();
            this.Board.active = true;
        });
    },
    CheckLevel(Level, Speed){
        this._RandomEgg = Level;
        this._Gravity = Speed;
    },
    //Khởi tạo map
    InitMap(){
        for(let i = 0; i < this._NumberEgg; i++){
            this._EggSheet[i] = [];
            this._MatrixEgg[i] = [];
        }
        this._Left = -(this.Puzzle.width / 2 - this.Wall.node.width) * 1.1;
        this._Right = (this.Puzzle.width / 2 - this.Wall.node.width)*1.1;
        let Bullet = [];
        Bullet[0] = Math.floor(Math.random()*this._RandomEgg);
        Bullet[1] = Math.floor(Math.random()*this._RandomEgg);
        this.Puzzle.on('touchstart', (Click)=>{
            if(!this._CheckGameOver){
                if(!this._Start){
                    this._Start = true;
                    this.Move();
                    require('Kroney').instance.StartTiming();
                }
                this._Bullet[1].destroy();
                this.SteGgyNode.stopAllActions();
                this.ReplaceBullet.addChild(this._Bullet[2]);
                this._Bullet[2].runAction(this.Bezier());
                this.SteGgyNode.runAction(cc.moveTo(0.3, 0, -120));
                let Vec = cc.v2(
                    Click.getLocationX() - this.Puzzle.width / 2,
                    Click.getLocationY() - this.Puzzle.height / 2
                );
                this._Bullet[0].getComponent("EggBullet").fire(cc.v2(this._Bullet[0].x, this._Bullet[0].y), Vec, this._Left, this._Right);
                Bullet[0] = Bullet[1];
                Bullet[1] = Math.floor(Math.random()*this._RandomEgg);
                this.scheduleOnce(()=>{
                    this._Bullet[2].destroy();
                    this.Shooting(Bullet);
                    this.SteGgyNode.runAction(cc.moveTo(0.3, 0, -80));
                }, 0.3);
            }
        });
        this.Puzzle.on('mousemove',(Event)=>{
            let Vec = cc.v2(
                Event.getLocationX() - this.Puzzle.width / 2,
                Event.getLocationY() - this.Puzzle.height / 2
            );
            let Pos = cc.v2(0,-500);
            require('Arrow').instance.CreateArrow(Vec.x, Vec.y,Pos);
        });
        this.SetUpMap();
        this.Shooting(Bullet);
    },
    SetUpMap(){
        for(let j = 0; j < this._Col; j++) {
            if(j % 2 === 0) {
                for (let i = 0; i < this._NumberEgg - 1; i++) {
                    this._MatrixEgg[i][j] = Math.floor(Math.random() * this._RandomEgg);
                    this._EggSheet[i][j] = cc.instantiate(this.EggSheet[this._MatrixEgg[i][j]]);
                    this._EggSheet[i][j].group = 'map';
                    this._EggSheet[i][j].x = i * this._Width + Math.pow((-1), j) * this._Width/4 - this.Puzzle.width /2 + this.Wall.node.width * 0.9;
                    this._EggSheet[i][j].y = j * this._Height + 350;
                }
            } else {
                for (let i = 0; i < this._NumberEgg; i++) {
                    this._MatrixEgg[i][j] = Math.floor(Math.random() * this._RandomEgg);
                    this._EggSheet[i][j] = cc.instantiate(this.EggSheet[this._MatrixEgg[i][j]]);
                    this._EggSheet[i][j].group = 'map';
                    this._EggSheet[i][j].x = i * this._Width + Math.pow((-1), j) * this._Width/4 - this.Puzzle.width /2 + this.Wall.node.width*0.9;
                    this._EggSheet[i][j].y = j * this._Height + 350;
                }
            }
        }
        for(let j = 0; j < this._Col; j++) {
            if(j % 2 === 0){
                for (let i = 0; i < this._NumberEgg - 1; i++) {
                    this.Puzzle.addChild(this._EggSheet[i][j]);
                    this._MatrixEgg[this._NumberEgg - 1][j] = 9;
                }
            } else{
                for (let i = 0; i < this._NumberEgg; i++) {
                    this.Puzzle.addChild(this._EggSheet[i][j]);
                }
            }
        }
    },

    //Đạn chuẩn bị bắn và đạn dự bị
    Shooting(Bullet){
        this.SteGgyNode.runAction(this.Jump());
        this._Bullet[0] = cc.instantiate(this.EggSheet[Bullet[0]]);
        this._Bullet[0].x = 0;
        this._Bullet[0].y = -500;
        this.Clone.addChild(this._Bullet[0]);
        this._Bullet[1] = cc.instantiate(this.EggSheet[Bullet[1]]);
        this._Bullet[1].x = 85;
        this._Bullet[1].y = 20;
        this._Bullet[1].group = 'default';
        this.ReplaceBullet.addChild(this._Bullet[1]);
        this._Bullet[2] = cc.instantiate(this.EggSheet[Bullet[1]]);
        this._Bullet[2].x = 85;
        this._Bullet[2].y = 15;
        this._Bullet[2].group = 'default';
    },

    //Bắt và xử lý va chạm
    onCollisionEgg(self, other){
        let temp = this.CheckRow(0);
        while(temp === undefined) {
            this.CheckMap();
            temp = this.CheckRow(0);
        }
        let tag = self.tag;
        let pos = this.CheckNode(other);
        if(self.node.y <= this._EggSheet[temp][0].y - 10)
            this.EditMap(self, temp, other, pos); //Khi viên đạn nằm dưới hàng số 0 và đẩy hàng số 0 lên
        else
            this.AddMap(self, temp, other, pos); //Khi viên đạn nằm ở vị trí bất kì trong map
        this.CheckInvisible();
        let toado = cc.v2(this._posx, this._posy);
        let path = this.find(tag, toado);
        if(path.length > 2){
            if(this._EffectKey)
                cc.audioEngine.playEffect(this.Shoot[1], false);
            this.Score.string = '+' + path.length * 10;
            this.Score.node.x = other.node.x;
            this.Score.node.y = other.node.y;
            this.Score.node.active = true;
            this.Score.node.runAction(cc.moveBy(0.5, 0, 30));
            this.scheduleOnce(()=>{
                this.Score.node.active = false;
            }, 0.5);
            //Update speed
            this._Score += path.length * 10;
            this.ImageScore.string = this._Score;

            //Destroy Egg  and Create Break Egg
            for(let i = 0; i < path.length; i++){
                this._EggBreak[i] = cc.instantiate(this.Break[this._MatrixEgg[path[i].x][path[i].y]]);
                this._MatrixEgg[path[i].x][path[i].y] = 9;
                this._EggBreak[i].x = this._EggSheet[path[i].x][path[i].y].x;
                this._EggBreak[i].y = this._EggSheet[path[i].x][path[i].y].y;
                this.Clone.addChild(this._EggBreak[i]);
                this._EggBreak[i].getComponent("Break").Break();
                this._EggSheet[path[i].x][path[i].y].destroy();
            }
            this.CheckEgg();
            this.CheckMap();
        } else{
            if(this._EffectKey)
                cc.audioEngine.playEffect(this.Shoot[0], false);
        }
    },
    EditMap(self, temp, other, pos) {
        for(let j = this._MatrixEgg[0].length - 2; j > -1; j--) {
            temp = this.CheckRow(j);
            let Check = this.CheckLocation(temp, this._EggSheet[temp][j].x);
            for (let i = 0; i < this._NumberEgg - Check; i++) { //Dời ma trận
                if(this._MatrixEgg[i][j + 1] !== 9){
                    this._EggSheet[i][j + 1].destroy();
                    this._MatrixEgg[i][j + 1] = this._MatrixEgg[i][j];
                    if (this._MatrixEgg[i][j] !== 9) {
                        this._EggSheet[i][j + 1] = cc.instantiate(this.EggSheet[this._MatrixEgg[i][j]]);
                        this._EggSheet[i][j + 1].x = this._EggSheet[i][j].x;
                        this._EggSheet[i][j + 1].y = this._EggSheet[i][j].y;
                        //Xóa node cũ
                        this._MatrixEgg[i][j] = 9;
                        this._EggSheet[i][j].destroy();
                        //Tạo node mới
                        this.Puzzle.addChild(this._EggSheet[i][j + 1]);
                        this._EggSheet[i][j + 1].runAction(this.RunAction());
                        this._EggSheet[i][j + 1].group = 'map';
                    }
                } else {
                    this._MatrixEgg[i][j + 1] = this._MatrixEgg[i][j];
                    if (this._MatrixEgg[i][j] !== 9) {
                        this._EggSheet[i][j + 1] = cc.instantiate(this.EggSheet[this._MatrixEgg[i][j]]);
                        this._EggSheet[i][j + 1].x = this._EggSheet[i][j].x;
                        this._EggSheet[i][j + 1].y = this._EggSheet[i][j].y;
                        //Xóa node cũ
                        this._MatrixEgg[i][j]= 9;
                        this._EggSheet[i][j].destroy();
                        //Tạo node mới
                        this.Puzzle.addChild(this._EggSheet[i][j + 1]);
                        this._EggSheet[i][j + 1].runAction(this.RunAction());
                        this._EggSheet[i][j + 1].group = 'map';
                    }
                }
            }
        }
        //Thêm trứng vào dãy cuối
        let CheckRow1 = this.CheckLocation(pos.x, other.node.x);  // = 0 là hàng 14, = 1 là hàng 13
        for(let i = 0; i < this._NumberEgg; i++){
            this._MatrixEgg[i][0] = 9;
        }
        if (CheckRow1 === 0) { //Hàng 14
            if (self.node.x < other.node.x) {
                this._MatrixEgg[pos.x - 1][pos.y] = self.tag;
                this._EggSheet[pos.x - 1][pos.y] = cc.instantiate(this.EggSheet[this._MatrixEgg[pos.x - 1][pos.y]]);
                this._EggSheet[pos.x - 1][pos.y].x = other.node.x - this._Width/2;
                this._EggSheet[pos.x - 1][pos.y].y = other.node.y - this._Height;
                self.node.destroy();
                this.Puzzle.addChild(this._EggSheet[pos.x - 1][pos.y]);
                this._EggSheet[pos.x - 1][pos.y].runAction(this.RunAction());
                this._EggSheet[pos.x - 1][pos.y].group = 'map';
                this._posx = pos.x - 1;
                this._posy = pos.y;
            } else {
                this._MatrixEgg[pos.x][pos.y] = self.tag;
                this._EggSheet[pos.x][pos.y] = cc.instantiate(this.EggSheet[this._MatrixEgg[pos.x][pos.y]]);
                this._EggSheet[pos.x][pos.y].x = other.node.x + this._Width/2;
                this._EggSheet[pos.x][pos.y].y = other.node.y - this._Height;
                self.node.destroy();
                this.Puzzle.addChild(this._EggSheet[pos.x][pos.y]);
                this._EggSheet[pos.x][pos.y].runAction(this.RunAction());
                this._EggSheet[pos.x][pos.y].group = 'map';
                this._posx = pos.x;
                this._posy = pos.y;
            }
        } else { //Hàng 13
            if (self.node.x < other.node.x) {
                this._MatrixEgg[pos.x][pos.y] = self.tag;
                this._EggSheet[pos.x][pos.y] = cc.instantiate(this.EggSheet[this._MatrixEgg[pos.x][pos.y]]);
                this._EggSheet[pos.x][pos.y].x = other.node.x - this._Width/2;
                this._EggSheet[pos.x][pos.y].y = other.node.y - this._Height;
                self.node.destroy();
                this.Puzzle.addChild(this._EggSheet[pos.x][pos.y]);
                this._EggSheet[pos.x][pos.y].runAction(this.RunAction());
                this._EggSheet[pos.x][pos.y].group = 'map';
                this._posx = pos.x;
                this._posy = pos.y;
            } else {
                this._MatrixEgg[pos.x + 1][pos.y] = self.tag;
                this._EggSheet[pos.x + 1][pos.y] = cc.instantiate(this.EggSheet[this._MatrixEgg[pos.x + 1][pos.y]]);
                this._EggSheet[pos.x + 1][pos.y].x = other.node.x + this._Width/2;
                this._EggSheet[pos.x + 1][pos.y].y = other.node.y - this._Height;
                self.node.destroy();
                this.Puzzle.addChild(this._EggSheet[pos.x + 1][pos.y]);
                this._EggSheet[pos.x + 1][pos.y].runAction(this.RunAction());
                this._EggSheet[pos.x + 1][pos.y].group = 'map';
                this._posx = pos.x + 1;
                this._posy = pos.y;
            }
        }
    },
    AddMap(self, temp, other, pos){
        //trứng self cùng hàng với trứng other
        if(self.node.y <= other.node.y + other.node.height/2
            && self.node.y >= other.node.y - other.node.height/2) {
            if (self.node.x <= other.node.x && self.node.x >= other.node.x - this._Width) {
                this._MatrixEgg[pos.x - 1][pos.y] = self.tag;
                this._EggSheet[pos.x - 1][pos.y] = cc.instantiate(this.EggSheet[self.tag]);
                this._EggSheet[pos.x - 1][pos.y].x = other.node.x - this._Width;
                this._EggSheet[pos.x - 1][pos.y].y = other.node.y;
                self.node.destroy();
                this.Puzzle.addChild(this._EggSheet[pos.x - 1][pos.y]);
                this._EggSheet[pos.x - 1][pos.y].runAction(this.RunAction());
                this._EggSheet[pos.x - 1][pos.y].group = 'map';
                this._posx = pos.x - 1;
                this._posy = pos.y;
            } else {
                this._MatrixEgg[pos.x + 1][pos.y] = self.tag;
                this._EggSheet[pos.x + 1][pos.y] = cc.instantiate(this.EggSheet[self.tag]);
                this._EggSheet[pos.x + 1][pos.y].x = other.node.x + this._Width;
                this._EggSheet[pos.x + 1][pos.y].y = other.node.y;
                self.node.destroy();
                this.Puzzle.addChild(this._EggSheet[pos.x + 1][pos.y]);
                this._EggSheet[pos.x + 1][pos.y].runAction(this.RunAction());
                this._EggSheet[pos.x + 1][pos.y].group = 'map';
                this._posx = pos.x + 1;
                this._posy = pos.y;
            }
        }
        //Trứng self nằm dưới trứng other
        else if(self.node.y < (other.node.y - other.node.height / 2)) {
            let CheckRow1 = this.CheckLocation(pos.x, other.node.x);
            if(CheckRow1 === 1){ //Other là hàng 13 => self hàng 14
                if(self.node.x <= other.node.x){
                    this._MatrixEgg[pos.x][pos.y - 1] = self.tag;
                    this._EggSheet[pos.x][pos.y - 1] = cc.instantiate(this.EggSheet[self.tag]);
                    this._EggSheet[pos.x][pos.y - 1].x = other.node.x - this._Width/2;
                    this._EggSheet[pos.x][pos.y - 1].y = other.node.y - this._Height;
                    self.node.destroy();
                    this.Puzzle.addChild(this._EggSheet[pos.x][pos.y - 1]);
                    this._EggSheet[pos.x][pos.y - 1].runAction(this.RunAction());
                    this._EggSheet[pos.x][pos.y - 1].group = 'map';
                    this._posx = pos.x;
                    this._posy = pos.y - 1;
                } else {
                    this._MatrixEgg[pos.x + 1][pos.y - 1] = self.tag;
                    this._EggSheet[pos.x + 1][pos.y - 1] = cc.instantiate(this.EggSheet[self.tag]);
                    this._EggSheet[pos.x + 1][pos.y - 1].x = other.node.x + this._Width/2;
                    this._EggSheet[pos.x + 1][pos.y - 1].y = other.node.y - this._Height;
                    self.node.destroy();
                    this.Puzzle.addChild(this._EggSheet[pos.x + 1][pos.y - 1]);
                    this._EggSheet[pos.x + 1][pos.y - 1].runAction(this.RunAction());
                    this._EggSheet[pos.x + 1][pos.y - 1].group = 'map';
                    this._posx = pos.x + 1;
                    this._posy = pos.y - 1;
                }
            }
            else { //Other là hàng 14 => self hàng 13
                if(self.node.x <= other.node.x){
                    this._MatrixEgg[pos.x - 1][pos.y - 1] = self.tag;
                    this._EggSheet[pos.x - 1][pos.y - 1] = cc.instantiate(this.EggSheet[self.tag]);
                    this._EggSheet[pos.x - 1][pos.y - 1].x = other.node.x - this._Width/2;
                    this._EggSheet[pos.x - 1][pos.y - 1].y = other.node.y - this._Height;
                    self.node.destroy();
                    this.Puzzle.addChild(this._EggSheet[pos.x - 1][pos.y - 1]);
                    this._EggSheet[pos.x - 1][pos.y - 1].runAction(this.RunAction());
                    this._EggSheet[pos.x - 1][pos.y - 1].group = 'map';
                    this._posx = pos.x - 1;
                    this._posy = pos.y - 1;
                }
                else {
                    if(pos.x < this._NumberEgg - 1){
                        this._MatrixEgg[pos.x][pos.y - 1] = self.tag;
                        this._EggSheet[pos.x][pos.y - 1] = cc.instantiate(this.EggSheet[self.tag]);
                        this._EggSheet[pos.x][pos.y - 1].x = other.node.x + this._Width/2;
                        this._EggSheet[pos.x][pos.y - 1].y = other.node.y - this._Height;
                        self.node.destroy();
                        this.Puzzle.addChild(this._EggSheet[pos.x][pos.y - 1]);
                        this._EggSheet[pos.x][pos.y - 1].runAction(this.RunAction());
                        this._EggSheet[pos.x][pos.y - 1].group = 'map';
                        this._posx = pos.x;
                        this._posy = pos.y - 1;
                    }
                }
            }
        } else { //Lớn hơn other
            let CheckRow1 = this.CheckLocation(pos.x, other.node.x);
            if(CheckRow1 === 1){ //Other là hàng 13 => self hàng 14
                if(self.node.x <= other.node.x){
                    this._MatrixEgg[pos.x][pos.y + 1] = self.tag;
                    this._EggSheet[pos.x][pos.y + 1] = cc.instantiate(this.EggSheet[self.tag]);
                    this._EggSheet[pos.x][pos.y + 1].x = other.node.x - this._Width/2;
                    this._EggSheet[pos.x][pos.y + 1].y = other.node.y + this._Height;
                    self.node.destroy();
                    this.Puzzle.addChild(this._EggSheet[pos.x][pos.y + 1]);
                    this._EggSheet[pos.x][pos.y + 1].runAction(this.RunAction());
                    this._EggSheet[pos.x][pos.y + 1].group = 'map';
                    this._posx = pos.x;
                    this._posy = pos.y + 1;
                } else {
                    this._MatrixEgg[pos.x + 1][pos.y + 1] = self.tag;
                    this._EggSheet[pos.x + 1][pos.y + 1] = cc.instantiate(this.EggSheet[self.tag]);
                    this._EggSheet[pos.x + 1][pos.y + 1].x = other.node.x + this._Width/2;
                    this._EggSheet[pos.x + 1][pos.y + 1].y = other.node.y + this._Height;
                    self.node.destroy();
                    this.Puzzle.addChild(this._EggSheet[pos.x + 1][pos.y + 1]);
                    this._EggSheet[pos.x + 1][pos.y + 1].runAction(this.RunAction());
                    this._EggSheet[pos.x + 1][pos.y + 1].group = 'map';
                    this._posx = pos.x + 1;
                    this._posy = pos.y + 1;
                }
            }
            else { //Other là hàng 14 => self hàng 13
                if(self.node.x <= other.node.x){
                    this._MatrixEgg[pos.x - 1][pos.y + 1] = self.tag;
                    this._EggSheet[pos.x - 1][pos.y + 1] = cc.instantiate(this.EggSheet[self.tag]);
                    this._EggSheet[pos.x - 1][pos.y + 1].x = other.node.x - this._Width/2;
                    this._EggSheet[pos.x - 1][pos.y + 1].y = other.node.y + this._Height;
                    self.node.destroy();
                    this.Puzzle.addChild(this._EggSheet[pos.x - 1][pos.y + 1]);
                    this._EggSheet[pos.x - 1][pos.y + 1].runAction(this.RunAction());
                    this._EggSheet[pos.x - 1][pos.y + 1].group = 'map';
                    this._posx = pos.x - 1;
                    this._posy = pos.y + 1;
                }
                else {
                    if(pos.x < this._NumberEgg - 1){
                        this._MatrixEgg[pos.x][pos.y + 1] = self.tag;
                        this._EggSheet[pos.x][pos.y + 1] = cc.instantiate(this.EggSheet[self.tag]);
                        this._EggSheet[pos.x][pos.y + 1].x = other.node.x + this._Width/2;
                        this._EggSheet[pos.x][pos.y + 1].y = other.node.y + this._Height;
                        self.node.destroy();
                        this.Puzzle.addChild(this._EggSheet[pos.x][pos.y + 1]);
                        this._EggSheet[pos.x][pos.y + 1].runAction(this.RunAction());
                        this._EggSheet[pos.x][pos.y + 1].group = 'map';
                        this._posx = pos.x;
                        this._posy = pos.y + 1;
                    }
                }
            }

        }
    },

    //Action
    RunAction() {  //Di chuyển trứng đi xuống
        let Run = cc.moveBy(0.5, 0, -this._Gravity);
        return cc.repeatForever(Run);
    },
    Jump(){
        let jump = cc.moveTo(0.3, 0, 10);
        let jump1 = cc.moveTo(0.3, 0, -10);
        return cc.repeatForever(cc.sequence(jump, jump1));
    },
    Bezier(){
        let vec = [cc.v2(100,130), cc.v2(150, 180),cc.v2(170, 190), cc.v2(190, 180), cc.v2(200, 160),
            cc.v2(220,130), cc.v2(240, 100)];
        return  cc.bezierTo(0.2, vec);
    },

    //Các hàm kiểm tra vị trí
    //Kiểm tra vị trí của trứng bị bắn trúng
    CheckNode(other){
        for(let j = 0; j < this._MatrixEgg[0].length; j++){
            for(let i = 0; i < this._NumberEgg; i ++){
                if(this._MatrixEgg[i][j] === other.tag){
                    if(other.node.x <= this._EggSheet[i][j].x + this._EggSheet[i][j].width/2
                        && other.node.x >= this._EggSheet[i][j].x - this._EggSheet[i][j].width/2
                        && other.node.y >= this._EggSheet[i][j].y - this._EggSheet[i][j].height/2
                        && other.node.y <= this._EggSheet[i][j].y + this._EggSheet[i][j].height/2)
                        return cc.v2(i,j);
                }
            }
        }
    },
    //Kiểm tra xem trứng còn bám với map hay không
    CheckRow(row){ //Kiểm tra hàng row có trứng hay không
        for(let i = 0; i < this._NumberEgg; i++) {
            if(this._MatrixEgg[i][row] !== 9)
                return i;
        }
    },
    //Kiểm tra trứng đang nằm ở hàng chẵn hay lẽ
    CheckLocation(i, j){ //i là điểm x của quả trứng, j là tọa độ x của quả trứng
        let deltaX = j - (i * this._Width - this.Puzzle.width /2 + this.Wall.node.width * 0.9);
        if(deltaX > 0)  // Lớn hơn là hàng 12, nhỏ hơn là hàng 13
            return 1;
        else
            return 0;
    },

    //Các hàm đệ quy
    //Kiểm tra hàng số 0 còn trứng hay ko
    CheckMap(){
        let check = false;
        for(let i = 0; i < this._NumberEgg; i++){
            if(this._MatrixEgg[i][0] !== 9){
                check = true;
                break;
            }
        }
        if(check === false){
            let Max = this._MatrixEgg[0].length;
            let Row = false;
            for(let j = 0; j < Max - 1; j++ ){
                if(!Row){
                    let NodeRow = this.CheckRow(j + 1);
                    if(NodeRow === undefined)
                        continue;
                    Row = true;
                }
                for(let i = 0; i < this._NumberEgg; i++){
                    this._MatrixEgg[i][j] = this._MatrixEgg[i][j + 1];
                    if (this._MatrixEgg[i][j] !== 9) {
                        this._EggSheet[i][j] = cc.instantiate(this.EggSheet[this._MatrixEgg[i][j]]);
                        this._EggSheet[i][j].x = this._EggSheet[i][j + 1].x;
                        this._EggSheet[i][j].y = this._EggSheet[i][j + 1].y;
                        this._MatrixEgg[i][j + 1] = 9;
                        this._EggSheet[i][j + 1].destroy();
                        this.Puzzle.addChild(this._EggSheet[i][j]);
                        this._EggSheet[i][j].runAction(this.RunAction());
                        this._EggSheet[i][j].group = 'map';
                    }
                }
            }
            let NodeRow = this.CheckRow(Max - 2);
            let CheckRow = this.CheckLocation(NodeRow, this._EggSheet[NodeRow][Max - 2].x);
            if(!this._CheckGameOver){
                for(let i = 0; i < this._NumberEgg + CheckRow - 1; i++){
                    this._MatrixEgg[i][Max - 1] = Math.floor(Math.random()*this._RandomEgg);
                    this._EggSheet[i][Max - 1] = cc.instantiate(this.EggSheet[this._MatrixEgg[i][Max - 1]]);
                    this._EggSheet[i][Max - 1].x = i * this._Width + Math.pow((-1), CheckRow) * this._Width/4 - this.Puzzle.width/2 + this.Wall.node.width*0.9;
                    this._EggSheet[i][Max - 1].y = this._EggSheet[NodeRow][Max - 2].y + this._Height;
                    this.Puzzle.addChild(this._EggSheet[i][Max - 1]);
                    this._EggSheet[i][Max - 1].runAction(this.RunAction());
                    this._EggSheet[i][Max - 1].group = 'map';
                }
                this.CheckMap();
            }
        }
        this.Speed();
    },
    CheckEgg(){
        let startpath = [];
        let FallingEgg = [];
        let Max = this._MatrixEgg[0].length;
        for(let i = 0; i < this._NumberEgg; i++){
            if(Max < this._MatrixEgg[i].length)
                Max = this._MatrixEgg[i].length;
        }
        let temp = this.CheckRow(Max - 2);
        let toado = cc.v2(temp, Max - 2);
        let count = 0;
        startpath.push(toado);
        startpath = this.Falling(toado, startpath);
        for(let j = 0; j < Max - 1; j++){
            for(let i = 0; i < this._NumberEgg; i++){
                if(this._MatrixEgg[i][j] !== 9){
                    let check = false;
                    for(let temp = 0; temp < startpath.length; temp++){
                        if(i === startpath[temp].x && j === startpath[temp].y)
                            check = true;
                    }
                    if(!check){
                        FallingEgg[count] = cc.instantiate(this.EggSheet[this._MatrixEgg[i][j]]);
                        FallingEgg[count].x = this._EggSheet[i][j].x;
                        FallingEgg[count].y = this._EggSheet[i][j].y;
                        count++;
                        this._MatrixEgg[i][j] = 9;
                        this._EggSheet[i][j].group = 'default';
                        this._EggSheet[i][j].destroy();
                    }
                }
            }
        }
        for(let i = 0; i < FallingEgg.length; i++){
            this.Puzzle.addChild(FallingEgg[i]);
            FallingEgg[i].group = 'default';
        }
        let t = 0.1;
        this.schedule(()=>{
            for(let i = 0; i < FallingEgg.length; i++){
                FallingEgg[i].runAction(cc.moveBy(0.01, 0 , -0.5*220*Math.pow(t,2)));
            }
            t += 0.01;
        },0.01,80,0);
        this.scheduleOnce(()=>{
            for(let i = 0; i < FallingEgg.length; i++){
                FallingEgg[i].destroy();
            }
        }, 0.7);
    },
    Falling(toado, startpath){
        let location = this.CheckLocation(toado.x, this._EggSheet[toado.x][toado.y].x);
        for(let i = 0; i < 4; i++){
            let xa = 0;
            let ya = 0;
            switch (i) {
                case 0:
                    xa++;
                    break;
                case 1:
                    if(location === 1){
                        xa++;
                        ya--;
                    } else
                        ya--;
                    break;
                case 2:
                    if(location === 1)
                        ya--;
                    else {
                        xa--;
                        ya--;
                    }
                    break;
                case 3:
                    xa--;
                    break;
            }
            if(toado.x + xa < this._NumberEgg && toado.y + ya > -1 && toado.x + xa > -1
                && this._MatrixEgg[toado.x + xa][toado.y + ya] !== 9) {
                let compare = false;
                for(let i = 0; i < startpath.length; i++) {
                    if (startpath[i].x === toado.x + xa && startpath[i].y === toado.y + ya)
                        compare = true;
                }
                if(!compare){
                    let path = cc.v2(toado.x + xa,toado.y + ya);
                    startpath.push(path);
                    startpath = this.Falling(path,startpath);
                }
            }
        }
        return startpath;
    }, //Điều kiện rơi trứng

    //Kiểm tra kết quả khi bắn
    find(tag,toado){
        let startpath = [];
        startpath.push(toado);
        startpath = this.finding(tag, toado, startpath);
        return startpath;
    },
    finding(tag, toado, startpath){
        let location = this.CheckLocation(toado.x, this._EggSheet[toado.x][toado.y].x);
        let temp = this.CheckRow(0);
        for(let i = 0; i < 6; i++){
            let xa = 0;
            let ya = 0;
            switch(i) {
                case 0:
                    if(location === 1){ //1 là hàng 12, 0 là hàng 9
                        ya--;
                        break;
                    } else {
                        xa--;
                        ya--;
                        break;
                    }
                case 1:
                    xa--;
                    break;
                case 2:
                    if (location === 1) {
                        ya++;
                        break;
                    } else {
                        xa--;
                        ya++;
                        break;
                    }
                case 3:
                    if (location === 1) {
                        xa++;
                        ya++;
                        break;
                    } else {
                        ya++;
                        break;
                    }
                case 4:
                    xa++;
                    break;
                case 5:
                    if(location === 1){
                        xa++;
                        ya--;
                        break;
                    } else {
                        ya--;
                        break;
                    }
            }
            if(toado.x + xa < 0 || toado.y + ya < 0 || toado.y + ya > this._MatrixEgg[temp].length - 1 || toado.x + xa > this._NumberEgg - 1)
                continue;
            if(this._MatrixEgg[toado.x + xa][toado.y + ya] === tag) {
                let compare = false;
                for(let i = 0; i < startpath.length; i++){
                    if(startpath[i].x === toado.x + xa && startpath[i].y === toado.y + ya) {
                        compare = true;
                        break;
                    }
                }
                if(!compare){
                    let path = cc.v2(toado.x + xa, toado.y + ya);
                    startpath.push(path);
                    startpath = this.finding(tag,path,startpath);
                }
            }
        }
        return startpath;
    },

    //WhirLey
    WhirLeyComing(){
        this.WhirLeyEgg = cc.instantiate(this.EggSheet[this._RandomEgg]);
        this.WhirLeyEgg.x = 3 ;
        this.WhirLeyEgg.y = -60;
        if(Math.floor(Math.random()) === 0)
            this.WhirLey.node.x = 165;
        else
            this.WhirLey.node.x = -110;
        this.WhirLey.node.y = -650;
        this.WhirLeyEgg.group = 'Whirley';
        this.WhirLey.node.addChild(this.WhirLeyEgg);
        this.WhirLey.getComponent('Whirley').flying(Math.floor(Math.random()), this._RandomEgg, this._Left, this._Right, this.Rope.node.y);
    },
    WhirLeyOut(){
        this._RandomEgg++;
        this.WhirLeyEgg.destroy();
        this.WhirLey.node.y = -650;
        if(this._RandomEgg > 8){
            let flag = false;
            require('Kroney').instance.Flag(flag);
        }
    },
    WhirLeyContact(self, other){
        if(this._EffectKey)
            cc.audioEngine.playEffect(this.Shoot[1], false);
        this.Score.string = '+' + 250;
        this.Score.node.x = self.node.x;
        this.Score.node.y = self.node.y;
        this.Score.node.active = true;
        this.Score.node.runAction(cc.moveBy(0.5, 0, 30));
        this._Score += 250;
        this.ImageScore.string = this._Score;
        this.scheduleOnce(()=>{
            this.Score.node.active = false;
        }, 0.5);
        //Break Egg
        let Break = cc.instantiate(this.Break[other.tag]);
        Break.x = self.node.x;
        Break.y = self.node.y;
        Break.getComponent("Break").Break();
        this.Clone.addChild(Break);
        self.node.destroy();
        other.node.destroy();
        this.WhirLey.node.y = -650;
    },

    //Gravity
    UpdateGravity(){
        this._Gravity++;
        for(let j = 0; j < this._MatrixEgg[0].length; j++){
            for(let i = 0; i < this._NumberEgg; i++){
                if(this._MatrixEgg[i][j] !== 9)
                {
                    this._EggSheet[i][j].stopAllActions();
                    this._EggSheet[i][j].runAction(this.RunAction());
                }
            }
        }
    },
    Speed(){
        let node = this.CheckRow(0);
        let check = false;
        if(node !== undefined){
            if(this._EggSheet[node][0].y > this.Puzzle.height*0.25 && this._Update === false){
                this._Gravity = this._Gravity * 3;
                this._Update = true;
                check = true;
            }
            if(this._EggSheet[node][0].y < -this.Puzzle.height*0.1 && this._Update === true){
                this._Gravity = this._Gravity / 3;
                this._Update = false;
                check = true;
            }
            if(check){
                for(let j = 0; j < this._MatrixEgg[0].length; j++){
                    for(let i = 0; i < this._NumberEgg; i++){
                        if(this._MatrixEgg[i][j] !== 9)
                        {
                            this._EggSheet[i][j].stopAllActions();
                            this._EggSheet[i][j].runAction(this.RunAction());
                        }
                    }
                }
            }
        }
    },

    //Game Over
    GameOver(){
        let Count = 0;
        this.CheckInvisible();
        if(this._ContactRope){
            this._ContactRope = false;
            let temp = this._Gravity;
            //Set gravity, disable sprite, play animation
            this._Gravity = 2;
            this.SteGgy.node.active = false;
            this.Tank.node.active = false;
            this.Terror[0].node.active = true;
            this.Terror[1].node.active = true;
            let terror = [];
            terror[0] = this.Terror[0].node.getComponent(cc.Animation);
            terror[1] = this.Terror[1].node.getComponent(cc.Animation);
            terror[0].play();
            terror[1].play();
            for(let j = 0; j < this._MatrixEgg[0].length; j++){
                for(let i = 0; i < this._NumberEgg; i++){
                    if(this._MatrixEgg[i][j] !== 9)
                    {
                        this._EggSheet[i][j].stopAllActions();
                        this._EggSheet[i][j].runAction(this.RunAction());
                    }
                }
            }
            //Set timer
            this.schedule(()=>{
                let node = this.CheckRow(0);
                if((this._EggSheet[node][0].y - this._Height/2) < this.Rope.node.y){
                    Count++;
                    if(Count === 3) {
                        for(let j = 0; j < this._MatrixEgg[0].length; j++){
                            for(let i = 0; i < this._NumberEgg; i++){
                                if(this._MatrixEgg[i][j] !== 9)
                                {
                                    this._EggSheet[i][j].stopAllActions();
                                }
                            }
                        }
                        this.StopGame();
                    }
                } else {
                    this.Rope.node.group = 'Rope';
                    this._ContactRope = true;
                    this.SteGgy.node.active = true;
                    this.Tank.node.active = true;
                    this.Terror[0].node.active = false;
                    this.Terror[1].node.active = false;
                    this._Gravity = temp;
                    for(let j = 0; j < this._MatrixEgg[0].length; j++){
                        for(let i = 0; i < this._NumberEgg; i++){
                            if(this._MatrixEgg[i][j] !== 9)
                            {
                                this._EggSheet[i][j].stopAllActions();
                                this._EggSheet[i][j].runAction(this.RunAction());
                            }
                        }
                    }
                }
            },1,2,0);
        }

    },
    StopGame(){
        this._CheckGameOver = true;
        this._Bullet[0].destroy();
        this._Bullet[1].destroy();
        this._Bullet[2].destroy();
        this.FootJump();
        require('Kroney').instance.StopTiming();
        cc.audioEngine.stopMusic();
        //Phần này đúng
        this.scheduleOnce(()=>{
            this.SteGgy.node.active = false;
            this.Tank.node.active = false;
            this.Terror[0].node.active = false;
            this.Terror[1].node.active = false;
            this.SlingShot.node.active = false;
            this.WhirLey.node.active = false;
            this.KroNey.node.active = false;
            this.End.active = true;
        },0.3);
        this.scheduleOnce(()=>{
            this.End.getComponent("GameOver").Announcement();
            if(this._MusicKey)
                cc.audioEngine.playMusic(this.SoundEnd, false);
            if(this._EffectKey)
                cc.audioEngine.playEffect(this.SoundGO, false);
        }, 0.6);
    },
    FootJump() {
        let PosY = this.CheckRow(this._MatrixEgg[0].length - 1);
        this.Foot.node.y = this._EggSheet[PosY][this._MatrixEgg[0].length - 1].y + this.Foot.node.height / 2 + this._Height / 2;
        let a =  -7 - this.Foot.node.y/Math.pow(0.25,2);
        let temp = 0;
        let t = 0;
        this.schedule(()=>{
            this.Foot.node.y += a*Math.pow(t,2) - a*Math.pow(t-0.01,2);
            if(this.Foot.node.y < -7)
            {
                this.Foot.node.y = -7;
                this.unscheduleAllCallbacks();
            }
            for (let j = this._MatrixEgg[0].length - 1; j > -1; j--) {
                for (let i = 0; i < this._NumberEgg; i++) {
                    if (this._MatrixEgg[i][j] !== 9) {
                        this._EggSheet[i][j].y += a*Math.pow(t + 0.01,2) - a*Math.pow(t,2);
                        if(this._EggSheet[i][j].y < this.Rope.node.y + this._Height / 2){
                            this._EggBreak[temp] = cc.instantiate(this.Break[this._MatrixEgg[i][j]]);
                            this._MatrixEgg[i][j] = 9;
                            this._EggBreak[temp].x = this._EggSheet[i][j].x;
                            this._EggBreak[temp].y = this.Rope.node.y + this._Height / 2;
                            this.Clone.addChild(this._EggBreak[temp]);
                            this._EggBreak[temp].getComponent("Break").BreakGameOver();
                            this._EggSheet[i][j].destroy();
                            temp++;
                        }
                    }
                }
            }
            t += 0.01;
        },0.01,25,0);
    },
    CheckInvisible(){
        for(let j = 0; j < this._MatrixEgg[0].length - 1;j++){
            for(let i = 0; i < this._NumberEgg; i++){
                if(this._MatrixEgg[i][j] !== 9){
                    if(this._EggSheet[i][j].y <= this.Rope.node.y + this._Height / 1.8 + this.Rope.node.height / 2)
                        this._EggSheet[i][j].getComponent('EggBullet').Invisible();
                }
            }
        }
    },
    Move(){
        for(let j = 0; j < this._MatrixEgg[0].length; j++){
            for(let i = 0; i < this._NumberEgg; i++){
                if(this._MatrixEgg[i][j] !== 9)
                    this._EggSheet[i][j].runAction(this.RunAction());
            }
        }
    },
    Pause(){
        for(let j = 0; j < this._MatrixEgg[0].length; j++){
            for(let i = 0; i < this._NumberEgg; i++){
                if(this._MatrixEgg[i][j] !== 9)
                    this._EggSheet[i][j].stopAllActions();
            }
        }
        cc.director.pause();
        cc.audioEngine.pauseMusic();
    },
    Resume(){
        for(let j = 0; j < this._MatrixEgg[0].length; j++){
            for(let i = 0; i < this._NumberEgg; i++){
                if(this._MatrixEgg[i][j] !== 9)
                    this._EggSheet[i][j].runAction(this.RunAction());
            }
        }
        cc.director.resume();
        if(this._MusicKey)
            cc.audioEngine.resumeMusic();
        else
            cc.audioEngine.pauseMusic();
    }
});

