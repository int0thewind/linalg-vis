import { Shape } from './shape';
import * as math from 'mathjs';
import * as d3 from 'd3';

export class Rectangle extends Shape {

    x: number;
    y: number;
    width: number;
    height: number;

    constructor(id: string, color: string, x: number, y: number, width: number, height: number) {
        super('rectangle', id, color);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    transform(oldMatrix: math.Matrix, newMatrix: math.Matrix): void {
        // TODO implement this!
    }

    render(target: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
           xScale: d3.ScaleLinear<number, number>, yScale: d3.ScaleLinear<number, number>): void {
        if (!document.getElementById(this.id)) {
            const rectGroup = target.append('g')
                .attr('class', this.class)
                .attr('id', this.id);
            rectGroup.append('line')
                .attr('x', xScale(this.x))
                .attr('y', yScale(this.y))
                .attr('width', this.width)
                .attr('height', this.height)
                .style('fill', this.color);
        }
    }
}