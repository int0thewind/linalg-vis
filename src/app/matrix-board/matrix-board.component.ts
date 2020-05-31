import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import * as math from 'mathjs';
import * as d3 from 'd3';
import { Shape, Vector } from '../shape';

@Component({
  selector: 'app-matrix-board',
  templateUrl: './matrix-board.component.html',
  styleUrls: ['./matrix-board.component.css']
})
export class MatrixBoardComponent implements OnInit, OnChanges {

  mat = math.matrix([[1, 0], [0, 1]]);

  range = 15;

  readonly maxRange = 50;

  readonly margin = {top: 20, bottom: 20, right: 20, left: 20};

  xScale = d3.scaleLinear();

  yScale = d3.scaleLinear();

  listOfShape: Shape[] = [];

  shapeClass = 'shape';

  readonly xBaseVectorId = 'x-base-vector';

  readonly yBaseVectorId = 'y-base-vector';

  constructor() {}

  ngOnInit(): void {
    this.initSVG();
    this.initCoordinate();
    this.initBaseVectors();
  }

  initSVG(): void {
    const svg = d3.select('svg.board');
    const width = parseInt(svg.style('width'), 10);
    const height = parseInt(svg.style('height'), 10);
    svg.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', width)
      .attr('height', height)
      .style('fill', 'white');
    svg.append('g').attr('class', this.shapeClass);
  }

  initCoordinate(): void {
    // Main variables
    const svg = d3.select('svg.board');
    const width = parseInt(svg.style('width'), 10);
    const height = parseInt(svg.style('height'), 10);
    // Update global xScale and yScale
    this.xScale.domain([-this.range, this.range]).range([this.margin.left, width - this.margin.right]);
    this.yScale.domain([-this.range, this.range]).range([height - this.margin.bottom, this.margin.top]);
    // All the groups under the svg
    const axisGroup = svg.append('g').attr('class', 'axis');
    const xAxisGroup = axisGroup.append('g').attr('class', 'xAxis').style('transform', `translate(0px, ${height / 2}px)`);
    const yAxisGroup = axisGroup.append('g').attr('class', 'yAxis').style('transform', `translate(${width / 2}px, 0px)`);
    // Call scales to append axises.
    xAxisGroup.call(d3.axisTop(this.xScale));
    yAxisGroup.call(d3.axisLeft(this.yScale));
    // Attach grid lines
    const dashArray = this.maxRange / this.range;
    for (let i = -this.range + this.range % 2; i <= this.range; i += 2) {
      xAxisGroup.append('line')
        .attr('x1', this.xScale(i))
        .attr('y1', this.yScale(-this.range))
        .attr('x2', this.xScale(i))
        .attr('y2', this.yScale(this.range))
        .style('stroke', '#cccccc')
        .style('stroke-dasharray', dashArray);
      yAxisGroup.append('line')
        .attr('x1', this.xScale(-this.range))
        .attr('y1', this.yScale(i))
        .attr('x2', this.xScale(this.range))
        .attr('y2', this.yScale(i))
        .style('stroke', '#cccccc')
        .style('stroke-dasharray', dashArray);
    }
    // Modify zero points
    document.querySelectorAll('g.tick > text').forEach((textElem) => {
      if (textElem.innerHTML === '0') {
        textElem.setAttribute('class', 'zero-tick');
        textElem.innerHTML = '';
      }
    });
    axisGroup.append('circle')
      .attr('cx', this.xScale(0))
      .attr('cy', this.yScale(0))
      .attr('r', 3)
      .style('fill', 'black');
  }

  initBaseVectors(): void {
    const xBaseVector = new Vector(this.xBaseVectorId, 'red', 0, 0, 1, 0);
    const yBaseVector = new Vector(this.yBaseVectorId, 'blue', 0, 0, 0, 1);
    this.listOfShape.push(xBaseVector);
    this.listOfShape.push(yBaseVector);
    this.renderShapes();
  }

  removeBaseVectors(): void {
    this.removeShape(this.xBaseVectorId);
    this.removeShape(this.yBaseVectorId);
  }

  removeShape(id: string): void {
    this.listOfShape = this.listOfShape.filter((shape) => {
      if (shape.id === id) {
        shape.remove();
      }
      return shape.id !== id;
    });
  }

  renderShapes(): void {
    const svg = d3.select('svg.board');
    for (const shape of this.listOfShape) {
      shape.render(svg, this.mat, this.xScale, this.yScale);
    }
  }

  getMatDet(): number {
    return math.det(this.mat);
  }

  getMatElem(row: number, column: number): number {
    return this.mat.get([column, row]);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(`Property changed!\n${changes}.`);
  }
}
