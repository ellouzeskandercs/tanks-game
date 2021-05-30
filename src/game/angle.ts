export class Angle {
    public static transformToRadians(angle: Angle): Angle{
        if (angle.unit === ANGLE_UNIT.RADIANS) {
            return angle
        }
        return new Angle(angle.value * Math.PI/ 180, ANGLE_UNIT.RADIANS);
    }
    public static transformToDegrees(angle: Angle): Angle{
        if (angle.unit === ANGLE_UNIT.DEGREES) {
            return angle
        }
        return new Angle(angle.value * 180/ Math.PI, ANGLE_UNIT.DEGREES);
    }
    public static transformToUnit(angle: Angle, unit: ANGLE_UNIT): Angle{
        if (angle.unit === unit) {
            return angle
        } else if (unit === ANGLE_UNIT.RADIANS){
            return Angle.transformToRadians(angle)
        } else {
            return Angle.transformToDegrees(angle)
        }
    }
    public static sin(angle: Angle): number{
        if(angle.unit === ANGLE_UNIT.DEGREES){
            return Math.sin(angle.value * Math.PI / 180)
        }
        if(angle.unit === ANGLE_UNIT.RADIANS){
            return Math.sin(angle.value)
        }
        throw new Error('Could not compute sinus of this angle: unit was not radians or degrees')
    }

    public static cos(angle: Angle): number{
        if(angle.unit === ANGLE_UNIT.DEGREES){
            return Math.cos(angle.value * Math.PI / 180)
        }
        if(angle.unit === ANGLE_UNIT.RADIANS){
            return Math.cos(angle.value)
        }
        throw new Error('Could not compute cosinus of this angle: unit was not radians or degrees')
    }
    public static sum(a: Angle, b: Angle): Angle {
        return new Angle(a.value + Angle.transformToUnit(b, a.unit).value, a.unit);
    }
    public static multiply(a: Angle, factor: number): Angle {
        return new Angle(a.value * factor, a.unit);
    }

    public value: number;
    public unit: ANGLE_UNIT;
    constructor(value: number, unit: ANGLE_UNIT){
        this.value = value;
        this.unit = unit;
    }
    public sin(): number {
        return Angle.sin(this)
    }
    public cos(): number {
        return Angle.cos(this)
    }
}

export enum ANGLE_UNIT {
    DEGREES = 'degrees',
    RADIANS = 'radians'
}