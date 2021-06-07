import { Angle, ANGLE_UNIT } from './angle';
import { Point, Vector } from './point';

export class Rectangle {
    /* To do refacto after creatinng class Vector */

    public static isPointInside(rect: Rectangle, point: Point): boolean {
        return rect.isPointInside(point);
    } 

    public position: Point;
    public width: number;
    public height: number;
    public rotation: IRectangleRotation;

    constructor(
        position: Point, 
        height: number, 
        width: number, 
        rotation?: IRectangleRotation){
        this.position = position;
        this.width = width;
        this.height = height;
        this.rotation = rotation ?? { angle : new Angle(0, ANGLE_UNIT.DEGREES), origin: position };
    }

    public translate(translationVector: Vector): Rectangle {
        const newPostion: Point = { x: this.position.x + translationVector.x, y: this.position.y + translationVector.y }; 
        const newRotationCenter: Point = { x: this.rotation.origin.x + translationVector.x, y: this.rotation.origin.y + translationVector.y }; 
        return new Rectangle(
            newPostion,
            this.height,
            this.width,
            { origin: newRotationCenter, angle: this.rotation.angle }
        )
    }

    public rotate(angle: Angle): Rectangle {
        return new Rectangle(
            this.position,
            this.height,
            this.width,
            { origin: this.rotation.origin, angle: Angle.sum(this.rotation.angle, angle)}
        )
    }

    public getBounds(): Point[] {
        const leftBottom = {
            x: this.position.x, 
            y: this.position.y
        }
        const leftTop = { 
            x: this.position.x - this.height * this.rotation.angle.sin(), 
            y: this.position.y + this.height * this.rotation.angle.cos() 
        };
        const rightTop = { 
            x: this.position.x + this.width * this.rotation.angle.cos() - this.height * this.rotation.angle.sin(), 
            y: this.position.y + this.width * this.rotation.angle.sin() + this.height * this.rotation.angle.cos()
        };
        const rightBottom = { 
            x: this.position.x + this.width * this.rotation.angle.cos(), 
            y: this.position.y + this.width * this.rotation.angle.sin(), 
        };
        const rotatedRotationOrigin = {
            x: (this.rotation.origin.x - this.position.x) * this.rotation.angle.cos() - (this.rotation.origin.y - this.position.y) * this.rotation.angle.sin(), 
            y: (this.rotation.origin.x - this.position.x) * this.rotation.angle.sin() + (this.rotation.origin.y - this.position.y) * this.rotation.angle.cos()            
        }
        return([leftBottom, leftTop, rightTop, rightBottom].map((point) =>({
            x: point.x + this.rotation.origin.x - this.position.x - rotatedRotationOrigin.x,
            y: point.y + this.rotation.origin.y - this.position.y - rotatedRotationOrigin.y
        })))
    }

    public isPointInside(point : Point): boolean {
        const pointVector = {
            x: (point.x - this.rotation.origin.x),
            y: (point.y - this.rotation.origin.y),
        }   
        const vectorAngle = (pointVector.y ? Math.atan(pointVector.x / pointVector.y) : (pointVector.x > 0 ? 0 : Math.PI));
        const vectorLen = (Math.sqrt(pointVector.x ** 2 + pointVector.y **2));
        const newPointVector = {
            x: vectorLen * Angle.sum(Angle.multiply(this.rotation.angle, -1), new Angle(vectorAngle, ANGLE_UNIT.RADIANS)).cos() + this.rotation.origin.x - this.position.x,
            y: vectorLen * Angle.sum(Angle.multiply(this.rotation.angle, -1), new Angle(vectorAngle, ANGLE_UNIT.RADIANS)).sin() + this.rotation.origin.y - this.position.y
        }
        return(newPointVector.x < this.width && newPointVector.y < this.height);
    } 
}

export interface IRectangleRotation {
    angle: Angle,
    origin: Point
}