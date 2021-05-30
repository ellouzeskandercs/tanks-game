import Phaser from 'phaser';
import { Angle, ANGLE_UNIT } from './angle'

export class Tank {
    private _containerObject: Phaser.GameObjects.Container;
    private _vehicleObject: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private _cannonObject: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private _scene: Phaser.Scene;
    private _velocity: number = 160;
    private _angularVelocity: number = 80;

    constructor(scene: Phaser.Scene, x: number = 0, y:number = 0, obstacles: Phaser.Physics.Arcade.StaticGroup) {
        this._scene = scene;

        this._containerObject = this._scene.add.container(x, y);
        this._containerObject.setSize(80,80)

        this._vehicleObject = this._scene.add.sprite(0, 0, 'tank') as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

        this._cannonObject = this._scene.add.sprite(0, 0, 'cannon') as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
        this._cannonObject.setOrigin(0, 0.5);

        this._scene.physics.world.enable(this._containerObject);
        this._scene.physics.world.enable(this._vehicleObject);
        this._scene.physics.world.enable(this._cannonObject);

        this._containerObject.addAt(this._vehicleObject, 0);
        this._containerObject.addAt(this._cannonObject, 1);

        // this._scene.physics.add.overlap(this._containerObject, obstacles, (a, b) => console.log(a,b), this.isColliding)
    }

    // private isColliding(a: any, b: any) {
    //     console.log(a,b)
    //     return false
    // }

    public pointCannonToPoint(x: number, y: number) {
        this._cannonObject.rotation = Phaser.Math.Angle.Between(this._containerObject.x, this._containerObject.y, x, y);
    }

    public moveToDirection(directionAngle: Angle) {
        const vehiculeAngle: Angle = new Angle(this._vehicleObject.angle, ANGLE_UNIT.DEGREES);
        const angleDiff: Angle = Angle.sum(vehiculeAngle, Angle.multiply(directionAngle, -1))
        console.log('anglediff',vehiculeAngle, Angle.multiply(directionAngle, -1), angleDiff, angleDiff.sin(), angleDiff.cos());
        if (angleDiff.sin()**2 < 0.01 && angleDiff.cos()**2 > 0.81) {
            this._vehicleObject.body.setAngularVelocity(0);
            // console.log(directionAngle.cos());
            // console.log(directionAngle.sin());
            (this._containerObject.body as Phaser.Physics.Arcade.Body).setVelocity(directionAngle.cos() * this._velocity, directionAngle.sin() * this._velocity);
        } else {
            this._vehicleObject.body.setAngularVelocity(angleDiff.sin() * angleDiff.cos() < 0 ? this._angularVelocity : -this._angularVelocity);
            (this._containerObject.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);
        }        
    }

    public stop() {
        this._vehicleObject.body.setAngularVelocity(0);
        (this._containerObject.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);
    }

}