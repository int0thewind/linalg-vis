import { Shape } from './shape';
import * as math from 'mathjs';
import * as d3 from 'd3';

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

    transform(oldMatrix: math.Matrix, newMatrix: math.Matrix): void {
        // TODO implement this
    }

    render(target: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
           xScale: d3.ScaleLinear<number, number>, yScale: d3.ScaleLinear<number, number>): void {
            const ellipseGroup = target.append('g')
                .attr('class', this.class)
                .attr('id', this.id);
            ellipseGroup.append('ellipse')
                .attr('cx', this.cx)
                .attr('cy', this.cy)
                .attr('rx', this.rx)
                .attr('ry', this.ry)
                .style('fill', this.color);
    }
}
