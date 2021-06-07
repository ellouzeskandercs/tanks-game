
import { Angle, ANGLE_UNIT } from './angle';
import { Rectangle } from './rectangle'

describe('Rectangle class testing', () => {
    let rectangle: Rectangle;
    beforeAll(() => {
        rectangle = new Rectangle(
            { x: 0, y: 0 }, 
            2, 
            3, 
            { 
                origin: { x : 0, y: 1 }, 
                angle: new Angle(20, ANGLE_UNIT.DEGREES)
            });
    })

    it('Should be able to translate a rectangle', ()=> {
        rectangle = rectangle.translate({ x: 2, y: 2})
        expect(rectangle.position).toEqual({ x: 2, y: 2 })
        expect(rectangle.rotation.origin).toEqual({ x: 2, y: 3 })
    })

    it('Should be able to rotate a rectangle', ()=> {
        rectangle = rectangle.rotate(new Angle(25, ANGLE_UNIT.DEGREES))
        expect(rectangle.rotation.angle.value).toEqual(45);
        expect(rectangle.rotation.angle.unit).toEqual(ANGLE_UNIT.DEGREES);
    })

    it('should be able to return the correct bounds', () => {
        expect(rectangle.getBounds().map((point) => ({
            x: Math.round(10 * point.x) / 10,
            y: Math.round(10 * point.y) / 10
        }))).toEqual(
                [
                    { x: 2.7, y: 2.3 },
                    { x: 1.3, y: 3.7 },
                    { x: 3.4, y: 5.8 },
                    { x: 4.8, y: 4.4 }
                ]              
        )
    })

    it('should be able to return whether or not a point is inside a rectangle', () => {
        expect(rectangle.isPointInside({ x: 3.3, y: 5.7 })).toBe(true);
        expect(rectangle.isPointInside({ x: 4.9, y: 4.2 })).toBe(false);
        expect(rectangle.isPointInside({ x: 3.2, y: 5.6 })).toBe(true);
    })
})