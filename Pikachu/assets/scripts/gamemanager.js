const gamemanager = cc.Class({
    extends: cc.Component,
    statics: {
        instance: null
    },
    properties: {
        tilesPrefab: [cc.Prefab],
        Gameplay: [cc.Prefab],
        linePrefab: cc.Prefab,
        Background: cc.Prefab,
        HowtoplayIMG: cc.Prefab,
        Countdown: cc.ProgressBar,
        Clicked: cc.AudioClip,
        Correct: cc.AudioClip,
        SoundTrack: cc.AudioClip,
        Wrong: cc.AudioClip,
        HoverMouse: cc.AudioClip,
        Repeat: cc.Button,
        Playbutton:cc.Button,
        Hintbutton: cc.Button,
        MusicButton: cc.Button,
        EffectButton: cc.Button,
        MusicGameButton: cc.Button,
        EffectGameButton: cc.Button,
        Howtoplay: cc.Button,
        scoreDisplay: cc.Label,
        hintDisplay: cc.Label,
        Level: cc.Label,
        Time: cc.Label,
        _howtoplay: null,
        _Effect: true,
        _Music: true,
        _key: false,
        _button: null,
        _bg: null,
        _prevTarget: null,
        _matrixtemp: [],
        _child: [],
        _bar: [],
        _matrix: [],
        _BGround: 0,
        _temp: [],
        _bx: 40,
        _by: 50,
        _score: 0,
        _level: 1,
        _matrixWidth: 6,
        _matrixHeight: 6,
        _play: 0,
        _hint: 3,
        _rd: null,
        _scorelv: 0,
        _HTP: 0,
        _min: 0,
        _sec: 0,
        _time:0,
    },
    onLoad() {
        gamemanager.instance = this;
        this._score = 0;
        this._bx = 40;
        this._by = 50;
        this._matrixWidth = 22;
        this._matrixHeight = 9;
        this._level = 1;
    },
    start() {
        cc.audioEngine.setMusicVolume(0.5);
        cc.audioEngine.setEffectsVolume(0.3);
        this._play = 0;
        this._bg = cc.instantiate(this.Background);
        this.node.addChild(this._bg);
        this.DisableNode();
        let playMS = 0;
        this.node.on("mouseenter", ()=>{
            if(playMS === 0 && this._Music === true){
                playMS = 1;
                cc.audioEngine.playMusic(this.SoundTrack, true);
            }
        });
        this.HoverButton();
        this.ButtonEvent();
    },
    update(dt) {
        if(this._play === 1) {
            this.Countdown.progress -= dt / 300;
            this.TimeCountDown(dt);
            if (this.Countdown.progress < 0) {
                alert("Game Over");
                location.reload();
            }
        }
    },
    Init(){
        if(this._Music === false)
        {
            this.MusicGameButton.normalColor = cc.color(255,0,0,255);
            cc.audioEngine.pauseMusic();
        }
        else
            {
            this.MusicGameButton.normalColor = cc.color(255,255,255,255);
            cc.audioEngine.playMusic(this.SoundTrack,true);
            }
        if(this._Effect === false)
        {
            this.EffectGameButton.normalColor = cc.color(255,0,0,255);
            cc.audioEngine.pauseMusic();
        }
        else
            this.EffectGameButton.normalColor = cc.color(255,255,255,255);
        this.Level.string = 'Level: ' + this._level;
        this._key = false;
        this.Countdown.progress = 1;
        let count = 0;
        let pic = 0;
        this._rd = Math.floor(Math.random() * 12);
        this._BGround = cc.instantiate(this.Gameplay[this._rd]);
        this._BGround.x = 0;
        this._BGround.y = 0;
        this._BGround.scale = 0.8;
        this.node.addChild(this._BGround);
        this._min = '4';
        this._sec = '59';
        for (let i = 0; i < this._matrixWidth + 2; i++) {
            this._matrix[i] = [];
            this._child[i] = [];
            for (let j = 0; j < this._matrixHeight + 2; j++) {
                if (i === 0 || i === (1 + this._matrixWidth) || j === 0 || j === (1 + this._matrixHeight))
                    this._matrix[i][j] = 50;
                else{
                    this._matrix[i][j] = pic;
                    count++;
                    if(count === 6){
                        pic++;
                        count = 0;
                    }
                }
            }
        }
        //Trộn
        this.Shuffle();
        //Khoi tao cac bieu tuong
        for (let i = 1; i < this._matrixWidth + 1; i++) {
            for (let j = 1; j < this._matrixHeight + 1; j++) {
                this.Eventmouse(i,j);
            }
        }
    },
    Eventmouse(i,j){
        this._child[i][j] = cc.instantiate(this.tilesPrefab[this._matrix[i][j]]);
        this._child[i][j].x = (i - this._matrixWidth / 2) * this._bx;
        this._child[i][j].y = (j - this._matrixHeight / 2) * this._by - 50;
        this.node.addChild(this._child[i][j]);
        this._child[i][j].mx = i;
        this._child[i][j].my = j;
        //Khoi tao su kien khi nhan
        this._child[i][j].on("mousedown", ((event) => {
                const self = this;
                self._key = !self._key;
                if (self._key) {
                    self._temp[0] = cc.v2(event.target.mx, event.target.my);
                    if(this._Effect === true)
                        cc.audioEngine.playEffect(this.Clicked, false);
                    event.target.color = cc.color(254, 153, 153, 255);
                } else {
                    self._temp[1] = cc.v2(event.target.mx, event.target.my);
                    event.target.color = cc.color(254, 153, 153, 255);
                    if(this._Effect === true)
                        cc.audioEngine.playEffect(this.Clicked, false);
                    let check = 0;
                    //Kiem tra xem 2 lan nhan co trung nhau hay khong
                    if (self._temp[1].x === self._temp[0].x && self._temp[1].y === self._temp[0].y) {
                        check = 1;
                    }
                    //Kiem tra xem 2 hinh da chon co giong nhau hay khong
                    if (self._matrix[self._temp[1].x][self._temp[1].y] === self._matrix[self._temp[0].x][self._temp[0].y]) {
                        if (check === 0) {
                            let path = [];
                            let path2 = [];
                            let pathMin = null;
                            //Tim duong ngan nhat
                            for (let a = 0; a < 4; a++) {
                                path[a] = self.find(self._temp[0], self._temp[1], a);
                                path2[a] = self.find2(self._temp[0], self._temp[1], a);
                                if (path[a].length !== 0)
                                    pathMin = path[a];
                                if (path[a].length !== 0)
                                    pathMin = path[a];
                            }
                            for (let a = 0; a < 4; a++) {
                                if (path[a].length !== 0) {
                                    if (pathMin.length >= path[a].length)
                                        pathMin = path[a];
                                }
                                if (path2[a].length !== 0) {
                                    if (pathMin.length >= path2[a].length)
                                        pathMin = path2[a];
                                }
                            }
                            if (pathMin === null) {
                                this.RemoveColor();
                            } else if (pathMin.length > 0) {
                                let listLines = [];
                                this.Drawline(pathMin, listLines);
                                //Xoa hinh
                                const self = this;
                                const removePos0 = this._temp[0].clone();
                                const removePos1 = this._temp[1].clone();
                                this.scheduleOnce(() => {
                                    for (let i = 0; i < listLines.length; i++) {
                                        listLines[i].destroy();
                                    }
                                    this._matrix[removePos0.x][removePos0.y] = 50;
                                    this._matrix[removePos1.x][removePos1.y] = 50;
                                    self._child[removePos0.x][removePos0.y].destroy();
                                    self._child[removePos1.x][removePos1.y].destroy();
                                    if(this._Effect === true)
                                        cc.audioEngine.playEffect(this.Correct, false);
                                    switch(this._level){
                                        case 1:
                                            break;
                                        case 2:
                                            self.Editmap(removePos0, removePos1);
                                            break;
                                        case 3:
                                            self.Editmap1(removePos0, removePos1);
                                            break;
                                        case 4:
                                            self.Editmap2(removePos0, removePos1);
                                            break;
                                        case 5:
                                            self.Editmap3(removePos0, removePos1);
                                            break;
                                        case 6:
                                            self.Editmap4(removePos0, removePos1);
                                            break;
                                        case 7:
                                            self.Editmap5(removePos0, removePos1);
                                            break;
                                        case 8:
                                            self.Editmap6(removePos0, removePos1);
                                            break;
                                        case 9:
                                            self.Editmap7(removePos0, removePos1);
                                            break;
                                        case 10:
                                            self.Editmap8(removePos0, removePos1);
                                            break;
                                        case 11:
                                            self.Editmap9(removePos0, removePos1);
                                            break;
                                        case 12:
                                            self.Editmap10(removePos0, removePos1);
                                            break;
                                    }
                                    let replay = self.checkmap();
                                    if (replay === 0) {
                                        this.scheduleOnce(()=>{
                                            this.CountSprite();
                                            if(this._matrixtemp.length < 5){
                                                this._BGround.destroy();
                                                alert("Next Level");
                                                this._level++;
                                                this._scorelv = this._score;
                                                this._hint++;
                                                this.hintDisplay.string = this._hint;
                                                this.Init();
                                            }
                                            else
                                                this.ShuffleMap();
                                        }, 0.5);
                                    }
                                    this._score += 1;
                                    this.scoreDisplay.string = 'Score: ' +  this._score;
                                }, 0.2);
                            }
                        } else {
                            this.RemoveColor();
                        }
                    } else {
                        this.RemoveColor();
                    }
                }
            })
        );
    },
    RemoveColor(){
        if(this._Effect === true)
            cc.audioEngine.playEffect(this.Wrong, false);
        this._child[this._temp[1].x][this._temp[1].y].color = cc.color(255, 255, 255, 255);
        this._child[this._temp[0].x][this._temp[0].y].color = cc.color(255, 255, 255, 255);
    },
    //Trộn map
    Shuffle(){
        for(let map = 0; map < this._level; map++){
            for(let i = 1; i < this._matrixWidth + 1; i++ ){
                let temp = 0;
                for (let j = 1; j < this._matrixHeight + 1; j++){
                    temp = this._matrix[i][j];
                    let a = Math.floor(Math.random() * this._matrixWidth) + 1;
                    let b = Math.floor(Math.random() * this._matrixHeight) + 1;
                    this._matrix[i][j] = this._matrix[a][b];
                    this._matrix[a][b] = temp;
                }
            }
        }
    },
    //Cac ham tim duong
    find(toado0, toado1, a) {
        for (let i = 0; i < 4; i++) {
            let startPath = [];
            startPath.push(toado0);
            let t = i + a;
            if(t > 3)
                t = Math.abs(t - 4);
            const path = this.finding(toado0, toado1, t, 0, startPath , a);
            if (path.length !== 0)
                return path;
        }
        return [];
    },
    find2(toado0, toado1, a) {
        for (let i = 0; i < 4; i++) {
            let startPath = [];
            startPath.push(toado0);
            let t = i + a;
            if(t > 3)
                t = Math.abs(t - 4);
            const path = this.finding2(toado0, toado1, t, 0, startPath , a);
            if (path.length !== 0)
                return path;
        }
        return [];
    },
    finding(toado0, toado1, huong, tonghuongdi, paths, a) {
        if (tonghuongdi > 2)
            return [];
        let xa = 0;
        let ya = 0;
        switch (huong) {
            case 0:
                xa--;
                break;
            case 1:
                ya--;
                break;
            case 2:
                xa++;
                break;
            case 3:
                ya++;
                break;
        }
        if (toado0.x + xa < 0 || toado0.x + xa >= this._matrix.length)
            return [];
        if (toado0.y + ya < 0 || toado0.y + ya >= this._matrix[0].length)
            return [];
        if (toado0.x + xa === toado1.x && toado0.y + ya === toado1.y) {
            let duongdi = [...paths];
            duongdi.push(cc.v2(toado0.x + xa, toado0.y + ya));
            return duongdi;
        }
        if (this._matrix[toado0.x + xa][toado0.y + ya] === 50) {
            for (let i = 0; i < 4; i++) {
                let t = i + a;
                if(t > 3)
                    t = Math.abs(t - 4);
                if (huong === t) {
                    let duongdi = [...paths];
                    duongdi.push(cc.v2(toado0.x + xa, toado0.y + ya));
                    const path = this.finding(cc.v2(toado0.x + xa, toado0.y + ya), toado1, t, tonghuongdi, duongdi, a);
                    if (path.length > 0)
                        return path;
                } else if (huong % 2 !== t % 2) {
                    let duongdi = [...paths];
                    duongdi.push(cc.v2(toado0.x + xa, toado0.y + ya));
                    const path = this.finding(cc.v2(toado0.x + xa, toado0.y + ya), toado1, t, tonghuongdi + 1, duongdi, a);
                    if (path.length > 0)
                        return path;
                }
            }
        }
        return [];
    },
    finding2(toado0, toado1, huong, tonghuongdi, paths, a) {
        if (tonghuongdi > 1)
            return [];
        let xa = 0;
        let ya = 0;
        switch (huong) {
            case 0:
                xa--;
                break;
            case 1:
                ya--;
                break;
            case 2:
                xa++;
                break;
            case 3:
                ya++;
                break;
        }
        if (toado0.x + xa < 0 || toado0.x + xa >= this._matrix.length)
            return [];
        if (toado0.y + ya < 0 || toado0.y + ya >= this._matrix[0].length)
            return [];
        if (toado0.x + xa === toado1.x && toado0.y + ya === toado1.y) {
            let duongdi = [...paths];
            duongdi.push(cc.v2(toado0.x + xa, toado0.y + ya));
            return duongdi;
        }
        if (this._matrix[toado0.x + xa][toado0.y + ya] === 50) {
            for (let i = 0; i < 4; i++) {
                let t = i + a;
                if(t > 3)
                    t = Math.abs(t - 4);
                if (huong === t) {
                    let duongdi = [...paths];
                    duongdi.push(cc.v2(toado0.x + xa, toado0.y + ya));
                    const path = this.finding2(cc.v2(toado0.x + xa, toado0.y + ya), toado1, t, tonghuongdi, duongdi, a);
                    if (path.length > 0)
                        return path;
                } else if (huong % 2 !== t % 2) {
                    let duongdi = [...paths];
                    duongdi.push(cc.v2(toado0.x + xa, toado0.y + ya));
                    const path = this.finding2(cc.v2(toado0.x + xa, toado0.y + ya), toado1, t, tonghuongdi + 1, duongdi, a);
                    if (path.length > 0)
                        return path;
                }
            }
        }
        return [];
    },
    //Kiem tra xem con duong hay khong
    checkmap() {
        let path = [];
        let tempv2 = [];
        for (let i = 1; i < this._matrixWidth + 1; i++) {
            for (let j = 1; j < this._matrixHeight + 1; j++) {
                if (this._matrix[i][j] !== 50)
                {
                    for (let temp1 = 1; temp1 < this._matrixWidth + 1; temp1++) {
                        for (let temp2 = 1; temp2 < this._matrixHeight + 1; temp2++) {
                            if (i === temp1 && j === temp2)
                                continue;
                            if (this._matrix[i][j] === this._matrix[temp1][temp2]) {
                                tempv2[0] = cc.v2(i, j);
                                tempv2[1] = cc.v2(temp1, temp2);
                                path = this.find(tempv2[0], tempv2[1], 0);
                                if(path.length > 0)
                                    return path.length;
                            }
                        }
                    }
                }
            }
        }
        return 0;
    },
    //Trộn map khi không còn đường
    CountSprite(){
        let count = 0;
        this._matrixtemp = [];
        for(let i = 1; i < this._matrixWidth + 1; i++){
          for(let j = 1; j < this._matrixHeight + 1; j++){
              if(this._matrix[i][j] !== 50)
              {
                  this._matrixtemp[count] = this._matrix[i][j];
                  count++;
              }
          }
      }
    },
    ShuffleArray(){
      for(let i = 0; i < this._matrixtemp.length ; i++)
        {
            let temp = this._matrixtemp[0];
            let j = Math.floor(Math.random() * this._matrixtemp.length);
            this._matrixtemp[0] = this._matrixtemp[j];
            this._matrixtemp[j] = temp;
        }
    },
    ShuffleMap(){
        let count = 0;
        this.ShuffleArray();
        for(let i = 1; i < this._matrixWidth + 1; i++){
            for(let j = 1; j< this._matrixHeight + 1; j++){
                if(this._matrix[i][j] !== 50)
                {
                    this._matrix[i][j] = this._matrixtemp[count];
                    count++;
                    this._child[i][j].destroy();
                    this._child[i][j] = cc.instantiate(this.tilesPrefab[this._matrix[i][j]]);
                    this._child[i][j].x = (i - this._matrixWidth / 2) * this._bx;
                    this._child[i][j].y = (j - this._matrixHeight / 2) * this._by - 50;
                    this.node.addChild(this._child[i][j]);
                    this._child[i][j].mx = i;
                    this._child[i][j].my = j;
                    //Khoi tao su kien khi nhan
                    this._child[i][j].on("mousedown", ((event) => {
                            const self = this;
                            self._key = !self._key;
                            if (self._key) {
                                self._temp[0] = cc.v2(event.target.mx, event.target.my);
                                if(this._Effect === true)
                                    cc.audioEngine.playEffect(this.Clicked, false);
                                event.target.color = cc.color(254, 153, 153, 255);
                            } else {
                                self._temp[1] = cc.v2(event.target.mx, event.target.my);
                                event.target.color = cc.color(254, 153, 153, 255);
                                if(this._Effect === true)
                                    cc.audioEngine.playEffect(this.Clicked, false);
                                let check = 0;

                                //Kiem tra xem 2 lan nhan co trung nhau hay khong
                                if (self._temp[1].x === self._temp[0].x && self._temp[1].y === self._temp[0].y) {
                                    check = 1;
                                }

                                //Kiem tra xem 2 hinh da chon co giong nhau hay khong
                                if (self._matrix[self._temp[1].x][self._temp[1].y] === self._matrix[self._temp[0].x][self._temp[0].y]) {
                                    if (check === 0) {

                                        let path = [];
                                        let path2 = [];
                                        let pathMin = null;

                                        //Tim duong ngan nhat
                                        for (let a = 0; a < 4; a++) {
                                            path[a] = self.find(self._temp[0], self._temp[1], a);
                                            path2[a] = self.find2(self._temp[0], self._temp[1], a);
                                            if (path[a].length !== 0)
                                                pathMin = path[a];
                                            if (path[a].length !== 0)
                                                pathMin = path[a];
                                        }

                                        for (let a = 0; a < 4; a++) {
                                            if (path[a].length !== 0) {
                                                if (pathMin.length >= path[a].length)
                                                    pathMin = path[a];
                                            }
                                            if (path2[a].length !== 0) {
                                                if (pathMin.length >= path2[a].length)
                                                    pathMin = path2[a];
                                            }
                                        }

                                        if (pathMin === null) {
                                            this.RemoveColor();
                                        } else if (pathMin.length > 0) {

                                            let listLines = [];
                                            this.Drawline(pathMin, listLines);
                                            //Xoa hinh
                                            const self = this;
                                            const removePos0 = this._temp[0].clone();
                                            const removePos1 = this._temp[1].clone();
                                            this.scheduleOnce(() => {
                                                for (let i = 0; i < listLines.length; i++) {
                                                    listLines[i].destroy();
                                                }
                                                this._matrix[removePos0.x][removePos0.y] = 50;
                                                this._matrix[removePos1.x][removePos1.y] = 50;
                                                self._child[removePos0.x][removePos0.y].destroy();
                                                self._child[removePos1.x][removePos1.y].destroy();
                                                if(this._Effect === true)
                                                    cc.audioEngine.playEffect(this.Correct, false);
                                                let level = (this._level - 1) % 5;
                                                cc.log(JSON.stringify(level));
                                                switch(level){
                                                    case 0:
                                                        break;
                                                    case 1:
                                                        self.Editmap(removePos0, removePos1);
                                                        break;
                                                    case 2:
                                                        self.Editmap1(removePos0, removePos1);
                                                        break;
                                                    case 3:
                                                        self.Editmap2(removePos0, removePos1);
                                                        break;
                                                    case 4:
                                                        self.Editmap3(removePos0, removePos1);
                                                        break;
                                                }
                                                let replay = self.checkmap();
                                                if (replay === 0) {
                                                    this.scheduleOnce(()=>{
                                                        this.CountSprite();
                                                        if(this._matrixtemp.length < 5){
                                                            this._BGround.destroy();
                                                            alert("Next Level");
                                                            this._level++;
                                                            this._hint++;
                                                            this.hintDisplay.string = this._hint;
                                                            this.Init();
                                                        }
                                                        else
                                                            this.ShuffleMap();
                                                    }, 0.5);
                                                }
                                                this._score += 1;
                                                this.scoreDisplay.string = 'Score: ' +  this._score;
                                            }, 0.2);
                                        }
                                    } else {
                                        this.RemoveColor();
                                    }
                                } else {
                                    this.RemoveColor();
                                }
                            }
                        })
                    );
                }
            }
        }
    },
    //Gợi Ý
    HINT(){
        if(this._Effect === true)
            cc.audioEngine.playEffect(this.Clicked, false);
        this._hint--;
        let path = [];
        let tempv2 = [];
        let key = 0;
        for (let i = 1; i < this._matrixWidth + 1; i++) {
            for (let j = 1; j < this._matrixHeight + 1; j++) {
                if (this._matrix[i][j] !== 50) {
                    for (let temp1 = 1; temp1 < this._matrixWidth + 1; temp1++) {
                        for (let temp2 = 1; temp2 < this._matrixHeight + 1; temp2++) {
                            if (i === temp1 && j === temp2)
                                continue;
                            if (this._matrix[i][j] === this._matrix[temp1][temp2]) {
                                tempv2[0] = cc.v2(i, j);
                                tempv2[1] = cc.v2(temp1, temp2);
                                path = this.find(tempv2[0], tempv2[1], 0);
                                if(path.length > 0 && key === 0)
                                {
                                    key = 1;
                                    this.schedule(()=>{
                                        if(this._matrix[i][j] !== 50 && this._matrix[temp1][temp2] !== 50) {
                                            this._child[i][j].color = cc.color(254, 153, 153, 255);
                                            this._child[temp1][temp2].color = cc.color(254, 153, 153, 255);
                                            this.scheduleOnce(() => {
                                                if (this._matrix[i][j] !== 50 && this._matrix[temp1][temp2] !== 50) {
                                                    this._child[i][j].color = cc.color(255, 255, 255, 255);
                                                    this._child[temp1][temp2].color = cc.color(255, 255, 255, 255);
                                                }
                                            }, 0.5);
                                        }
                                    }, 1 , 5, 1);
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    //Chỉnh sửa map
    Editmap(toado0, toado1) {
        let t = 0;
        let temp1 = [];
        for(let i = 1; i < this._matrixWidth + 1; i++)
        {
            if(this._matrix[i][toado0.y] !== 50)
            {
                temp1[t] = this._matrix[i][toado0.y];
                t++;
                this._child[i][toado0.y].destroy();
                this._matrix[i][toado0.y] = 50;
            }
        }
        t = 0;
        for(let i = 1; i < temp1.length + 1 ; i++){
            this._matrix[i][toado0.y] = temp1[t];
            t++;
            this.Eventmouse(i,toado0.y);
        }
        let temp2 = [];
        t = 0;
        for(let i = 1; i < this._matrixWidth + 1; i++)
        {
            if(this._matrix[i][toado1.y] !== 50)
            {
                temp2[t] = this._matrix[i][toado1.y];
                t++;
                this._child[i][toado1.y].destroy();
                this._matrix[i][toado1.y] = 50;
            }
        }
        t = 0;
        for(let i = 1; i < temp2.length + 1 ; i++){
            this._matrix[i][toado1.y] = temp2[t];
            t++;
            this.Eventmouse(i, toado1.y);
        }
    },  //LV2 Dịch sang trái
    Editmap1(toado0, toado1) {
        let t = 0;
        let temp1 = [];
        for(let i = 1; i < this._matrixHeight + 1; i++)
        {
            if(this._matrix[toado0.x][i] !== 50)
            {
                temp1[t] = this._matrix[toado0.x][i];
                t++;
                this._child[toado0.x][i].destroy();
                this._matrix[toado0.x][i] = 50;
            }
        }
        t = 0;
        for(let i = 1; i < temp1.length + 1 ; i++){
            this._matrix[toado0.x][i] = temp1[t];
            t++;
            this.Eventmouse(toado0.x,i);
        }
        let temp2 = [];
        t = 0;
        for(let i = 1; i < this._matrixHeight + 1; i++)
        {
            if(this._matrix[toado1.x][i] !== 50)
            {
                temp2[t] = this._matrix[toado1.x][i];
                t++;
                this._child[toado1.x][i].destroy();
                this._matrix[toado1.x][i] = 50;
            }
        }
        t = 0;
        for(let i = 1; i < temp2.length + 1 ; i++){
            this._matrix[toado1.x][i] = temp2[t];
            t++;
            this.Eventmouse(toado1.x, i);
        }
    }, //LV3 Dịch xuống dưới
    Editmap2(toado0, toado1) {
        let t = 0;
        let temp1 = [];
        for(let i = 1; i < this._matrixWidth + 1; i++)
        {
            if(this._matrix[i][toado0.y] !== 50)
            {
                temp1[t] = this._matrix[i][toado0.y];
                t++;
                this._child[i][toado0.y].destroy();
                this._matrix[i][toado0.y] = 50;
            }
        }
        t = temp1.length - 1;
        for(let i = this._matrixWidth; i > this._matrixWidth - temp1.length ; i--){
            this._matrix[i][toado0.y] = temp1[t];
            t--;
            this.Eventmouse(i, toado0.y);
        }
        let temp2 = [];
        t = 0;
        for(let i = 1; i < this._matrixWidth + 1; i++)
        {
            if(this._matrix[i][toado1.y] !== 50)
            {
                temp2[t] = this._matrix[i][toado1.y];
                t++;
                this._child[i][toado1.y].destroy();
                this._matrix[i][toado1.y] = 50;
            }
        }
        t = temp2.length - 1;
        for(let i = this._matrixWidth; i > this._matrixWidth - temp2.length ; i--){
            this._matrix[i][toado1.y] = temp2[t];
            t--;
            this.Eventmouse(i, toado1.y);
        }
    }, //LV4 Dịch qua phải
    Editmap3(toado0, toado1) {
        let t = 0;
        let temp1 = [];
        for(let i = 1; i < this._matrixHeight + 1; i++)
        {
            if(this._matrix[toado0.x][i] !== 50)
            {
                temp1[t] = this._matrix[toado0.x][i];
                t++;
                this._child[toado0.x][i].destroy();
                this._matrix[toado0.x][i] = 50;
            }
        }
        t = temp1.length - 1;
        for(let i = this._matrixHeight; i > this._matrixHeight - temp1.length ; i--){
            this._matrix[toado0.x][i] = temp1[t];
            t--;
            this.Eventmouse(toado0.x,i);
        }
        let temp2 = [];
        t = 0;
        for(let i = 1; i < this._matrixHeight + 1; i++)
        {
            if(this._matrix[toado1.x][i] !== 50)
            {
                temp2[t] = this._matrix[toado1.x][i];
                t++;
                this._child[toado1.x][i].destroy();
                this._matrix[toado1.x][i] = 50;
            }
        }
        t = temp2.length - 1;
        for(let i = this._matrixHeight; i > this._matrixHeight - temp2.length ; i--){
            this._matrix[toado1.x][i] = temp2[t];
            t--;
            this.Eventmouse(toado1.x, i);
        }
    }, //LV5 Dịch lên trên
    Editmap4(toado0, toado1){
        let t = 0;
        let temp1 = [];
        for(let i = 1; i < this._matrixWidth / 2 + 1; i++)
        {
            if(this._matrix[i][toado0.y] !== 50)
            {
                temp1[t] = this._matrix[i][toado0.y];
                t++;
                this._child[i][toado0.y].destroy();
                this._matrix[i][toado0.y] = 50;
            }
        }
        t = 0;
        for(let i = 1; i < temp1.length + 1 ; i++){
            this._matrix[i][toado0.y] = temp1[t];
            t++;
            this.Eventmouse(i,toado0.y);
        }
        let temp2 = [];
        t = 0;
        for(let i = 1; i < this._matrixWidth / 2 + 1; i++)
        {
            if(this._matrix[i][toado1.y] !== 50)
            {
                temp2[t] = this._matrix[i][toado1.y];
                t++;
                this._child[i][toado1.y].destroy();
                this._matrix[i][toado1.y] = 50;
            }
        }
        t = 0;
        for(let i = 1; i < temp2.length + 1 ; i++){
            this._matrix[i][toado1.y] = temp2[t];
            t++;
            this.Eventmouse(i, toado1.y);
        }


        temp1 = [];
        temp2 = [];
        t = 0;
        for(let i = this._matrixWidth / 2 + 1; i < this._matrixWidth + 1; i++)
        {
            if(this._matrix[i][toado0.y] !== 50)
            {
                temp1[t] = this._matrix[i][toado0.y];
                t++;
                this._child[i][toado0.y].destroy();
                this._matrix[i][toado0.y] = 50;
            }
        }
        t = temp1.length - 1;
        for(let i = this._matrixWidth; i > this._matrixWidth - temp1.length ; i--){
            this._matrix[i][toado0.y] = temp1[t];
            t--;
            this.Eventmouse(i, toado0.y);
        }
        t = 0;
        for(let i = this._matrixWidth / 2 + 1; i < this._matrixWidth + 1; i++)
        {
            if(this._matrix[i][toado1.y] !== 50)
            {
                temp2[t] = this._matrix[i][toado1.y];
                t++;
                this._child[i][toado1.y].destroy();
                this._matrix[i][toado1.y] = 50;
            }
        }
        t = temp2.length - 1;
        for(let i = this._matrixWidth; i > this._matrixWidth - temp2.length ; i--){
            this._matrix[i][toado1.y] = temp2[t];
            t--;
            this.Eventmouse(i, toado1.y);
        }
    },  //LV6 Dịch qua 2 bên
    Editmap5(toado0, toado1){
        let t = 0;
        let temp1 = [];
        for(let i = 1; i < this._matrixHeight / 2 + 1; i++)
        {
            if(this._matrix[toado0.x][i] !== 50)
            {
                temp1[t] = this._matrix[toado0.x][i];
                t++;
                this._child[toado0.x][i].destroy();
                this._matrix[toado0.x][i] = 50;
            }
        }
        t = 0;
        for(let i = 1; i < temp1.length + 1 ; i++){
            this._matrix[toado0.x][i] = temp1[t];
            t++;
            this.Eventmouse(toado0.x,i);
        }
        let temp2 = [];
        t = 0;
        for(let i = 1; i < this._matrixHeight / 2 + 1; i++)
        {
            if(this._matrix[toado1.x][i] !== 50)
            {
                temp2[t] = this._matrix[toado1.x][i];
                t++;
                this._child[toado1.x][i].destroy();
                this._matrix[toado1.x][i] = 50;
            }
        }
        t = 0;
        for(let i = 1; i < temp2.length + 1 ; i++){
            this._matrix[toado1.x][i] = temp2[t];
            t++;
            this.Eventmouse(toado1.x, i);
        }
        temp1 = [];
        temp2 = [];
        t = 0;
        for(let i = this._matrixHeight / 2 + 1; i < this._matrixHeight + 1; i++)
        {
            if(this._matrix[toado0.x][i] !== 50)
            {
                temp1[t] = this._matrix[toado0.x][i];
                t++;
                this._child[toado0.x][i].destroy();
                this._matrix[toado0.x][i] = 50;
            }
        }
        t = temp1.length - 1;
        for(let i = this._matrixHeight; i > this._matrixHeight - temp1.length ; i--){
            this._matrix[toado0.x][i] = temp1[t];
            t--;
            this.Eventmouse(toado0.x, i);
        }
        t = 0;
        for(let i = this._matrixHeight / 2 + 1; i < this._matrixHeight + 1; i++)
        {
            if(this._matrix[toado1.x][i] !== 50)
            {
                temp2[t] = this._matrix[toado1.x][i];
                t++;
                this._child[toado1.x][i].destroy();
                this._matrix[toado1.x][i] = 50;
            }
        }
        t = temp2.length - 1;
        for(let i = this._matrixHeight; i > this._matrixHeight - temp2.length ; i--){
            this._matrix[toado1.x][i] = temp2[t];
            t--;
            this.Eventmouse(toado1.x, i);
        }
    },  //LV7 Trên dịch lên dưới dịch xuống
    Editmap6(toado0, toado1){
        let t = 0;
        let temp1 = [];
        for(let i = 1; i < this._matrixWidth / 2 + 1; i++)
        {
            if(this._matrix[i][toado0.y] !== 50)
            {
                temp1[t] = this._matrix[i][toado0.y];
                t++;
                this._child[i][toado0.y].destroy();
                this._matrix[i][toado0.y] = 50;
            }
        }
        t = temp1.length - 1;
        for(let i = this._matrixWidth / 2 ; i > this._matrixWidth / 2 - temp1.length ; i--){
            this._matrix[i][toado0.y] = temp1[t];
            t--;
            this.Eventmouse(i,toado0.y);
        }
        let temp2 = [];
        t = 0;
        for(let i = 1; i < this._matrixWidth / 2 + 1; i++)
        {
            if(this._matrix[i][toado1.y] !== 50)
            {
                temp2[t] = this._matrix[i][toado1.y];
                t++;
                this._child[i][toado1.y].destroy();
                this._matrix[i][toado1.y] = 50;
            }
        }
        t = temp2.length - 1;
        for(let i = this._matrixWidth / 2; i > this._matrixWidth / 2 - temp2.length ; i--){
            this._matrix[i][toado1.y] = temp2[t];
            t--;
            this.Eventmouse(i, toado1.y);
        }
        temp1 = [];
        temp2 = [];
        t = 0;
        for(let i = this._matrixWidth / 2 + 1; i < this._matrixWidth + 1; i++)
        {
            if(this._matrix[i][toado0.y] !== 50)
            {
                temp1[t] = this._matrix[i][toado0.y];
                t++;
                this._child[i][toado0.y].destroy();
                this._matrix[i][toado0.y] = 50;
            }
        }
        t = 0;
        for(let i = this._matrixWidth / 2 + 1; i < this._matrixWidth / 2 + 1 + temp1.length ; i++){
            this._matrix[i][toado0.y] = temp1[t];
            t++;
            this.Eventmouse(i, toado0.y);
        }
        t = 0;
        for(let i = this._matrixWidth / 2 + 1; i < this._matrixWidth + 1; i++)
        {
            if(this._matrix[i][toado1.y] !== 50)
            {
                temp2[t] = this._matrix[i][toado1.y];
                t++;
                this._child[i][toado1.y].destroy();
                this._matrix[i][toado1.y] = 50;
            }
        }
        t = 0;
        for(let i = this._matrixWidth / 2 + 1; i < this._matrixWidth / 2 + 1 + temp2.length ; i++){
            this._matrix[i][toado1.y] = temp2[t];
            t++;
            this.Eventmouse(i, toado1.y);
        }
    },  //LV8 Dịch vào trong theo chiều ngang
    Editmap7(toado0, toado1){
        let t = 0;
        let temp1 = [];
        for(let i = 1; i < this._matrixHeight / 2 + 1; i++)
        {
            if(this._matrix[toado0.x][i] !== 50)
            {
                temp1[t] = this._matrix[toado0.x][i];
                t++;
                this._child[toado0.x][i].destroy();
                this._matrix[toado0.x][i] = 50;
            }
        }
        t = temp1.length - 1;
        for(let i = this._matrixHeight / 2 ; i > this._matrixHeight / 2 - temp1.length ; i--){
            this._matrix[toado0.x][i] = temp1[t];
            t--;
            this.Eventmouse(toado0.x,i);
        }
        let temp2 = [];
        t = 0;
        for(let i = 1; i < this._matrixHeight / 2 + 1; i++)
        {
            if(this._matrix[toado1.x][i] !== 50)
            {
                temp2[t] = this._matrix[toado1.x][i];
                t++;
                this._child[toado1.x][i].destroy();
                this._matrix[toado1.x][i] = 50;
            }
        }
        t = temp2.length - 1;
        for(let i = this._matrixHeight / 2; i > this._matrixHeight / 2 - temp2.length ; i--){
            this._matrix[toado1.x][i] = temp2[t];
            t--;
            this.Eventmouse(toado1.x, i);
        }
        temp1 = [];
        temp2 = [];
        t = 0;
        for(let i = this._matrixHeight / 2 + 1; i < this._matrixHeight + 1; i++)
        {
            if(this._matrix[toado0.x][i] !== 50)
            {
                temp1[t] = this._matrix[toado0.x][i];
                t++;
                this._child[toado0.x][i].destroy();
                this._matrix[toado0.x][i] = 50;
            }
        }
        t = 0;
        for(let i = this._matrixHeight / 2 + 1; i < this._matrixHeight / 2 + 1 + temp1.length ; i++){
            this._matrix[toado0.x][i] = temp1[t];
            t++;
            this.Eventmouse(toado0.x, i);
        }
        t = 0;
        for(let i = this._matrixHeight / 2 + 1; i < this._matrixHeight + 1; i++)
        {
            if(this._matrix[toado1.x][i] !== 50)
            {
                temp2[t] = this._matrix[toado1.x][i];
                t++;
                this._child[toado1.x][i].destroy();
                this._matrix[toado1.x][i] = 50;
            }
        }
        t = 0;
        for(let i = this._matrixHeight / 2 + 1; i < this._matrixHeight / 2 + 1 + temp2.length ; i++){
            this._matrix[toado1.x][i] = temp2[t];
            t++;
            this.Eventmouse(toado1.x, i);
        }
    },  //LV9 Dịch vào trong theo chiều dọc
    Editmap8(toado0, toado1){
        this.Editmap4(toado0, toado1);
        for(let j = 1; j < this._matrixWidth + 1 ; j++){
            let t = 0;
            let temp1 = [];
            for(let i = 1; i < this._matrixHeight / 2 + 1; i++)
            {
                if(this._matrix[j][i] !== 50)
                {
                    temp1[t] = this._matrix[j][i];
                    t++;
                    this._child[j][i].destroy();
                    this._matrix[j][i] = 50;
                }
            }
            t = 0;
            for(let i = 1; i < temp1.length + 1 ; i++){
                this._matrix[j][i] = temp1[t];
                t++;
                this.Eventmouse(j,i);
            }
            temp1 = [];
            t = 0;
            for(let i = this._matrixHeight / 2 + 1; i < this._matrixHeight + 1; i++)
            {
                if(this._matrix[j][i] !== 50)
                {
                    temp1[t] = this._matrix[j][i];
                    t++;
                    this._child[j][i].destroy();
                    this._matrix[j][i] = 50;
                }
            }
            t = temp1.length - 1;
            for(let i = this._matrixHeight; i > this._matrixHeight - temp1.length ; i--){
                this._matrix[j][i] = temp1[t];
                t--;
                this.Eventmouse(j, i);
            }
        }
    },  //LV10 Dịch ra 4 góc
    Editmap9(toado0, toado1){
        this.Editmap6(toado0, toado1);
        for(let j = 1; j < this._matrixWidth + 1; j++){
            let t = 0;
            let temp1 = [];
            for(let i = 1; i < this._matrixHeight / 2 + 1; i++)
            {
                if(this._matrix[j][i] !== 50)
                {
                    temp1[t] = this._matrix[j][i];
                    t++;
                    this._child[j][i].destroy();
                    this._matrix[j][i] = 50;
                }
            }
            t = temp1.length - 1;
            for(let i = this._matrixHeight / 2 ; i > this._matrixHeight / 2 - temp1.length ; i--){
                this._matrix[j][i] = temp1[t];
                t--;
                this.Eventmouse(j,i);
            }
            temp1 = [];
            t = 0;
            for(let i = this._matrixHeight / 2 + 1; i < this._matrixHeight + 1; i++)
            {
                if(this._matrix[j][i] !== 50)
                {
                    temp1[t] = this._matrix[j][i];
                    t++;
                    this._child[j][i].destroy();
                    this._matrix[j][i] = 50;
                }
            }
            t = 0;
            for(let i = this._matrixHeight / 2 + 1; i < this._matrixHeight / 2 + 1 + temp1.length ; i++){
                this._matrix[j][i] = temp1[t];
                t++;
                this.Eventmouse(j, i);
            }
        }
    },  //LV11 Dịch vào 4 góc
    Editmap10(toado0, toado1){
        if(toado0.y > this._matrixHeight / 2){
            let t = 0;
            let temp1 = [];
            for(let i = 1; i < this._matrixWidth + 1; i++)
            {
                if(this._matrix[i][toado0.y] !== 50)
                {
                    temp1[t] = this._matrix[i][toado0.y];
                    t++;
                    this._child[i][toado0.y].destroy();
                    this._matrix[i][toado0.y] = 50;
                }
            }
            t = 0;
            for(let i = 1; i < temp1.length + 1 ; i++){
                this._matrix[i][toado0.y] = temp1[t];
                t++;
                this.Eventmouse(i,toado0.y);
            }
        }
        else
        {
            let t = 0;
            let temp1 = [];
            for(let i = 1; i < this._matrixWidth + 1; i++)
            {
                if(this._matrix[i][toado0.y] !== 50)
                {
                    temp1[t] = this._matrix[i][toado0.y];
                    t++;
                    this._child[i][toado0.y].destroy();
                    this._matrix[i][toado0.y] = 50;
                }
            }
            t = temp1.length - 1;
            for(let i = this._matrixWidth; i > this._matrixWidth - temp1.length ; i--){
                this._matrix[i][toado0.y] = temp1[t];
                t--;
                this.Eventmouse(i, toado0.y);
            }
        }
        if(toado1.y > this._matrixHeight / 2){
            let t = 0;
            let temp1 = [];
            for(let i = 1; i < this._matrixWidth + 1; i++)
            {
                if(this._matrix[i][toado1.y] !== 50)
                {
                    temp1[t] = this._matrix[i][toado1.y];
                    t++;
                    this._child[i][toado1.y].destroy();
                    this._matrix[i][toado1.y] = 50;
                }
            }
            t = 0;
            for(let i = 1; i < temp1.length + 1 ; i++){
                this._matrix[i][toado1.y] = temp1[t];
                t++;
                this.Eventmouse(i,toado1.y);
            }
        }
        else
        {
            let t = 0;
            let temp1 = [];
            for(let i = 1; i < this._matrixWidth + 1; i++)
            {
                if(this._matrix[i][toado1.y] !== 50)
                {
                    temp1[t] = this._matrix[i][toado1.y];
                    t++;
                    this._child[i][toado1.y].destroy();
                    this._matrix[i][toado1.y] = 50;
                }
            }
            t = temp1.length - 1;
            for(let i = this._matrixWidth; i > this._matrixWidth - temp1.length ; i--){
                this._matrix[i][toado1.y] = temp1[t];
                t--;
                this.Eventmouse(i, toado1.y);
            }
        }
    }, //LV12 Trên dịch trái dưới dịch phải
    Drawline(pathMin, listLines){
        for (let i = 0; i < pathMin.length - 1; i++) {
            let line = cc.instantiate(this.linePrefab);
            line.x = (pathMin[i].x - this._matrixWidth / 2) * this._bx;
            line.y = (pathMin[i].y - this._matrixHeight / 2) * this._by - 50;
            const dx = pathMin[i].x - pathMin[i + 1].x;
            this.node.addChild(line);
            listLines.push(line);
            if (dx === 1) {
                //left to right
                line.width = 43;
                line.height = 5;
                line.x -= 21.5;
                continue;
            } else if (dx === -1) {
                //right to left
                line.width = 43;
                line.height = 5;
                line.x += 21.5;
                continue;
            }

            //Tao line
            const dy = pathMin[i].y - pathMin[i + 1].y;
            if (dy === 1) {
                //bottom to top
                line.width = 53;
                line.height = 5;
                line.angle = 90;
                line.y -= 26.5;

            } else if (dy === -1) {
                //top to bottom
                line.width = 53;
                line.height = 5;
                line.angle = 90;
                line.y += 26.5;

            }
        }
    }, //Tao duong noi cac hinh
    HoverButton(){
        this.Playbutton.node.on("mouseenter",()=>{
            if(this._Effect === true){
                cc.audioEngine.playEffect(this.HoverMouse, false);
            }
            this.Playbutton.node.scale = 1.2;
        });
        this.Playbutton.node.on("mouseleave",()=>{
            this.Playbutton.node.scale = 1;
        });
        this.Howtoplay.node.on("mouseenter",()=>{
            if(this._Effect === true){
                cc.audioEngine.playEffect(this.HoverMouse, false);
            }
            this.Howtoplay.node.scale = 1.2;
        });
        this.Howtoplay.node.on("mouseleave",()=> {
            this.Howtoplay.node.scale = 1;
        });
        this.EffectButton.node.on("mouseenter",()=>{
            if(this._Effect === true){
                cc.audioEngine.playEffect(this.HoverMouse, false);
            }
            this.EffectButton.node.scale = 1.2;
        });
        this.EffectButton.node.on("mouseleave",()=>{
            this.EffectButton.node.scale = 1;
        });
        this.MusicButton.node.on("mouseenter",()=>{
            if(this._Effect === true){
                cc.audioEngine.playEffect(this.HoverMouse, false);
            }
            this.MusicButton.node.scale = 1.2;
        });
        this.MusicButton.node.on("mouseleave",()=>{
            this.MusicButton.node.scale = 1;
        });
        this.MusicGameButton.node.on("mouseenter",()=>{
            if(this._Effect === true){
                cc.audioEngine.playEffect(this.HoverMouse, false);
            }
            this.MusicGameButton.node.scale = 1.5;
        });
        this.MusicGameButton.node.on("mouseleave",()=>{
            this.MusicGameButton.node.scale = 1;
        });
        this.EffectGameButton.node.on("mouseenter",()=>{
            if(this._Effect === true){
                cc.audioEngine.playEffect(this.HoverMouse, false);
            }
            this.EffectGameButton.node.scale = 1.5;
        });
        this.EffectGameButton.node.on("mouseleave",()=>{
            this.EffectGameButton.node.scale = 1;
        });
        this.Hintbutton.node.on("mouseenter",()=>{
            if(this._Effect === true){
                cc.audioEngine.playEffect(this.HoverMouse, false);
            }
            this.Hintbutton.node.scale = 1.2;
        });
        this.Hintbutton.node.on("mouseleave",()=>{
            this.Hintbutton.node.scale = 1;
        });
        this.Repeat.node.on("mouseenter",()=>{
            if(this._Effect === true){
                cc.audioEngine.playEffect(this.HoverMouse, false);
            }
            this.Repeat.node.scale = 1.5;
        });
        this.Repeat.node.on("mouseleave",()=>{
            this.Repeat.node.scale = 1;
        });
    },  //Event khi lướt chuột vào nút
    ButtonEvent(){
        let click = 0;
        this.Howtoplay.node.on("mousedown", ()=>{
            if(this._Effect === true)
                cc.audioEngine.playEffect(this.Clicked, false);
            if(click === 0){
                click = 1;
                this._howtoplay = cc.instantiate(this.HowtoplayIMG);
                this._howtoplay.x = 0;
                this._howtoplay.y = 0;
                this.node.addChild(this._howtoplay);
                this._howtoplay.on("mousedown", () => {
                    this._howtoplay.destroy();
                    click = 0;
                })
            }
        });
        this.MusicButton.node.on("mousedown", ()=>{
            if(this._Effect === true)
                cc.audioEngine.playEffect(this.Clicked, false);
            this._Music = !this._Music;
            if(this._Music === false) {
                cc.audioEngine.pauseMusic();
                this.MusicButton.normalColor = cc.color(70,70,70,255);
            }
            else
            {
                this.MusicButton.normalColor = cc.color(255,255,255,255);
                cc.audioEngine.playMusic(this.SoundTrack, true);
            }
        });
        this.EffectButton.node.on("mousedown", ()=>{
            this._Effect = !this._Effect;
            if(this._Effect === true)
            {
                this.EffectButton.normalColor = cc.color(255,255,255,255);
                cc.audioEngine.playEffect(this.Clicked, false);
            }
            else
                this.EffectButton.normalColor = cc.color(70,70,70,255);

        });
        this.Playbutton.node.on("mousedown", ()=>{
            if(this._Effect === true)
                cc.audioEngine.playEffect(this.Clicked, false);
            this.scheduleOnce(()=>{
                if(this._play === 0){
                    this._play = 1;
                    if(this._Music === true)
                        cc.audioEngine.playMusic(this.SoundTrack,true);
                    this.Countdown.node.active = true;
                    this.Hintbutton.node.active = true;
                    this.Repeat.node.active = true;
                    this.MusicButton.node.active = false;
                    this.EffectButton.node.active = false;
                    this.Playbutton.node.active = false;
                    this.Howtoplay.node.active = false;
                    this.hintDisplay.node.active = true;
                    this.MusicGameButton.node.active = true;
                    this.EffectGameButton.node.active = true;
                    this.Time.node.active = true;
                    this.Hintbutton.node.on("mousedown", ()=>{
                        if(this._hint > 0){
                            this.HINT();
                            this.hintDisplay.string = this._hint;
                        }
                        else{
                            alert("Bạn đã dùng hết gợi ý");
                        }
                    });
                    this._bg.destroy();
                    this.Init();
                }
            }, 0.2);
        });
        this.Repeat.node.on("mousedown", ()=>{
            if(this._Effect === true)
            {
                cc.audioEngine.playEffect(this.Clicked, false);
            }
            if(this._rd !== null)
                this._BGround.destroy();
            for(let i = 1; i < this._matrixWidth + 1; i++)
            {
                for(let j = 1; j<this._matrixHeight + 1; j++)
                {
                    if(this._matrix[i][j] !== 50)
                        this._child[i][j].destroy();
                }
            }
            this._score = this._scorelv;
            this.scoreDisplay.string = 'Score: ' +  this._score;
            this.Init();
        });
        this.MusicGameButton.node.on("mousedown", ()=>{
            if(this._Effect === true)
            {
                this.EffectGameButton.normalColor = cc.color(255,255,255,255);
                cc.audioEngine.playEffect(this.Clicked, false);
            }
            else
                this.EffectButton.normalColor = cc.color(255,0,0,255);
            this._Music = !this._Music;
            if(this._Music === false)
            {
                this.MusicGameButton.normalColor = cc.color(255,0,0,255);
                cc.audioEngine.pauseMusic();
            }
            else{
                this.MusicGameButton.normalColor = cc.color(255,255,255,255);
                cc.audioEngine.playMusic(this.SoundTrack,true);
            }
        });
        this.EffectGameButton.node.on("mousedown", ()=>{
            this._Effect = !this._Effect;
            if(this._Effect === true){
                this.EffectGameButton.normalColor = cc.color(255,255,255,255);
                cc.audioEngine.playEffect(this.Clicked, false);
            }
            else
            {
                this.EffectGameButton.normalColor = cc.color(255,0,0,255);
            }
        });
    },  //Event khi nhấn nút
    DisableNode(){
        this.Countdown.node.active = false;
        this.Hintbutton.node.active = false;
        this.MusicGameButton.node.active = false;
        this.EffectGameButton.node.active = false;
        this.Time.node.active = false;
        this.Repeat.node.active = false;
        this.hintDisplay.node.active = false;
    },   //Ẩn node
    TimeCountDown(dt){
        this._time += dt;
        if(this._time >= 1 && this._sec === '00'){
            this._sec = 59;
            this._min--;
        }
        if(this._time >= 1 && this._sec !== '00' && this._sec > 0){
            this._sec--;
            this._time = 0;
        }
        if(this._time >= 1 && this._sec === 0){
            this._sec = 59;
            this._min--;
            this._time = 0;
        }
        if(this._sec >= 10)
            this.Time.string = '0' + this._min + ':' + this._sec;
        if(this._sec < 10 && this._sec !== '00')
            this.Time.string = '0' + this._min + ':0' + this._sec;
    }
});