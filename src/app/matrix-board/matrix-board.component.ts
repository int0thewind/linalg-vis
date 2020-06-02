import { Component, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Matrix, det } from 'mathjs';
import * as d3 from 'd3';
import { Shape, Vector, Dot, Ellipse, Rectangle, Polygon } from '../shape';
import { MatrixBoardDataService } from '../matrix-board-data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-matrix-board',
  templateUrl: './matrix-board.component.html',
  styleUrls: ['./matrix-board.component.css'],
})
export class MatrixBoardComponent implements OnInit, OnChanges, OnDestroy {

  objectKeys = Object.keys; // alias of object keys to retrieve an key of an object;

  readonly maxRange = 50;

  readonly margin = {top: 20, bottom: 20, right: 20, left: 20};

  readonly shapeClass = 'shape';

  range = 15;

  xScale = d3.scaleLinear();

  yScale = d3.scaleLinear();

  baseVectors = [
    new Vector('x-base-vector', 'red',  0, 0, 1, 0),
    new Vector('y-base-vector', 'blue', 0, 0, 0, 1),
  ];

  listOfShape: Shape[] = [];

  shapesSubscription: Subscription;

  matrix: Matrix;

  matrixSubscription: Subscription;

  constructor(private data: MatrixBoardDataService) {}

  ngOnDestroy(): void {
    this.destroyDataSubscribe();
  }

  ngOnInit(): void {
    this.initSVG();
    this.initCoordinate();
    this.renderShapes();
  }

  initDataSubscribe(): void {
    // FIXME: cannot set initial values of matrix!
    this.matrixSubscription = this.data.matrixSource.subscribe(matrix => this.matrix = matrix);
    this.shapesSubscription = this.data.shapesSource.subscribe(listOfShape => this.listOfShape = listOfShape);
  }

  destroyDataSubscribe(): void {
    this.matrixSubscription.unsubscribe();
    this.shapesSubscription.unsubscribe();
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
    const xAxisGroup = axisGroup.append('g').attr('class', 'x-axis').style('transform', `translate(0px, ${height / 2}px)`);
    const yAxisGroup = axisGroup.append('g').attr('class', 'y-axis').style('transform', `translate(${width / 2}px, 0px)`);
    const gridLineGroup = axisGroup.append('g').attr('class', 'grid-line');
    // Call scales to append axises.
    xAxisGroup.call(d3.axisTop(this.xScale));
    yAxisGroup.call(d3.axisLeft(this.yScale));
    // Attach grid lines
    const dashArray = this.maxRange / this.range;
    for (let i = -this.range + this.range % 2; i <= this.range; i += 2) {
      gridLineGroup.append('line')
        .attr('x1', this.xScale(i))
        .attr('y1', this.yScale(-this.range))
        .attr('x2', this.xScale(i))
        .attr('y2', this.yScale(this.range))
        .style('stroke', '#cccccc')
        .style('stroke-dasharray', dashArray);
      gridLineGroup.append('line')
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

  removeShape(id: string): void {
    console.log(`%cremoveshape called! ${id} passed in`, 'color: green');
    this.listOfShape = this.listOfShape.filter((shape) => {
      if (shape.id === id) {
        shape.remove();
      }
      return shape.id !== id;
    });
  }

  renderShapes(): void {
    const svg = d3.select('svg.board');
    this.baseVectors.forEach(vector => vector.render(svg, this.matrix, this.xScale, this.yScale));
    this.listOfShape.forEach(elem => elem.render(svg, this.matrix, this.xScale, this.yScale));
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(`%cProperty changed!\n${changes}`, 'color: green');
  }
}
