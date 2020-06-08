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

    class: string;

    id: string;

    color: string;

    protected constructor(cls: string, id: string, color: string) {
        console.assert(!document.getElementById(id), `The id "${id}" is already in use.`);
        this.class = cls;
        this.id = id;
        this.color = color;
    }

    abstract render(target: d3.Selection<d3.BaseType, unknown, HTMLElement, any>, matrix: math.Matrix, clickCallback: () => void,
                    xScale: d3.ScaleLinear<number, number>, yScale: d3.ScaleLinear<number, number>): void;

    remove(): void {
        d3.select(`#${this.id}`).remove();
    }

    toString(): string {
        return `${this.class}\n id ${this.id}.`;
    }

    protected mouseoverFunc = () => {
        console.log('mouseover!!!' + this.toString());
        const tip = d3.select('div.tip');
        tip.html(this.toString())
            .style('opacity', 0.9)
            .style('left', d3.event.pageX + 'px')
            .style('top', (d3.event.pageY - 28) + 'px');
    }

    protected mouseoutFunc = () => {
        console.log('mouseout!!!');
        const tip = d3.select('div.tip');
        tip.style('opacity', 0);
    }
}

export class Polygon extends Shape {
    points: Point[];

    constructor(id: string, color: string, points: Point[]) {
        super('polygon', id, color);
        console.assert(points !== null && points.length >= 2, `Your input points for the polygon ${id} is invalid.`);
        this.points = points;
    }

    render(target: d3.Selection<d3.BaseType, unknown, HTMLElement, any>, matrix: math.Matrix, clickCallback: () => void,
           xScale: d3.ScaleLinear<number, number>, yScale: d3.ScaleLinear<number, number>): void {
        const pointsString = this.getPointsString(matrix, xScale, yScale);
        console.log(`%c ${pointsString}`, `color: orange`);
        const polyGroup = target.append('g')
            .attr('class', this.class)
            .attr('id', this.id);
        polyGroup.append('polygon')
            .attr('points', pointsString)
            .style('fill', this.color)
            .on('click', clickCallback)
            .on('mouseover', this.mouseoverFunc)
            .on('mouseout', this.mouseoutFunc);
    }

    getPointsString(matrix: math.Matrix, xScale: d3.ScaleLinear<number, number>, yScale: d3.ScaleLinear<number, number>): string {
        let pointsString = '';
        for (const point of this.points) {
            const p = math.multiply(matrix, point.toArray()).toArray();
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

    render(target: d3.Selection<d3.BaseType, unknown, HTMLElement, any>, matrix: math.Matrix, clickCallback: () => void,
           xScale: d3.ScaleLinear<number, number>, yScale: d3.ScaleLinear<number, number>): void {
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
                .style('fill', this.color)
                .on('click', clickCallback)
                .on('mouseover', this.mouseoverFunc)
                .on('mouseout', this.mouseoutFunc);
    }
}

export class Dot extends Shape {
    constructor(id: string, color: string, public x: number, public y: number) {
        super('dot', id, color);
    }
    render(target: d3.Selection<d3.BaseType, unknown, HTMLElement, any>, matrix: math.Matrix, clickCallback: () => void,
           xScale: d3.ScaleLinear<number, number>, yScale: d3.ScaleLinear<number, number>): void {
        const p = math.multiply(matrix, [this.x, this.y]).toArray();
        const dotGroup = target.append('g')
            .attr('class', this.class)
            .attr('id', this.id);
        dotGroup.append('circle')
            .attr('cx', xScale(p[0]))
            .attr('cy', yScale(p[1]))
            .attr('r', 3)
            .style('fill', this.color)
            .on('click', clickCallback)
            .on('mouseover', this.mouseoverFunc)
            .on('mouseout', this.mouseoutFunc);
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

    render(target: d3.Selection<d3.BaseType, unknown, HTMLElement, any>, matrix: math.Matrix, clickCallback: () => void,
           xScale: d3.ScaleLinear<number, number>, yScale: d3.ScaleLinear<number, number>): void{
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
            .style('stroke-width', 2)
            .on('click', clickCallback)
            .on('mouseover', this.mouseoverFunc)
            .on('mouseout', this.mouseoutFunc);
        vectorGroup.append('circle')
            .attr('cx', xScale(p2[0]))
            .attr('cy', yScale(p2[1]))
            .attr('r', 3)
            .style('stroke', this.color)
            .style('fill', this.color)
            .on('click', clickCallback)
            .on('mouseover', this.mouseoverFunc)
            .on('mouseout', this.mouseoutFunc);
    }
}
