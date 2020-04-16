// Rocket prefab
class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, angle) {
        super(scene, x, y, texture, frame, angle);

        scene.add.existing(this);   // add object to existing scene, displayList, updateList
        this.isFiring = false;  // track rocket's firing status
        this.sfxRocket = scene.sound.add('sfx_rocket'); // add rocket sfx
    }

    update() {
        // left, right movement
        if(!this.isFiring) {
            if(keyLEFT.isDown && this.x >= 47) {
                this.x-= 3;
            } else if(keyRIGHT.isDown && this.x <= 577) {
                this.x += 3;
            }
        }

        //hi

        // fire button
        // if(Phaser.Input.Keyboard.JustDown(keyF) && !this.isFiring) {
        //     this.isFiring = true;
        //     // this.sfxRocket.play();
        // }

        // function pointerShoot (xSpeed, ySpeed){
        //     if(!this.isFiring){
        //         this.isFiring = true;
        //         while(this.isFiring && this.y >= 108 && this.x < 0 && this.x > game.config.width){
        //             this.x -= xSpeed;
        //             this.y -= ySpeed;
        //         }
        //         // this.sfxRocket.play();
        //     }
        // }

        // if(this.isFiring && this.y >= 108 && this.x < 0 && this.x > game.config.width) {
        //     this.y -= 6;
        // }


        // if(this.isFiring && this.y >= 108 && this.x < 0 && this.x > game.config.width) {
        //     this.y -= 6;
        // }

        // reset on miss 
        if(this.y <= 108 || this.x <= 47 || this.x >= 577) {
            this.reset();
        }
    }
    
    
    reset() {
        this.isFiring = false;
        this.y = 431;
        this.angle = 0;
    }
}