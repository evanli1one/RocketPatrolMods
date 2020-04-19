class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        this.load.audio('sfx_select', './assets/blip_select12.wav');
        this.load.audio('sfx_explosion', './assets/explosion38.wav');
        this.load.audio('sfx_rocket', './assets/rocket_shot.wav');
    }

    create() {
        // menu display
        // score display
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        // show menu text
        let centerX = game.config.width/2;
        let centerY = game.config.height/2;
        let textSpacer = 64;

        this.add.text(centerX, centerY - 2*textSpacer, 'ROCKET PATROL', menuConfig).setOrigin(0.5);
        this.add.text(centerX, centerY - textSpacer, 'Use <- -> arrows to move on ground', menuConfig).setOrigin(0.5);
        this.add.text(centerX, centerY, 'mouse to aim, and (F) to fire', menuConfig).setOrigin(0.5);
        this.add.text(centerX, centerY + textSpacer, 'escape to return to menu', menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#00FF00';
        menuConfig.color = "#000";
        this.add.text(centerX, centerY + 2*textSpacer, 'Press <- for Easy or -> for Hard', menuConfig).setOrigin(0.5);
        this.add.text(centerX, centerY + 3*textSpacer, 'High score: ' + highScore, menuConfig).setOrigin(0.5);

        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update() {
        if(Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            // easy mode
            game.settings = {
                spaceshipSpeed: 3,
                gameTimer: 20000
            }
            this.sound.play('sfx_select');
            this.scene.start("playScene");
        }
        if(Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            // hard mode
            game.settings = {
                spaceshipSpeed: 5,
                gameTimer: 15000
            }
            this.sound.play('sfx_select');
            this.scene.start("playScene");
        }
    }
}