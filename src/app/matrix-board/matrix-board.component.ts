import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import * as math from 'mathjs';
import * as d3 from 'd3';
import { Shape } from '../shape';
import { Vector } from '../vector';

@Component({
  selector: 'app-matrix-board',
  templateUrl: './matrix-board.component.html',
  styleUrls: ['./matrix-board.component.css']
})
export class MatrixBoardComponent implements OnInit, OnChanges {

  mat = math.matrix([[1, 0], [0, 1]]);

  range = 15;

  maxRange = 50;

  margin = {top: 20, bottom: 20, right: 20, left: 20};

  xScale = d3.scaleLinear();

  yScale = d3.scaleLinear();

  listOfShape: Shape[] = [];

  xBaseVectorId = 'x-base-vector';

  yBaseVectorId = 'y-base-vector';

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
  }

  initCoordinate(): void {
    // Main variables
    const svg = d3.select('svg.board');
    const width = parseInt(svg.style('width'), 10);
    const height = parseInt(svg.style('height'), 10);
    // Update global xScale and yScale
    this.xScale.domain([-this.range, this.range]).range([this.margin.left, width - this.margin.right]);
    this.yScale.domain([-this.range, this.range]).range([height - this.margin.bottom, this.margin.top]);
    // Append two groups of xAxis and yAxis
    const xAxisGroup = svg.append('g').attr('class', 'xAxis').style('transform', `translate(0px, ${height / 2}px)`);
    const yAxisGroup = svg.append('g').attr('class', 'yAxis').style('transform', `translate(${width / 2}px, 0px)`);
    xAxisGroup.call(d3.axisTop(this.xScale));
    yAxisGroup.call(d3.axisLeft(this.yScale));
    // Hide the zero point on the axis
    document.querySelectorAll('g.tick > text').forEach((textElem) => {
      if (textElem.innerHTML === '0') {
        textElem.setAttribute('class', 'zero-tick');
        textElem.innerHTML = '';
      }
    });
    // Add the zero point onto the board
    svg.append('text')
      .attr('x', this.xScale(0) + 5)
      .attr('y', this.yScale(0) + 20)
      .style('font', '20px serif')
      .html('O');
    // Attach grid lines
    const gridLines = svg.append('g').attr('class', 'grid-line');
    for (let i = -this.range + this.range % 2; i <= this.range; i += 2) {
      gridLines.append('line')
        .attr('x1', this.xScale(i))
        .attr('y1', this.yScale(-this.range))
        .attr('x2', this.xScale(i))
        .attr('y2', this.yScale(this.range))
        .style('stroke', '#cccccc')
        .style('stroke-dasharray', `${this.maxRange / this.range}`);
      gridLines.append('line')
        .attr('x1', this.xScale(-this.range))
        .attr('y1', this.yScale(i))
        .attr('x2', this.xScale(this.range))
        .attr('y2', this.yScale(i))
        .style('stroke', '#cccccc')
        .style('stroke-dasharray', `${this.maxRange / this.range}`);
    }
  }

  updateCoordinate(): void {
    const xAxisGroup = document.querySelector('g.xAxis');
    const yAxisGroup = document.querySelector('g.yAxis');
    xAxisGroup.parentNode.removeChild(xAxisGroup);
    yAxisGroup.parentNode.removeChild(yAxisGroup);
    this.initCoordinate();
  }

  initBaseVectors(): void {
    const xBaseVector = new Vector(this.xBaseVectorId, 'red', 0, 0, this.mat.get([0, 0]), this.mat.get([0, 1]));
    const yBaseVector = new Vector(this.yBaseVectorId, 'blue', 0, 0, this.mat.get([1, 0]), this.mat.get([1, 1]));
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
      shape.render(svg, this.xScale, this.yScale);
    }
  }

  getDet(): number {
    return math.det(this.mat);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.range) {
      this.updateCoordinate();
    }
  }
}
