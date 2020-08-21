const Gameplay = cc.Class({
    extends: cc.Component,
    statics: {
        instance: null
    },
    properties: {
        //Effect
        Sound: [cc.AudioClip],
        SoundTrack: cc.AudioClip,
        SoundEnd: cc.AudioClip,
        _Gravity: 5,

        //Sprite
        Tank: cc.Sprite,
        SteGgy: cc.Sprite,
        WhirLey: cc.Sprite,
        KroNey: cc.Sprite,
        Inchy: cc.Sprite,
        Foot: cc.Sprite,
        Rope: cc.Sprite,
        SlingShot: cc.Sprite,
        Terror: [cc.Sprite],
        ImageScore: cc.Label,
        Score: cc.Label,
        WhirLeyEgg: null,
        _SlingShot: null,

        //Key
        _Swap: false,
        _Check: false,
        _CheckGameOver: false,
        _Start: false,
        _ContactRope: true,
        _Stop: false,
        _Update: false,
        _Board: false,
        _Effect: true,

        //Init map
        EggSheet: [cc.Prefab],
        _MatrixEgg: [],
        _EggSheet: [],
        _RandomEgg: 3,

        //Mode Game
        EasyMode: cc.Node,
        NormalMode: cc.Node,
        HardMode: cc.Node,
        End: cc.Node,

        //Fire
        SteGgyNode: cc.Node,
        ReplaceBullet: cc.Node,
        _Bullet: [],

        //Break Egg
        Break: [cc.Prefab],
        _EggBreak: [],

        //Other
        _Score: 0,
        _pow: 0,
        _Vec: 0,
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
    },
    start(){
        this._Score = 0;
        this.Score.node.active = false;
        cc.audioEngine.playMusic(this.SoundTrack, true);
        this.InitMap();
        for(let j = 0; j < this._MatrixEgg[0].length; j++){
            for(let i = 0; i < 9; i++){
                if(this._MatrixEgg[i][j] !== 9){
                    this._EggSheet[i][j].runAction(cc.moveBy(0.5, 0,-150));
                }
            }
        }
        this.Terror[0].node.active = false;
        this.Terror[1].node.active = false;
        this.KroNey.node.runAction(cc.moveBy(0.5, 0, -150));
    },

    CheckLevel(Level, Speed, Mode){
        this._RandomEgg = Level;
        this._Gravity = Speed;
        if(Mode === 0){
            this.EasyMode.active = true;
            this.NormalMode.active = false;
            this.HardMode.active = false;
        } else if(Mode === 1){
            this.EasyMode.active = false;
            this.NormalMode.active = true;
            this.HardMode.active = false;
        } else {
            this.EasyMode.active = false;
            this.NormalMode.active = false;
            this.HardMode.active = true;
        }
    },
    update (dt) {
   },
    //Khởi tạo map
    InitMap(){
        for(let i = 0; i < 9; i++){
            this._EggSheet[i] = [];
            this._MatrixEgg[i] = [];
        }
        let Bullet = [];
        Bullet[0] = Math.floor(Math.random()*this._RandomEgg);
        Bullet[1] = Math.floor(Math.random()*this._RandomEgg);
        this.node.on('mousedown', (Click)=>{
            if(this._CheckGameOver === false && this._Board === false){
                if(this._Start === false){
                    this._Start = true;
                    let InchyAim = this.Inchy.getComponent(cc.Animation);
                    InchyAim.play();
                    require('Kroney').instance.StartTiming();
                }
                this._Bullet[1].destroy();
                this.SteGgyNode.stopAllActions();
                this.node.addChild(this._Bullet[2]);
                this._Bullet[2].runAction(this.Bezier());
                this.SteGgyNode.runAction(cc.moveTo(0.3, 0, -120));
                this._Vec = cc.v2(Click.getLocationX() - 320 ,Click.getLocationY() - 242);
                this._Bullet[0].getComponent("EggBullet").fire(cc.v2(this._Bullet[0].x, this._Bullet[0].y), this._Vec);
                Bullet[0] = Bullet[1];
                Bullet[1] = Math.floor(Math.random()*this._RandomEgg);
                this.scheduleOnce(()=>{
                    this._Bullet[2].destroy();
                    this.Shooting(Bullet);
                    this.SteGgyNode.runAction(cc.moveTo(0.3, 0, -80));
                }, 0.3);
            }
        });
        this.SetUpMap();
        this.Shooting(Bullet);
    },
    SetUpMap(){
        for(let j = 0; j < 15; j++) {
            if((this._pow + j) % 2 === 0) {
                for (let i = 0; i < 8; i++) {
                    this._MatrixEgg[i][j] = Math.floor(Math.random() * this._RandomEgg);
                    this._EggSheet[i][j] = cc.instantiate(this.EggSheet[this._MatrixEgg[i][j]]);
                    this._EggSheet[i][j].group = 'map';
                    this._EggSheet[i][j].x = i * 34 + Math.pow((-1), j) * 8.5 - 70;
                    this._EggSheet[i][j].y = j * 35 + 300;
                }
            } else {
                for (let i = 0; i < 9; i++) {
                    this._MatrixEgg[i][j] = Math.floor(Math.random() * this._RandomEgg);
                    this._EggSheet[i][j] = cc.instantiate(this.EggSheet[this._MatrixEgg[i][j]]);
                    this._EggSheet[i][j].group = 'map';
                    this._EggSheet[i][j].x = i * 34 + Math.pow((-1), j) * 8.5 - 70;
                    this._EggSheet[i][j].y = j * 35 + 300;
                }
            }
        }
        for(let j = 0; j < 15; j++) {
            if((this._pow + j) % 2 === 0){
                for (let i = 0; i < 8; i++) {
                    this.node.addChild(this._EggSheet[i][j]);
                    this._MatrixEgg[8][j] = 9;
                }
            } else{
                for (let i = 0; i < 9; i++) {
                    this.node.addChild(this._EggSheet[i][j]);
                }
            }
        }
    },

    //Đạn chuẩn bị bắn và đạn dự bị
    Shooting(Bullet){
        this.SteGgyNode.runAction(this.Jump());
        this._Bullet[0] = cc.instantiate(this.EggSheet[Bullet[0]]);
        this._Bullet[0].x = 75;
        this._Bullet[0].y = -200;
        this.node.addChild(this._Bullet[0]);
        this._Bullet[1] = cc.instantiate(this.EggSheet[Bullet[1]]);
        this._Bullet[1].x = 5;
        this._Bullet[1].y = 10;
        this._Bullet[1].group = 'default';
        this.ReplaceBullet.addChild(this._Bullet[1]);
        this._Bullet[2] = cc.instantiate(this.EggSheet[Bullet[1]]);
        this._Bullet[2].x = 0;
        this._Bullet[2].y = -180;
        this._Bullet[2].group = 'default';
    },

    //Bắt và xử lý va chạm
    onCollisionEgg(self, other){
        if(self.node.y < -125)
            self.getComponent('EggBullet').Invisible();
        this.SetLocation(self, other);
    }, //Xử lý khi xảy ra va chạm
    SetLocation(self, other) { //Đặt lại vị trí của viên đạn khi va chạm vào Map
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
        let toado = cc.v2(this._posx, this._posy);
        let path = [];
        path = this.find(tag, toado);
        if(path.length > 2){
            let inchyaim = this.Inchy.getComponent(cc.Animation);
            let aim = this.Tank.getComponent(cc.Animation);
            this.Score.string = '+' + path.length*10;
            this.Score.node.x = other.node.x + 320;
            this.Score.node.y = other.node.y + 240;
            this.Score.node.active = true;
            this.Score.node.runAction(cc.moveBy(0.5, 0, 30));
            this.scheduleOnce(()=>{
               this.Score.node.active = false;
            }, 0.5);
            if(path.length > 4){
                if(path.length === 5)
                {
                    inchyaim.play('Combo');
                    aim.play('Charge');
                } else if(path.length === 6){
                    inchyaim.play('SuperCombo');
                    aim.play('Kaboom');
                } else if(path.length === 7){
                    inchyaim.play('Cambrian');
                    aim.play('Blastit');
                } else if(path.length === 8){
                    inchyaim.play('Triassic');
                    aim.play('Fire');
                } else {
                    let random = Math.floor(Math.random() * 3);
                    switch(random){
                        case 0:
                            inchyaim.play('Dyno');
                            break;
                        case 1:
                            inchyaim.play('Jurassic');
                            break;
                        case 2:
                            inchyaim.play('Create');
                            break;
                        default:
                            inchyaim.play('Jurassic');
                            break;
                    }
                    aim.play('Fire');
                }
                this.scheduleOnce(()=>{
                    inchyaim.play('Inchy');
                },0.42);
                this.scheduleOnce(()=>{
                    aim.play('Tank');
                },0.87);
            }
            //Update speed
            this._Score += path.length * 10;
            this.ImageScore.string = this._Score;
            if(this._Effect === true)
                cc.audioEngine.playEffect(this.Sound[0], false);

            //Destroy Egg  and Create Break Egg
            for(let i = 0; i < path.length; i++){
                this._EggBreak[i] = cc.instantiate(this.Break[this._MatrixEgg[path[i].x][path[i].y]]);
                this._MatrixEgg[path[i].x][path[i].y] = 9;
                this._EggBreak[i].x = this._EggSheet[path[i].x][path[i].y].x;
                this._EggBreak[i].y = this._EggSheet[path[i].x][path[i].y].y;
                this.node.addChild(this._EggBreak[i]);
                this._EggBreak[i].getComponent("Break").Break();
                this._EggSheet[path[i].x][path[i].y].destroy();
            }
            this.CheckEgg();
            this.CheckMap();
        } else{
            if(this._Effect === true)
                cc.audioEngine.playEffect(this.Sound[1], false);
        }
    },
    EditMap(self, temp, other, pos) {
        for(let j = this._MatrixEgg[0].length - 2; j > -1; j--) {
            temp = this.CheckRow(j);
            let Check = this.CheckLocation(temp, this._EggSheet[temp][j].x);
            for (let i = 0; i < 9 - Check; i++) { //Dời ma trận
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
                        this.node.addChild(this._EggSheet[i][j + 1]);
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
                        this.node.addChild(this._EggSheet[i][j + 1]);
                        this._EggSheet[i][j + 1].runAction(this.RunAction());
                        this._EggSheet[i][j + 1].group = 'map';
                    }
                }
            }
        }
        //Thêm trứng vào dãy cuối
        let CheckRow1 = this.CheckLocation(pos.x, other.node.x);  // = 0 là hàng 9, = 1 là hàng 8
        for(let i = 0; i < 9; i++){
            this._MatrixEgg[i][0] = 9;
        }
        if (CheckRow1 === 0) { //Hàng 9
            if (self.node.x < other.node.x) {
                this._MatrixEgg[pos.x - 1][pos.y] = self.tag;
                this._EggSheet[pos.x - 1][pos.y] = cc.instantiate(this.EggSheet[this._MatrixEgg[pos.x - 1][pos.y]]);
                this._EggSheet[pos.x - 1][pos.y].x = other.node.x - 17;
                this._EggSheet[pos.x - 1][pos.y].y = other.node.y - 35;
                self.node.destroy();
                this.node.addChild(this._EggSheet[pos.x - 1][pos.y]);
                this._EggSheet[pos.x - 1][pos.y].runAction(this.RunAction());
                this._EggSheet[pos.x - 1][pos.y].group = 'map';
                this._posx = pos.x - 1;
                this._posy = pos.y;
            } else {
                this._MatrixEgg[pos.x][pos.y] = self.tag;
                this._EggSheet[pos.x][pos.y] = cc.instantiate(this.EggSheet[this._MatrixEgg[pos.x][pos.y]]);
                this._EggSheet[pos.x][pos.y].x = other.node.x + 17;
                this._EggSheet[pos.x][pos.y].y = other.node.y - 35;
                self.node.destroy();
                this.node.addChild(this._EggSheet[pos.x][pos.y]);
                this._EggSheet[pos.x][pos.y].runAction(this.RunAction());
                this._EggSheet[pos.x][pos.y].group = 'map';
                this._posx = pos.x;
                this._posy = pos.y;
            }
        } else { //Hàng 8
            if (self.node.x < other.node.x) {
                this._MatrixEgg[pos.x][pos.y] = self.tag;
                this._EggSheet[pos.x][pos.y] = cc.instantiate(this.EggSheet[this._MatrixEgg[pos.x][pos.y]]);
                this._EggSheet[pos.x][pos.y].x = other.node.x - 17;
                this._EggSheet[pos.x][pos.y].y = other.node.y - 35;
                self.node.destroy();
                this.node.addChild(this._EggSheet[pos.x][pos.y]);
                this._EggSheet[pos.x][pos.y].runAction(this.RunAction());
                this._EggSheet[pos.x][pos.y].group = 'map';
                this._posx = pos.x;
                this._posy = pos.y;
            } else {
                this._MatrixEgg[pos.x + 1][pos.y] = self.tag;
                this._EggSheet[pos.x + 1][pos.y] = cc.instantiate(this.EggSheet[this._MatrixEgg[pos.x + 1][pos.y]]);
                this._EggSheet[pos.x + 1][pos.y].x = other.node.x + 17;
                this._EggSheet[pos.x + 1][pos.y].y = other.node.y - 35;
                self.node.destroy();
                this.node.addChild(this._EggSheet[pos.x + 1][pos.y]);
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
            if (self.node.x <= other.node.x && self.node.x >= other.node.x - 34) {
                this._MatrixEgg[pos.x - 1][pos.y] = self.tag;
                this._EggSheet[pos.x - 1][pos.y] = cc.instantiate(this.EggSheet[self.tag]);
                this._EggSheet[pos.x - 1][pos.y].x = other.node.x - 34;
                this._EggSheet[pos.x - 1][pos.y].y = other.node.y;
                self.node.destroy();
                this.node.addChild(this._EggSheet[pos.x - 1][pos.y]);
                this._EggSheet[pos.x - 1][pos.y].runAction(this.RunAction());
                this._EggSheet[pos.x - 1][pos.y].group = 'map';
                this._posx = pos.x - 1;
                this._posy = pos.y;
            } else {
                this._MatrixEgg[pos.x + 1][pos.y] = self.tag;
                this._EggSheet[pos.x + 1][pos.y] = cc.instantiate(this.EggSheet[self.tag]);
                this._EggSheet[pos.x + 1][pos.y].x = other.node.x + 34;
                this._EggSheet[pos.x + 1][pos.y].y = other.node.y;
                self.node.destroy();
                this.node.addChild(this._EggSheet[pos.x + 1][pos.y]);
                this._EggSheet[pos.x + 1][pos.y].runAction(this.RunAction());
                this._EggSheet[pos.x + 1][pos.y].group = 'map';
                this._posx = pos.x + 1;
                this._posy = pos.y;
            }
        }
        //Trứng self nằm dưới trứng other
        else if(self.node.y < (other.node.y - other.node.height / 2)) {
            let CheckRow1 = this.CheckLocation(pos.x, other.node.x);
            if(CheckRow1 === 1){ //Other là hàng 8 => self hàng 9
                if(self.node.x <= other.node.x){
                    this._MatrixEgg[pos.x][pos.y - 1] = self.tag;
                    this._EggSheet[pos.x][pos.y - 1] = cc.instantiate(this.EggSheet[self.tag]);
                    this._EggSheet[pos.x][pos.y - 1].x = other.node.x - 17;
                    this._EggSheet[pos.x][pos.y - 1].y = other.node.y - 35;
                    self.node.destroy();
                    this.node.addChild(this._EggSheet[pos.x][pos.y - 1]);
                    this._EggSheet[pos.x][pos.y - 1].runAction(this.RunAction());
                    this._EggSheet[pos.x][pos.y - 1].group = 'map';
                    this._posx = pos.x;
                    this._posy = pos.y - 1;
                } else {
                    this._MatrixEgg[pos.x + 1][pos.y - 1] = self.tag;
                    this._EggSheet[pos.x + 1][pos.y - 1] = cc.instantiate(this.EggSheet[self.tag]);
                    this._EggSheet[pos.x + 1][pos.y - 1].x = other.node.x + 17;
                    this._EggSheet[pos.x + 1][pos.y - 1].y = other.node.y - 35;
                    self.node.destroy();
                    this.node.addChild(this._EggSheet[pos.x + 1][pos.y - 1]);
                    this._EggSheet[pos.x + 1][pos.y - 1].runAction(this.RunAction());
                    this._EggSheet[pos.x + 1][pos.y - 1].group = 'map';
                    this._posx = pos.x + 1;
                    this._posy = pos.y - 1;
                }
            }
            else { //Other là hàng 9 => self hàng 8
                if(self.node.x <= other.node.x){
                    this._MatrixEgg[pos.x - 1][pos.y - 1] = self.tag;
                    this._EggSheet[pos.x - 1][pos.y - 1] = cc.instantiate(this.EggSheet[self.tag]);
                    this._EggSheet[pos.x - 1][pos.y - 1].x = other.node.x - 17;
                    this._EggSheet[pos.x - 1][pos.y - 1].y = other.node.y - 35;
                    self.node.destroy();
                    this.node.addChild(this._EggSheet[pos.x - 1][pos.y - 1]);
                    this._EggSheet[pos.x - 1][pos.y - 1].runAction(this.RunAction());
                    this._EggSheet[pos.x - 1][pos.y - 1].group = 'map';
                    this._posx = pos.x - 1;
                    this._posy = pos.y - 1;
                }
                else {
                    if(pos.x < 8){
                        this._MatrixEgg[pos.x][pos.y - 1] = self.tag;
                        this._EggSheet[pos.x][pos.y - 1] = cc.instantiate(this.EggSheet[self.tag]);
                        this._EggSheet[pos.x][pos.y - 1].x = other.node.x + 17;
                        this._EggSheet[pos.x][pos.y - 1].y = other.node.y - 35;
                        self.node.destroy();
                        this.node.addChild(this._EggSheet[pos.x][pos.y - 1]);
                        this._EggSheet[pos.x][pos.y - 1].runAction(this.RunAction());
                        this._EggSheet[pos.x][pos.y - 1].group = 'map';
                        this._posx = pos.x;
                        this._posy = pos.y - 1;
                    }
                }
            }
        } else { //Lớn hơn other
            let CheckRow1 = this.CheckLocation(pos.x, other.node.x);
            if(CheckRow1 === 1){ //Other là hàng 8 => self hàng 9
                if(self.node.x <= other.node.x){
                    this._MatrixEgg[pos.x][pos.y + 1] = self.tag;
                    this._EggSheet[pos.x][pos.y + 1] = cc.instantiate(this.EggSheet[self.tag]);
                    this._EggSheet[pos.x][pos.y + 1].x = other.node.x - 17;
                    this._EggSheet[pos.x][pos.y + 1].y = other.node.y + 35;
                    self.node.destroy();
                    this.node.addChild(this._EggSheet[pos.x][pos.y + 1]);
                    this._EggSheet[pos.x][pos.y + 1].runAction(this.RunAction());
                    this._EggSheet[pos.x][pos.y + 1].group = 'map';
                    this._posx = pos.x;
                    this._posy = pos.y + 1;
                } else {
                    this._MatrixEgg[pos.x + 1][pos.y + 1] = self.tag;
                    this._EggSheet[pos.x + 1][pos.y + 1] = cc.instantiate(this.EggSheet[self.tag]);
                    this._EggSheet[pos.x + 1][pos.y + 1].x = other.node.x + 17;
                    this._EggSheet[pos.x + 1][pos.y + 1].y = other.node.y + 35;
                    self.node.destroy();
                    this.node.addChild(this._EggSheet[pos.x + 1][pos.y + 1]);
                    this._EggSheet[pos.x + 1][pos.y + 1].runAction(this.RunAction());
                    this._EggSheet[pos.x + 1][pos.y + 1].group = 'map';
                    this._posx = pos.x + 1;
                    this._posy = pos.y + 1;
                }
            }
            else { //Other là hàng 9 => self hàng 8
                if(self.node.x <= other.node.x){
                    this._MatrixEgg[pos.x - 1][pos.y + 1] = self.tag;
                    this._EggSheet[pos.x - 1][pos.y + 1] = cc.instantiate(this.EggSheet[self.tag]);
                    this._EggSheet[pos.x - 1][pos.y + 1].x = other.node.x - 17;
                    this._EggSheet[pos.x - 1][pos.y + 1].y = other.node.y + 35;
                    self.node.destroy();
                    this.node.addChild(this._EggSheet[pos.x - 1][pos.y + 1]);
                    this._EggSheet[pos.x - 1][pos.y + 1].runAction(this.RunAction());
                    this._EggSheet[pos.x - 1][pos.y + 1].group = 'map';
                    this._posx = pos.x - 1;
                    this._posy = pos.y + 1;
                }
                else {
                    if(pos.x < 8){
                        this._MatrixEgg[pos.x][pos.y + 1] = self.tag;
                        this._EggSheet[pos.x][pos.y + 1] = cc.instantiate(this.EggSheet[self.tag]);
                        this._EggSheet[pos.x][pos.y + 1].x = other.node.x + 17;
                        this._EggSheet[pos.x][pos.y + 1].y = other.node.y + 35;
                        self.node.destroy();
                        this.node.addChild(this._EggSheet[pos.x][pos.y + 1]);
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
      let vec = [cc.v2(0, -180), cc.v2(50, 0), cc.v2(75, -200)];
      return  cc.bezierTo(0.2, vec);
    },

    //Các hàm kiểm tra vị trí
    //Kiểm tra vị trí của trứng bị bắn trúng
    CheckNode(other){
        for(let j = 0; j < this._MatrixEgg[0].length; j++){
            for(let i = 0; i < 9; i ++){
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
      for(let i = 0; i < 9; i++) {
          if(this._MatrixEgg[i][row] !== 9)
              return i;
      }
    },
    //Kiểm tra trứng đang nằm ở hàng chẵn hay lẽ
    CheckLocation(i, j){ //i là điểm x của quả trứng, j là tọa độ x của quả trứng
        let deltaX = j - (i * 34 - 70);
        if(deltaX > 0)  // Lớn hơn là hàng 8, nhỏ hơn là hàng 9
            return 1;
        else
            return 0;
    },

    //Các hàm đệ quy
    //Kiểm tra hàng số 0 còn trứng hay ko
    CheckMap(){
        let check = false;
        for(let i = 0; i < 9; i++){
            if(this._MatrixEgg[i][0] !== 9){
                check = true;
                break;
            }
        }
        if(check === false){
            let Max = this._MatrixEgg[0].length;
            let Row = false;
            for(let j = 0; j < Max - 1; j++ ){
                if(Row === false){
                    let NodeRow = this.CheckRow(j + 1);
                    if(NodeRow === undefined)
                        continue;
                    Row = true;
                }
                for(let i = 0; i < 9; i++){
                    this._MatrixEgg[i][j] = this._MatrixEgg[i][j + 1];
                    if (this._MatrixEgg[i][j] !== 9) {
                        this._EggSheet[i][j] = cc.instantiate(this.EggSheet[this._MatrixEgg[i][j]]);
                        this._EggSheet[i][j].x = this._EggSheet[i][j + 1].x;
                        this._EggSheet[i][j].y = this._EggSheet[i][j + 1].y;
                        this._MatrixEgg[i][j + 1] = 9;
                        this._EggSheet[i][j + 1].destroy();
                        this.node.addChild(this._EggSheet[i][j]);
                        this._EggSheet[i][j].runAction(this.RunAction());
                        this._EggSheet[i][j].group = 'map';
                    }
                }
            }
            let NodeRow = this.CheckRow(Max - 2);
            let CheckRow = this.CheckLocation(NodeRow, this._EggSheet[NodeRow][Max - 2].x); // 1 là Hàng 8, 0 là Hàng 9
            for(let i = 0; i < 8 + CheckRow; i++){
                this._MatrixEgg[i][Max - 1] = Math.floor(Math.random()*this._RandomEgg);
                this._EggSheet[i][Max - 1] = cc.instantiate(this.EggSheet[this._MatrixEgg[i][Max - 1]]);
                this._EggSheet[i][Max - 1].x = i * 34 + Math.pow((-1), CheckRow) * 8.5 - 70;
                this._EggSheet[i][Max - 1].y = this._EggSheet[NodeRow][Max - 2].y + 35;
                this.node.addChild(this._EggSheet[i][Max - 1]);
                this._EggSheet[i][Max - 1].runAction(this.RunAction());
                this._EggSheet[i][Max - 1].group = 'map';
            }
            this.CheckMap();
        }
        this.Speed();
    },
    CheckEgg(){
        let startpath = [];
        let FallingEgg = [];
        let Max = this._MatrixEgg[0].length;
        for(let i = 0; i < 9; i++){
            if(Max < this._MatrixEgg[i].length)
                Max = this._MatrixEgg[i].length;
        }
        let temp = this.CheckRow(Max - 2);
        let toado = cc.v2(temp, Max - 2);
        let count = 0;
        startpath.push(toado);
        startpath = this.Falling(toado, startpath);
        for(let j = 0; j < Max - 1; j++){
            for(let i = 0; i < 9; i++){
                if(this._MatrixEgg[i][j] !== 9){
                    let check = false;
                    for(let temp = 0; temp < startpath.length; temp++){
                        if(i === startpath[temp].x && j === startpath[temp].y)
                            check = true;
                    }
                    if(check === false){
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
            this.node.addChild(FallingEgg[i]);
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
            if(toado.x + xa < 9 && toado.y + ya > -1 && toado.x + xa > -1
                && this._MatrixEgg[toado.x + xa][toado.y + ya] !== 9) {
                let compare = false;
                for(let i = 0; i < startpath.length; i++) {
                    if (startpath[i].x === toado.x + xa && startpath[i].y === toado.y + ya)
                        compare = true;
                }
                if(compare === false){
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
                    if(location === 1){ //1 là hàng 8, 0 là hàng 9
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
            if(toado.x + xa < 0 || toado.y + ya < 0 || toado.y + ya > this._MatrixEgg[temp].length - 1 || toado.x + xa > 8)
                continue;
            if(this._MatrixEgg[toado.x + xa][toado.y + ya] === tag) {
                let compare = false;
                for(let i = 0; i < startpath.length; i++){
                    if(startpath[i].x === toado.x + xa && startpath[i].y === toado.y + ya) {
                        compare = true;
                        break;
                    }
                }
                if(compare === false){
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
        this.WhirLeyEgg.x = 0;
        this.WhirLeyEgg.y = -36;
        if(Math.floor(Math.random()) === 0)
            this.WhirLey.node.x = 485;
        else
            this.WhirLey.node.x = 300;
        this.WhirLey.node.y = -62;
        this.WhirLeyEgg.group = 'Whirley';
        this.WhirLey.node.addChild(this.WhirLeyEgg);
        this.WhirLey.getComponent('Whirley').flying(Math.floor(Math.random()), this._RandomEgg);
    },
    WhirLeyOut(){
        this._RandomEgg++;
        this.WhirLeyEgg.destroy();
        this.WhirLey.node.y = -62;
        if(this._RandomEgg > 8){
            let flag = false;
            require('Kroney').instance.Flag(flag);
        }
    },
    WhirLeyContact(self, other){
        this.Score.string = '+' + 250;
        this.Score.node.x = self.node.x + 320;
        this.Score.node.y = self.node.y + 240;
        this.Score.node.active = true;
        this.Score.node.runAction(cc.moveBy(0.5, 0, 30));
        this._Score += 250;
        this.ImageScore.string = this._Score;
        this.scheduleOnce(()=>{
            this.Score.node.active = false;
        }, 0.5);
        if(this._Effect === true)
            cc.audioEngine.playEffect(this.Sound[0],false);

        //Break Egg
        let Break = cc.instantiate(this.Break[other.tag]);
        Break.x = self.node.x;
        Break.y = self.node.y;
        Break.getComponent("Break").Break();
        this.node.addChild(Break);
        self.node.destroy();
        other.node.destroy();
        this.WhirLey.node.y = -62;
    },

    //Gravity
    UpdateGravity(){
        this._Gravity++;
        for(let j = 0; j < this._MatrixEgg[0].length; j++){
            for(let i = 0; i < 9; i++){
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
            if(this._EggSheet[node][0].y > 180 && this._Update === false){
                this._Gravity = this._Gravity * 4;
                this._Update = true;
                check = true;
            }
            if(this._EggSheet[node][0].y < 100 && this._Update === true){
                this._Gravity = this._Gravity / 4;
                this._Update = false;
                check = true;
            }
            if(check === true){
                for(let j = 0; j < this._MatrixEgg[0].length; j++){
                    for(let i = 0; i < 9; i++){
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

    //Option Button
    ClickOption(){
        this._Board = !this._Board;
        if(this._Board === true){
            for(let j = 0; j < this._MatrixEgg[0].length; j++){
                for(let i = 0; i < 9; i++){
                    if(this._MatrixEgg[i][j] !== 9)
                        this._EggSheet[i][j].stopAllActions();
                }
            }
        } else {
            for(let j = 0; j < this._MatrixEgg[0].length; j++){
                for(let i = 0; i < 9; i++){
                    if(this._MatrixEgg[i][j] !== 9)
                        this._EggSheet[i][j].runAction(this.RunAction());
                }
            }
        }
    },
    SwitchEffect(key){
        this._Effect = key;
        require('OptionGP').instance.Switch(key);
        require('NewGame').instance.Switch(key);
        require('ExitButton').instance.Switch(key);
    },

    //Game Over
    GameOver(){
        let Count = 0;
        let PosY = this.CheckRow(this._MatrixEgg[0].length - 1);
        for(let j = 0; j < this._MatrixEgg[0].length - 1;j++){
            for(let i = 0; i < 9; i++){
                if(this._MatrixEgg[i][j] !== 9){
                    if(this._EggSheet[i][j].y < - 121)
                        this._EggSheet[i][j].getComponent('EggBullet').Invisible();
                }
            }
        }
        if(this._ContactRope === true){
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
                for(let i = 0; i < 9; i++){
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
                if((this._EggSheet[node][0].y - this._EggSheet[node][0].height/2) < this.Rope.node.y){
                    Count++;
                    if(Count === 3) {
                        for(let j = 0; j < this._MatrixEgg[0].length; j++){
                            for(let i = 0; i < 9; i++){
                                if(this._MatrixEgg[i][j] !== 9)
                                {
                                    this._EggSheet[i][j].stopAllActions();
                                }
                            }
                        }
                        this.Foot.node.y = this._EggSheet[PosY][this._MatrixEgg[0].length - 1].y + this.Foot.node.height / 2;
                        this.StopGame();
                    }
                } else{
                    this._ContactRope = true;
                    this.SteGgy.node.active = true;
                    this.Tank.node.active = true;
                    this.Terror[0].node.active = false;
                    this.Terror[1].node.active = false;
                    this._Gravity = temp;
                    for(let j = 0; j < this._MatrixEgg[0].length; j++){
                        for(let i = 0; i < 9; i++){
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
        let t = 0;
        this.FootJump(t);
        require('Kroney').instance.StopTiming();
        if(this._Effect === true)
            cc.audioEngine.playEffect(this.Sound[2], false);
        cc.audioEngine.stopMusic();
        //Phần này đúng
        this._CheckGameOver = true;
        this.scheduleOnce(()=>{
            this._Bullet[0].destroy();
            this._Bullet[1].destroy();
            this._Bullet[2].destroy();
            this.SteGgy.node.active = false;
            this.Tank.node.active = false;
            this.Terror[0].node.active = false;
            this.Terror[1].node.active = false;
            this.SlingShot.node.active = false;
            this.WhirLey.node.active = false;
            this.End.active = true;
        },0.3);
        this.scheduleOnce(()=>{
            cc.audioEngine.playEffect(this.Sound[3], false);
            this.End.getComponent("GameOver").Announcement();
            cc.audioEngine.playMusic(this.SoundEnd, false);
        }, 0.6);
    },
    FootJump(t) {
        let a = -this.Foot.node.y/Math.pow(0.25,2);
        let b = this.Foot.node.y;
        let temp = 0;
        this.schedule(()=>{
            this.Foot.node.y = a*Math.pow(t,2) + b;
            for (let j = this._MatrixEgg[0].length - 1; j > -1; j--) {
                for (let i = 0; i < 9; i++) {
                    if (this._MatrixEgg[i][j] !== 9) {
                        this._EggSheet[i][j].y += a*Math.pow(t,2) - a*Math.pow(t - 0.01,2);
                        if(this._EggSheet[i][j].y < -130){
                            this._EggBreak[temp] = cc.instantiate(this.Break[this._MatrixEgg[i][j]]);
                            this._MatrixEgg[i][j] = 9;
                            this._EggBreak[temp].x = this._EggSheet[i][j].x;
                            this._EggBreak[temp].y = -120;
                            this.node.addChild(this._EggBreak[temp]);
                            this._EggBreak[temp].getComponent("Break").BreakGameOver();
                            this._EggSheet[i][j].destroy();
                            temp++;
                        }
                    }
                }
            }
            t += 0.01;
        },0.01,25,0);
    }
});

