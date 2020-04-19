// Rocket prefab
class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, angle) {
        super(scene, x, y, texture, frame, angle);

        scene.add.existing(this);   // add object to existing scene, displayList, updateList
        this.isFiring = false;  // track rocket's firing status
    }

    update() {
        // left, right movement
        if(!this.isFiring) {
            if(keyLEFT.isDown && this.x >= 47) {
                this.x-= 5;
            } else if(keyRIGHT.isDown && this.x <= 577) {
                this.x += 5;
            }
        }

        // reset on miss 
        if(this.y <= 108 || this.y >= 450 || this.x <= 47 || this.x >= 577) {
            this.reset();
        }
    }
    
    
    reset() {
        this.isFiring = false;
        this.y = 431;
        this.angle = 0;
        this.x = game.config.width/2;
    }
}