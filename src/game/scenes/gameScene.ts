import _ from 'lodash';
import Phaser from 'phaser';
import { Angle, ANGLE_UNIT } from '../angle';
import { Bullet } from '../bullet';
import { gamePreloadImages } from '../assets/constants';
import { Tank } from '../tank';

function getDirectionAngle([top, right, bottom, left]: boolean[]): Angle{
    enum DIRECTIONS {
        TOP = -90,
        TOPRIGHT = -45,
        RIGHT = 0,
        BOTTOMRIGHT = 45,
        BOTTOM = 90,
        BOTTOMLEFT = 135,
        LEFT = 180,
        TOPLEFT = -135,
    }
    if(_.isEqual([top, right, bottom, left], [true,false,false,false])) { return (new Angle(DIRECTIONS.TOP, ANGLE_UNIT.DEGREES)); } 
    if(_.isEqual([top, right, bottom, left], [true,true,false,false])) { return (new Angle(DIRECTIONS.TOPRIGHT, ANGLE_UNIT.DEGREES)); } 
    if(_.isEqual([top, right, bottom, left], [false,true,false,false])) { return (new Angle(DIRECTIONS.RIGHT, ANGLE_UNIT.DEGREES)); } 
    if(_.isEqual([top, right, bottom, left], [false,true,true,false])) { return (new Angle(DIRECTIONS.BOTTOMRIGHT, ANGLE_UNIT.DEGREES)); } 
    if(_.isEqual([top, right, bottom, left], [false,false,true,false])) { return (new Angle(DIRECTIONS.BOTTOM, ANGLE_UNIT.DEGREES)); } 
    if(_.isEqual([top, right, bottom, left], [false,false,true,true])) { return (new Angle(DIRECTIONS.BOTTOMLEFT, ANGLE_UNIT.DEGREES)); } 
    if(_.isEqual([top, right, bottom, left], [false,false,false,true])) { return (new Angle(DIRECTIONS.LEFT, ANGLE_UNIT.DEGREES)); } 
    if(_.isEqual([top, right, bottom, left], [true,false,false,true])) { return (new Angle(DIRECTIONS.TOPLEFT, ANGLE_UNIT.DEGREES)); } 
    throw new Error('Could not find the direction angle form input');
}

class GameScene extends Phaser.Scene {
    public obstacles!: Phaser.GameObjects.Group;
    public cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    public tank!: Tank;

    constructor(){
        super('gameScene');
    }

	preload() {
        Object.values(gamePreloadImages).forEach((imagetoLoad) => this.load.image(imagetoLoad.name, imagetoLoad.path))
	}

	create() {
        this.add.image(400, 250, 'background');

        this.cursors = this.input.keyboard.createCursorKeys();

        this.obstacles = this.physics.add.staticGroup();
        this.obstacles.create(400, 350, 'obstacle');
        this.obstacles.create(200, 150, 'obstacle');
        this.obstacles.create(550, 150, 'obstacle');

        this.tank = new Tank(this, 25, 20);
        this.tank.setObstacleCollider(this.obstacles);
	}

	update() {
        if (!this.tank.destroyed) {
            let cursorsDirections = [this.cursors.up.isDown, this.cursors.right.isDown, this.cursors.down.isDown, this.cursors.left.isDown];
            if(cursorsDirections[0] && cursorsDirections[2] || cursorsDirections[1] && cursorsDirections[3] || !cursorsDirections.reduce((a, b) => a || b, false)){
                this.tank.stop();
            } else {
                this.tank.moveToDirection(getDirectionAngle(cursorsDirections))
            }
            let mousePointer = this.game.input.mousePointer;
            this.tank.pointCannonToPoint(mousePointer.x, mousePointer.y); 
            if (mousePointer.leftButtonDown()) {
                const bullet: Bullet = this.tank.fire(mousePointer.x, mousePointer.y);
                bullet.setObstacleCollider(this.obstacles);
                setTimeout(() => {
                    bullet.setColliderWithTank(this.tank);
                }, 500);
            }
        } else {
            this.scene.switch('initScene');
        }
	}
}

export default GameScene;