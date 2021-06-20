import Phaser from 'phaser';
import { Angle, ANGLE_UNIT } from './angle';
import { Point, Vector } from './point';
import { Rectangle } from './rectangle';
import { Tank } from './tank';

export class Bullet {
    public static maxCollisionTimes: number = 2;

    private _scene: Phaser.Scene;
    private _collidedTimes: number = 0;
    private _bulletObject: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

    constructor(scene: Phaser.Scene, position: Point, velocity: number, angle: Angle) {
        this._scene = scene;
        this._bulletObject = this._scene.add.sprite(position.x, position.y, 'bullet') as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
        this._scene.physics.world.enable(this._bulletObject);
        this._bulletObject.body.setVelocity(velocity * angle.cos(), velocity * angle.sin());
        this._bulletObject.rotation = Angle.transformToRadians(angle).value;
    }

    private _getObjectAsRectangle(object: Phaser.Physics.Arcade.Sprite): Rectangle {
        const rotation = { 
            origin: Tank.getObjectTrigoCoordinates({ 
                x: object.body.x + object.originX * object.width,
                y: object.body.y + object.originY * object.height
            }),
            angle: new Angle(- object.angle, ANGLE_UNIT.DEGREES)
        }
        const rectangle = new Rectangle(Tank.getObjectTrigoCoordinates(object.body.position), object.body.width, object.body.height, rotation);
        return rectangle;
    }

    public setColliderWithTank(tank: Tank) {
        tank.setBulletObjectCollider(this._bulletObject)
    }

    public setObstacleCollider(object: Phaser.GameObjects.GameObject | Phaser.GameObjects.GameObject[] | Phaser.GameObjects.Group | Phaser.GameObjects.Group[]) {
        this._scene.physics.add.overlap(this._bulletObject, object, (object1, object2) => this.histTest(object1, object2))
    }

    public histTest(object1: Phaser.Types.Physics.Arcade.GameObjectWithBody, object2: Phaser.Types.Physics.Arcade.GameObjectWithBody): void {
        const bulletRectangle = this._getObjectAsRectangle(this._bulletObject);
        const obstacleRectangle = new Rectangle(Tank.getObjectTrigoCoordinates(object2.body.position), object2.body.width, object2.body.height)

        const bulletHitsObstacle = bulletRectangle.getBounds().reduce((acc:boolean, point: Point) => obstacleRectangle.isPointInside(point) || acc, false);
        const obstacleHitsBullet = obstacleRectangle.getBounds().reduce((acc:boolean, point: Point) => bulletRectangle.isPointInside(point) || acc, false);
        
        if(bulletHitsObstacle || obstacleHitsBullet){
            const intersection = obstacleRectangle.intersectWithLine({
                point: Tank.getObjectTrigoCoordinates(this._bulletObject.body.center),
                direction:  Tank.getObjectTrigoCoordinates(this._bulletObject.body.velocity)
            });
            if(this._collidedTimes < Bullet.maxCollisionTimes){
                this.reflect(intersection);
                this._collidedTimes = this._collidedTimes + 1;
            } else {
                this._bulletObject.destroy()
            }
        }
    }

    public reflect(intersection: any): void {
        const velocityTrigoCoord: Vector = Tank.getObjectTrigoCoordinates(this._bulletObject.body.velocity);
        const reflectedVelocity: Vector = {
            x: (velocityTrigoCoord.x > 0 ? intersection.left : intersection.right) ? - velocityTrigoCoord.x: velocityTrigoCoord.x,
            y: (velocityTrigoCoord.y > 0 ? intersection.bottom : intersection.top) ? - velocityTrigoCoord.y: velocityTrigoCoord.y,
        }
        const velocityAngle = (reflectedVelocity.x ? ( reflectedVelocity.x > 0 ? Math.atan( reflectedVelocity.y / reflectedVelocity.x): Math.PI + Math.atan( reflectedVelocity.y / reflectedVelocity.x) ): (reflectedVelocity.x > 0 ? 0 : Math.PI));

        this._bulletObject.body.setVelocity(reflectedVelocity.y, reflectedVelocity.x)
        this._bulletObject.rotation = (Math.PI/2) - velocityAngle;
    }
    
}