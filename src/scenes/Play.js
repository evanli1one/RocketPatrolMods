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
        this.load.image('spark', './assets/simple_spark.png');
        this.load.audio('sfx_rocket', './assets/rocket_shot.wav');
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
        let ship01Rand = this.randStart();
        let ship02Rand = this.randStart();
        let ship03Rand = this.randStart();
        this.ship01 = new Spaceship(this, ship01Rand, 132, 'spaceship', 0, 30, ship01Rand, game.settings.spaceshipSpeed).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, ship02Rand, 196, 'spaceship', 0, 20, ship02Rand, game.settings.spaceshipSpeed).setOrigin(0, 0);
        this.ship03 = new Spaceship(this, ship03Rand, 260, 'spaceship', 0, 10, ship03Rand, game.settings.spaceshipSpeed).setOrigin(0, 0);

        // define keyboard keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        // Fire pointer input
        // https://phaser.io/examples/v3/view/input/mouse/mouse-down
        this.input.on('pointerdown', function(pointer) {
            if(this.p1Rocket.isFiring == false && !this.gameOver){
                let xDist = pointer.x - this.p1Rocket.x;
                let yDist = this.p1Rocket.y - pointer.y;
                let rocketSpeed = 3;
                
                // Angle in degrees between rocket and pointer click where +x is 0 degrees and 90 is -y
                let shotAngle = 180 + Phaser.Math.RadToDeg(Phaser.Math.Angle.Between(this.p1Rocket.x, this.p1Rocket.y, pointer.x, pointer.y));

                // Converts the xDist, yDist components into xSpeed, ySpeed components in order to achieve rocketSpeed (diagonal speed) on combining components
                // Uses Pythagorean theorum to solve for scaleFactor given a, b, and c where c is rocketSpeed and a, b are xDist, yDist
                let scaleFactor = Math.sqrt(Math.pow(Math.abs(xDist), 2) + Math.pow(Math.abs(yDist), 2)) / rocketSpeed;

                // Changes speed components to proper magnitudes (the rocketSpeed)
                this.xSpeed = -xDist / scaleFactor;       
                this.ySpeed = yDist / scaleFactor;

                // Change rocket angle to face where it is fired
                this.p1Rocket.angle = shotAngle - 90; // - 90 due to rocket visual front not being true front
                this.p1Rocket.isFiring = true;

                // Play audio
                this.sound.play('sfx_rocket');
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
            fixedWidth: 80
        }
        this.scoreLeft = this.add.text(50,54,this.p1Score, scoreConfig);
        scoreConfig.fixedWidth = 0;
        this.highScoreDisp = this.add.text(game.config.width - 300,54,"High score: " + highScore, scoreConfig);

        // game over flag
        this.gameOver = false;

        // play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            scoreConfig.fixedWidth = 0;
            highScore = this.p1Score;
            this.add.text(game.config.width/2, game.config.height/2 - 64, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2, 'F to Restart or ESC for Menu', scoreConfig).setOrigin(0.5);
            scoreConfig.backgroundColor = '#00FF00';
            scoreConfig.color = "#000";
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'High score: ' + highScore, scoreConfig).setOrigin(0.5);
            this.highScoreDisp.setText("High score: " + highScore);
            this.gameOver = true;
        }, null, this);

        // currTime display
        scoreConfig.fixedWidth = 140;
        this.timerRight = this.add.text(game.config.width/2 - 150, 54, '', scoreConfig);

        // add particles
        this.sparks = this.add.particles('spark');
        this.sparkAccel = 25;
    }

    update() {
        // check key input for restart
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyF)) {
            this.scene.restart(this.p1Score);
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyESC)) {
            this.scene.start("menuScene");
        }
        if(Phaser.Input.Keyboard.JustDown(keyESC)) {
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
                // experimental mouse movement: lock x position to pointer.x on move pointer
                // this.input.on('pointermove', function(pointer) {
                //     if(pointer.x < this.p1Rocket.x && this.p1Rocket.x >= 47) { 
                //             this.p1Rocket.x -= 5;
                //     }
                //     if(pointer.x > this.p1Rocket.x && this.p1Rocket.x <= 577) { 
                //         this.p1Rocket.x += 5;
                //     }
                // }
            // , this)};
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
        // create explosion particles at ship's poisition
        let emitRectangle = new Phaser.Geom.Rectangle(0, 0, 40, 20);
        let particleBoom = this.sparks.createEmitter({
            emitZone: { source: emitRectangle},
            alpha: { start: 1, end: 0},
            scale: { start: 4, end: 1},
            speed: 100,
            rotate: { min: 0, max: 360 },
            lifespan: 500,
            quantity: 2,
            maxParticles: 15,
            x: ship.x + 31,
            y: ship.y + 15, 
        });
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
        this.sound.play('sfx_explosion');
    }

    pointerShoot(xSpeed, ySpeed){
        this.p1Rocket.x -= xSpeed;
        this.p1Rocket.y -= ySpeed;
    }

    randStart(){
        let num = Math.floor(Math.random() * 10);
        if(num >= 4){
            return 0;
        } else {
            return game.config.width;
        }
    }
}

