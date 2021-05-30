import Phaser from 'phaser';

export class Tank {
    public static fromDegToRadian(angle: number): number {
        /* To move to a physics/maths helpers */
        return angle * Math.PI / 180; 
    }

    private _containerObject: Phaser.GameObjects.Container;
    private _vehicleObject: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private _cannonObject: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private _scene: Phaser.Scene;
    private _velocity: number = 160;

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

    public moveToDirection(directionAngle: number) {
        if (Math.sin(Tank.fromDegToRadian(this._vehicleObject.angle - directionAngle))**2 < 0.01 && Math.cos(Tank.fromDegToRadian(this._vehicleObject.angle - directionAngle)) > 0.9) {
            this._vehicleObject.body.setAngularVelocity(0);
            (this._containerObject.body as Phaser.Physics.Arcade.Body).setVelocity(
                Math.cos(Tank.fromDegToRadian(directionAngle)) * this._velocity, Math.sin(Tank.fromDegToRadian(directionAngle)) * this._velocity);
        } else {
            this._vehicleObject.body.setAngularVelocity(Math.sin(Tank.fromDegToRadian(directionAngle - this._vehicleObject.angle)) > 0 ? 80 : -80);
            (this._containerObject.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);
        }        
    }

    public stop() {
        this._vehicleObject.body.setAngularVelocity(0);
        (this._containerObject.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);
    }

}