import { Shape } from './shape';
import * as math from 'mathjs';
import * as d3 from 'd3';

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

    transform(oldMatrix: math.Matrix, newMatrix: math.Matrix): void {
        // TODO implement this!
    }

    render(target: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
           xScale: d3.ScaleLinear<number, number>, yScale: d3.ScaleLinear<number, number>): void{
        if (!document.getElementById(this.id)) {
            const vectorGroup = target.append('g')
                .attr('class', this.class)
                .attr('id', this.id);
            vectorGroup.append('line')
                .attr('x1', xScale(this.x1))
                .attr('y1', yScale(this.y1))
                .attr('x2', xScale(this.x2))
                .attr('y2', yScale(this.y2))
                .style('stroke', this.color)
                .style('stroke-width', 2);
            vectorGroup.append('circle')
                .attr('cx', xScale(this.x2))
                .attr('cy', yScale(this.y2))
                .attr('r', '5')
                .style('stroke', this.color)
                .style('fill', this.color);
        }
    }
}
