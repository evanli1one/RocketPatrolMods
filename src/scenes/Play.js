class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/title sprite
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame:0, endFrame:9});
        // Objects remain preloaded across scenes
    }

    create() {
        // place title sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0,0);

        // white rectangle borders
        this.add.rectangle(5, 5, 630, 32, 0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(5, 443, 630, 32, 0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(5, 5, 32, 455, 0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(603, 5, 32, 455, 0xFFFFFF).setOrigin(0,0);

        // green UI background
        this.add.rectangle(37, 42, 566, 64, 0x00FF00).setOrigin(0,0);

        // add rocket (p1)
        // constructor(scene, x, y, texture, frame)
        this.p1Rocket = new Rocket(this, game.config.width/2, 431, 'rocket', 0, 90).setScale(0.5, 0.5);
        
        // add spaceship (x3)
        this.ship01 = new Spaceship(this, game.config.width + 192, 132, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + 96, 196, 'spaceship', 0, 20).setOrigin(0, 0);
        this.ship03 = new Spaceship(this, game.config.width, 260, 'spaceship', 0, 10).setOrigin(0, 0);

        // define keyboard keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // mouse input
        // this.Phaser.Input.Pointer.on('pointerdown', this.p1Rocket.pointerShoot);

        // https://phaser.io/examples/v3/view/input/mouse/mouse-down
        this.input.on('pointerdown', function(pointer) {
            if(this.p1Rocket.isFiring == false && !this.gameOver){
                let xDist = pointer.x - this.p1Rocket.x;
                let yDist = this.p1Rocket.y - pointer.y;
                let shotAngle = 180 + Phaser.Math.RadToDeg(Phaser.Math.Angle.Between(this.p1Rocket.x, this.p1Rocket.y, pointer.x, pointer.y));

                let scaleFactor = Math.sqrt(Math.pow(Math.abs(xDist), 2) + Math.pow(Math.abs(yDist), 2)) / 3;

                if(xDist < 0){
                    this.xSpeed = -xDist / scaleFactor;
                } else {
                    this.xSpeed = -xDist / scaleFactor;
                }            
                this.ySpeed = yDist / scaleFactor;

                this.p1Rocket.angle = shotAngle - 90;
                this.p1Rocket.isFiring = true;

                console.log("xSpeed: " + this.xSpeed);
                console.log("ySpeed: " + this.ySpeed);
                console.log("xDist: " + xDist);
                console.log("yDist: " + yDist);
                console.log("pointer.x: " + pointer.x);
                console.log("pointer.y: " + pointer.y);
                console.log("shotAngle: " + shotAngle);
                console.log("click isFiring: " + this.p1Rocket.isFiring);
            }
        }, this);

        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', {start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        // score
        this.p1Score = 0;
        // score display
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(69,54,this.p1Score, scoreConfig);

        // game over flag
        this.gameOver = false;

        // play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 +64, '(F)ire to Restart or <- for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);

        // currTime
        this.timerRight = this.add.text(400,54,'', scoreConfig);
    }

    update() {
        // check key input for restart
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyF)) {
            this.scene.restart(this.p1Score);
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        // scroll starfield
        this.starfield.tilePositionX -= 0.5;

        if(!this.gameOver) {
            // update rocket
            this.p1Rocket.update();
            // update spaceship
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
            // shoot rocket toward pointer
            if(this.p1Rocket.isFiring == true){
                this.pointerShoot(this.xSpeed, this.ySpeed);
            } else {
                // this.pointerMove(Phaser.Input.Pointer);         
            }
            
        }

        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if(this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);}
        if(this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);}

        // update timer
        this.currTime = this.clock.getElapsed();
        this.displayTime = Phaser.Math.Snap.To((this.clock.delay - this.currTime)/1000, 1);
        if(this.currTime != game.settings.gameTimer/1000){
            this.timerRight.setText("Time: " + this.displayTime);
        }
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        ship.alpha = 0;
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');
        boom.on('animationcomplete', () => { // callback after animation
            ship.reset();
            ship.alpha = 1;
            boom.destroy();
        });

        // max time increase
        this.clock.delay += ship.points * 100;
                
        // score increment and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
        // this.sound.play('sfx_explosion');
        
    }

    pointerShoot(xSpeed, ySpeed){
        console.log("during isFiring: " + this.p1Rocket.isFiring);
        this.p1Rocket.x -= xSpeed;
        this.p1Rocket.y -= ySpeed;
        // this.sfxRocket.play();
    }

    // pointerMove(pointer) {
    //     if(pointer.x < this.p1Rocket.x && this.p1Rocket.x >= 47) { 
    //         this.p1Rocket.x -= 5;
    //     } else if(this.p1Rocket.x <= 577) {
    //         this.p1Rocket.x += 5;
    //     }
    // }
}

