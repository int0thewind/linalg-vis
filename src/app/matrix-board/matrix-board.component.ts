import { Component, OnInit } from '@angular/core';
import { Matrix } from 'mathjs';
import * as d3 from 'd3';
import { Shape, Vector } from '../shape';
import { MatrixBoardDataService } from '../matrix-board-data.service';

@Component({
  selector: 'app-matrix-board',
  templateUrl: './matrix-board.component.html',
  styleUrls: ['./matrix-board.component.css'],
})
export class MatrixBoardComponent implements OnInit {

  readonly maxRange = 50;

  readonly margin = {top: 20, bottom: 20, right: 20, left: 20};

  readonly baseVectors = [
    new Vector('x-base-vector', 'red',  0, 0, 1, 0),
    new Vector('y-base-vector', 'blue', 0, 0, 0, 1),
  ];

  range = 15;

  xScale: d3.ScaleLinear<number, number>;

  yScale: d3.ScaleLinear<number, number>;

  shapeList: Shape[];

  matrix: Matrix;

  constructor(private data: MatrixBoardDataService) {}

  ngOnInit(): void {
    this.initDataSubscribe();
    this.initSVG();
    this.initCoordinate();
    this.renderShapes();
  }

  initDataSubscribe(): void {
    this.data.matrixSource.subscribe((newMatrix) => {
      console.log('Matrix Board: receives new matrix data');
      this.matrix = newMatrix;
    });
    this.data.shapesSource.subscribe((newListOfShape) => {
      console.log('Matrix Board: receives new shape list');
      this.shapeList = newListOfShape;
      this.renderShapes();
    });
    this.data.xScaleSource.subscribe((newXScale) => {
      console.log('Matrix Board: receives new x Scale');
      this.xScale = newXScale;
      // TODO! What to do after getting new x scale?
    });
    this.data.yScaleSource.subscribe((newYScale) => {
      console.log('Matrix Board: receives new y Scale');
      this.yScale = newYScale;
      // TODO! What to do after getting new y scale?
    });
  }

  initSVG(): void {
    const svg = d3.select('svg.board');
    const width = parseInt(svg.style('width'), 10);
    const height = parseInt(svg.style('height'), 10);
    svg.append('rect')
      .attr('id', 'canvas-background')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', width)
      .attr('height', height)
      .style('fill', 'white');
    svg.append('g').attr('class', 'shape');
  }

  initCoordinate(): void {
    // Main variables
    const svg = d3.select('svg.board');
    const width = parseInt(svg.style('width'), 10);
    const height = parseInt(svg.style('height'), 10);
    // Update global xScale and yScale
    // Observables are so great!
    // I thought I can never get the new xScale and yScale before rendering the shape, but it just works!
    // this.xScale.domain([-this.range, this.range]).range([this.margin.left, width - this.margin.right]);
    // this.yScale.domain([-this.range, this.range]).range([height - this.margin.bottom, this.margin.top]);
    this.data.setXScale(d3.scaleLinear().domain([-this.range, this.range]).range([this.margin.left, width - this.margin.right]));
    this.data.setYScale(d3.scaleLinear().domain([-this.range, this.range]).range([height - this.margin.bottom, this.margin.top]));
    // All the groups under the svg
    const axisGroup = svg.append('g').attr('class', 'axis');
    const xAxisGroup = axisGroup.append('g').attr('class', 'x-axis').style('transform', `translate(0px, ${height / 2}px)`);
    const yAxisGroup = axisGroup.append('g').attr('class', 'y-axis').style('transform', `translate(${width / 2}px, 0px)`);
    const gridLineGroup = axisGroup.append('g').attr('class', 'grid-line');
    const baseVectorGroup = axisGroup.append('g').attr('class', 'base-vector');
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
    // Init base vectors
    this.baseVectors.forEach((vector) => {
      if (document.getElementById(vector.id)) {
        vector.remove();
      }
      vector.render(baseVectorGroup, this.matrix, this.xScale, this.yScale);
    });
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

  renderShapes(): void {
    console.log('Matrix Board: rendering shapes!');
    const target = d3.select('g.shape');
    this.shapeList.forEach((elem) => {
      if (document.getElementById(elem.id)) {
        elem.remove();
      }
      elem.render(target, this.matrix, this.xScale, this.yScale);
    });
  }

  removeShape(id: string): void {
    console.log(`%c remove shape called! ${id} passed in`, 'color: green');
    this.data.setShapes(
      this.shapeList.filter((shape) => {
        if (shape.id === id) {
          shape.remove();
        }
        return shape.id !== id;
      })
    );
  }
}
