// Spaceship prefab
class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue, direction, shipSpeed) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);   // add object to existing scene, displayList, updateList
        this.points = pointValue;
        if(direction == 0){
            this.direction = 1;
        } else if(direction == game.config.width) {
            this.direction = -1;
        }
        this.shipSpeed = shipSpeed;
    }

    update() {
        // move spaceship
        this.x -= this.direction * this.shipSpeed;
        // warp around screen bounds
        if(this.x <= 0 - this.width) {
            this.reset();
        }
        if(this.x >= game.config.width + this.width) {
            this.reset();
        }
    }

    reset() {
        let num = Math.floor(Math.random() * 10);
        if(num >= 4){
            this.x = game.config.width;
            this.direction = 1;
        } else {
            this.x = 0;
            this.direction = -1;
        }
    }
}