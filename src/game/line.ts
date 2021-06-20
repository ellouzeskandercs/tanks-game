import { Point } from "./point";
import { Vector } from "matter";


/* to do create an index file and a math folder */
export interface Line {
    point: Point;
    direction: Vector;
}