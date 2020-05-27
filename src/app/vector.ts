import { Shape } from './shape';
import * as math from 'mathjs';
import * as d3 from 'd3';

export class Vector implements Shape {

    class = 'vector';

    id: string;

    color = 'red';

    x1 = 0;

    y1 = 0;

    x2 = 1;

    y2 = 1;

    constructor(id: string, color: string, x1?: number, y1?: number, x2?: number, y2?: number) {
        console.assert(document.getElementById(id) == null, `The id ${id} is already in use.`);
        this.id = id;
        this.color = color;
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

    remove(): void {
        if (document.getElementById(this.id)) {
            const element = document.getElementById(this.id);
            element.parentNode.removeChild(element);
        }
    }
}
