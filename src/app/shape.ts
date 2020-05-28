import { Matrix } from 'mathjs';
import { ScaleLinear } from 'd3';

/**
 * A generic interface denoting a svg element to be attached onto the coordinate system.
 * This interface specifies what a shape must have.
 * In order to be attached onto the coordinate system, the object must implement this interface.
 */
export abstract class Shape {
    /**
     * Class attribute of the shape.
     * Conventionally, it should be the name of the shape.
     * For example, if the shape is a vector, then name the class to be "vector".
     */
    class: string;

    /**
     * An unique id that binds onto the shape.
     * Constructor of the method must assert whether the id is not being used in the HTML.
     */
    id: string;

    /**
     * Color of the shape.
     * It could be applied to line's stroke, or the fill of  concreate shape.
     */
    color: string;

    /**
     * Constructor of the base abstract class
     * @param cls the html class attribute to be applied onto the SVG group html tag
     * @param id the html id attribute to be applied onto the SVG group html tag. The id must be unique.
     * @param color the color of the shape
     */
    constructor(cls: string, id: string, color: string) {
        console.assert(!document.getElementById(id), `The id "${id}" is already in use.`);
        this.class = cls;
        this.id = id;
        this.color = color;
    }

    /**
     * Transforming the location of the shape by the given old and new matrices.
     * Empty function to be overridden.
     * @param oldMatrix the previous matrix that the object is binded onto.
     * @param newMatrix the new matrix that the shape should be transformed to.
     */
    abstract transform(oldMatrix: Matrix, newMatrix: Matrix): void;

    /**
     * Calling this function to render the shape to the target.
     * @see d3.Selection
     * @param target the target place to render shape onto it.
     * @param xScale the xScale to transform relative coordinate to absolute position
     * @param yScale the yScale to transform relative coordinate to absolute position
     */
    abstract render(target: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
                    xScale: ScaleLinear<number, number>, yScale: ScaleLinear<number, number>): void;

    /**
     * Calling this function to remove the shape on the coordinate.
     */
    remove(): void {
        if (document.getElementById(this.id)) {
            const elem = document.getElementById(this.id);
            elem.parentNode.removeChild(elem);
        }
    }
}
