// Rocket prefab
class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

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

        // fire button
        if(Phaser.Input.Keyboard.JustDown(keyF) && !this.isFiring) {
            this.isFiring = true;
            // this.sfxRocket.play();
        }

        if(this.isFiring && this.y >= 108) {
            this.y -= 6;
        }

        // reset on miss 
        if(this.y <= 108) {
            this.reset();
        }
    }
    
    reset() {
        this.isFiring = false;
        this.y = 431;
    }
}