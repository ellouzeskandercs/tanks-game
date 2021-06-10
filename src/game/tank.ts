import Phaser from 'phaser';
import { Angle, ANGLE_UNIT } from './angle'
import { Rectangle } from './rectangle';
import { Point, Vector } from './point';

export class Tank {
    private static _getObjectTrigoCoordinates(point: Point): Point{
        /* To do move this to other helper */
        return ({
            x: point.y,
            y: point.x
        })
    }

    private _containerObject: Phaser.GameObjects.Container;
    private _vehicleObject: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private _cannonObject: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private _scene: Phaser.Scene;
    private _velocity: number = 160;
    private _angularVelocity: number = 80;

    constructor(scene: Phaser.Scene, x: number = 0, y:number = 0) {
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
    }

    private _getObjectAsRectangle(object: Phaser.Physics.Arcade.Sprite): Rectangle {
        const rotation = { 
            origin: Tank._getObjectTrigoCoordinates({ 
                x: object.body.x + object.originX * object.width,
                y: object.body.y + object.originY * object.height
            }),
            angle: new Angle(- object.angle, ANGLE_UNIT.DEGREES)
        }
        const rectangle = new Rectangle(Tank._getObjectTrigoCoordinates(object.body.position), object.body.width, object.body.height, rotation);
        return rectangle;
    }

    public setObstacleCollider(object: Phaser.GameObjects.GameObject | Phaser.GameObjects.GameObject[] | Phaser.GameObjects.Group | Phaser.GameObjects.Group[]) {
        this._scene.physics.add.overlap(this._containerObject, object, (object1, object2) => this.histTest(object1, object2))
    }

    public histTest(object1: Phaser.Types.Physics.Arcade.GameObjectWithBody, object2: Phaser.Types.Physics.Arcade.GameObjectWithBody): void {

        const cannonRectangle = this._getObjectAsRectangle(this._cannonObject);
        const vehicleRectangle = this._getObjectAsRectangle(this._vehicleObject);
        const obstacleRectangle = new Rectangle(Tank._getObjectTrigoCoordinates(object2.body.position), object2.body.width, object2.body.height)

        const cannonHitsObstacle = cannonRectangle.getBounds().reduce((acc:boolean, point: Point) => obstacleRectangle.isPointInside(point) || acc, false);
        const vehicleHitsObstacle = vehicleRectangle.getBounds().reduce((acc:boolean, point: Point) => obstacleRectangle.isPointInside(point) || acc, false);
        const obstacleHitsVehicle = obstacleRectangle.getBounds().reduce((acc:boolean, point: Point) => vehicleRectangle.isPointInside(point) || acc, false);
        const obstacleHitsCannon = obstacleRectangle.getBounds().reduce((acc:boolean, point: Point) => cannonRectangle.isPointInside(point) || acc, false);
        
        if(cannonHitsObstacle || obstacleHitsCannon || vehicleHitsObstacle || obstacleHitsVehicle){
            const pushDirection: Vector = {
                x: this._containerObject.x - object2.body.center.x,
                y: this._containerObject.y - object2.body.center.y
            }
            this.pushTank(pushDirection, 10);
        }
    }
    
    public pushTank(directionVector: Vector, distance: number): void {
        const vehiculeAngle: Angle = new Angle(this._vehicleObject.angle, ANGLE_UNIT.DEGREES);

        this._containerObject.x = this._containerObject.x + Math.sign(directionVector.x) * Math.abs(vehiculeAngle.cos()) * distance;
        this._containerObject.y = this._containerObject.y + Math.sign(directionVector.y) * Math.abs(vehiculeAngle.sin()) * distance;
    }

    public pointCannonToPoint(x: number, y: number) {
        this._cannonObject.rotation = Phaser.Math.Angle.Between(this._containerObject.x, this._containerObject.y, x, y);
    }

    public moveToDirection(directionAngle: Angle) {
        const vehiculeAngle: Angle = new Angle(this._vehicleObject.angle, ANGLE_UNIT.DEGREES);
        const angleDiff: Angle = Angle.sum(vehiculeAngle, Angle.multiply(directionAngle, -1))
        if (angleDiff.sin()**2 < 0.01 && angleDiff.cos()**2 > 0.81) {
            this._vehicleObject.body.setAngularVelocity(0);
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