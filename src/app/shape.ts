import { Matrix } from 'mathjs';
import { Selection, ScaleLinear } from 'd3';

/**
 * A generic interface denoting a svg element to be attached onto the coordinate system.
 * This interface specifies what a shape must have.
 * In order to be attached onto the coordinate system, the object must implement this interface.
 */
export interface Shape {
    /**
     * Class attribute of the shape.
     * Conventionally, it should be the name of the shape.
     * For example, if the shape is a vector, then name the class to be "vector".
     */
    class: string;

    /**
     * An unique id that binds onto the shape.
     * WARNING! The id must be unique.
     * Constructor of the method must assert whether the id is not being used in the HTML.
     */
    id: string;

    /**
     * Transforming the location of the shape by the given old and new matrices.
     * @param oldMatrix the previous matrix that the object is binded onto.
     * @param newMatrix the new matrix that the shape should be transformed to.
     */
    transform(oldMatrix: Matrix, newMatrix: Matrix): void;

    /**
     * Calling this function to render the shape to the target.
     * @see d3.Selection
     * @param target the target place to render shape onto it.
     * @param xScale the xScale to transform relative coordinate to absolute position
     * @param yScale the yScale to transform relative coordinate to absolute position
     */
    render(target: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
           xScale: ScaleLinear<number, number>, yScale: ScaleLinear<number, number>): void;

    /**
     * Calling this function to remove the shape on the coordinate.
     * WARNING! This function must check whether the shape is on the board beforehand.
     */
    remove(): void;
}
