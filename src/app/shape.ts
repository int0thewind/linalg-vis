import * as math from 'mathjs';
import * as d3 from 'd3';

export class Point {
    x: number;
    y: number;
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    toArray(): number[] {
        return [this.x, this.y];
    }
}

/**
 * A generic abstract class denoting a svg shape to be attached onto the coordinate system.
 * The shape class only stores absolute points that cannot be modified!
 * This abstract class specifies what a shape must have in their class.
 * In order to be attached onto the coordinate system, the object must implement several necessary functionalities.
 */
export abstract class Shape {
    /**
     * DOM class attribute of the svg shape.
     * Conventionally, it should be the name of the shape.
     * For example, if the shape is a vector, then name the class to be "vector".
     */
    class: string;

    /**
     * Dom id attribute of the svg shape.
     * It must be unique! Constructor must assert it.
     */
    id: string;

    /**
     * Color of the shape.
     * It must be accepted as HTML DOM readdable color, like "red" or "rgba(0, 0, 0, 0)".
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
     * Calling this function to render the shape to the target.
     * @see d3.Selection
     * @param target the target place to render shape onto it.
     * @param xScale the xScale to transform relative coordinate to absolute position
     * @param yScale the yScale to transform relative coordinate to absolute position
     */
    abstract render(target: d3.Selection<d3.BaseType, unknown, HTMLElement, any>, matrix: math.Matrix,
                    xScale: d3.ScaleLinear<number, number>, yScale: d3.ScaleLinear<number, number>): void;

    /**
     * Calling this function to remove the shape on the coordinate system.
     */
    remove(): void {
        d3.select(`#${this.id}`).remove();
    }

    /**
     * Helper function to convert a point's relative position to absolute position.
     * @param matrix The target linear space to get the point transformed to.
     * @param point The point to be transformed.
     */
    transformPoints(matrix: math.Matrix, point: Point): Point {
        const p = math.multiply(matrix, point.toArray()).toArray();
        return new Point(p[0], p[1]);
    }
}

export class Polygon extends Shape {
    points: Point[];

    constructor(id: string, color: string, points: Point[]) {
        super('polygon', id, color);
        console.assert(points !== null || points.length >= 2, `Your input points for the polygon ${id} is invalid.`);
        this.points = points;
    }

    render(target: d3.Selection<d3.BaseType, unknown, HTMLElement, any>, matrix: math.Matrix,
           xScale: d3.ScaleLinear<number, number>, yScale: d3.ScaleLinear<number, number>): void {
        if (!document.getElementById(this.id)) {
            const pointsString = this.getPointsString(matrix, xScale, yScale);
            const polyGroup = target.append('g')
                .attr('class', this.class)
                .attr('id', this.id);
            polyGroup.append('polygon')
                .attr('points', pointsString)
                .style('fill', this.color);
        }
    }

    getPointsString(matrix: math.Matrix, xScale: d3.ScaleLinear<number, number>, yScale: d3.ScaleLinear<number, number>): string {
        let pointsString = '';
        for (const point of this.points) {
            const p = this.transformPoints(matrix, point);
            pointsString += `${xScale(p[0])},${yScale(p[1])} `;
        }
        return pointsString.trim();
    }
}

export class Rectangle extends Polygon {
    constructor(id: string, color: string, x: number, y: number, width: number, height: number) {
        const points = [new Point(x, y), new Point(x, y + height), new Point(x + width, y), new Point(x + width, y + height)];
        super(id, color, points);
        this.class = 'rectangle';
    }
}

export class Ellipse extends Shape {
    cx: number;
    cy: number;
    rx: number;
    ry: number;

    constructor(id: string, color: string, cx: number, cy: number, rx: number, ry: number) {
        super('ellipse', id, color);
        this.cx = cx;
        this.cy = cy;
        this.rx = rx;
        this.ry = ry;
    }

    render(target: d3.Selection<d3.BaseType, unknown, HTMLElement, any>, matrix: math.Matrix,
           xScale: d3.ScaleLinear<number, number>, yScale: d3.ScaleLinear<number, number>): void {
            if (!document.getElementById(this.id)) {
                const det = math.det(matrix);
                const rxn = this.rx * det;
                const ryn = this.ry * det;
                const p = math.multiply(matrix, [this.cx, this.cy]).toArray();

                const ellipseGroup = target.append('g')
                    .attr('class', this.class)
                    .attr('id', this.id);
                ellipseGroup.append('ellipse')
                    .attr('cx', xScale(p[0]))
                    .attr('cy', yScale(p[1]))
                    .attr('rx', rxn)
                    .attr('ry', ryn)
                    .style('fill', this.color);
            }
    }
}

export class Dot extends Shape {
    constructor(id: string, color: string, public x: number, public y: number) {
        super('dot', id, color);
    }
    render(target: d3.Selection<d3.BaseType, unknown, HTMLElement, any>, matrix: math.Matrix,
           xScale: d3.ScaleLinear<number, number>, yScale: d3.ScaleLinear<number, number>): void {
        if (!document.getElementById(this.id)) {
            const p = math.multiply(matrix, [this.x, this.y]).toArray();
            const dotGroup = target.append('g')
                .attr('class', this.class)
                .attr('id', this.id);
            dotGroup.append('circle')
                .attr('cx', xScale(p[0]))
                .attr('cy', yScale(p[1]))
                .attr('r', 3)
                .style('fill', this.color);
        }
    }
}

export class Vector extends Shape {
    x1: number;
    y1: number;
    x2: number;
    y2: number;

    constructor(id: string, color: string, x1: number, y1: number, x2: number, y2: number) {
        super('vector', id, color);
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    render(target: d3.Selection<d3.BaseType, unknown, HTMLElement, any>, matrix: math.Matrix,
           xScale: d3.ScaleLinear<number, number>, yScale: d3.ScaleLinear<number, number>): void{
        if (!document.getElementById(this.id)) {
            const vectorGroup = target.append('g')
                .attr('class', this.class)
                .attr('id', this.id);

            const p1 = math.multiply(matrix, [this.x1, this.y1]).toArray();
            const p2 = math.multiply(matrix, [this.x2, this.y2]).toArray();
            vectorGroup.append('line')
                .attr('x1', xScale(p1[0]))
                .attr('y1', yScale(p1[1]))
                .attr('x2', xScale(p2[0]))
                .attr('y2', yScale(p2[1]))
                .style('stroke', this.color)
                .style('stroke-width', 2);
            vectorGroup.append('circle')
                .attr('cx', xScale(p2[0]))
                .attr('cy', yScale(p2[1]))
                .attr('r', 3)
                .style('stroke', this.color)
                .style('fill', this.color);
        }
    }
}
