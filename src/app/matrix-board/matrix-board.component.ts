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

  isInit = false;

  constructor(private data: MatrixBoardDataService) {}

  ngOnInit(): void {
    this.initDataSubscribe();
    this.initCoordinate();
    this.initOrUpdateBaseVectors();
    this.initOrUpdateShapes();
    this.isInit = true;
  }

  initDataSubscribe(): void {
    this.data.matrixSource.subscribe((newMatrix) => {
      console.log('Matrix Board: receives new matrix data');
      this.matrix = newMatrix;
      if (this.isInit) {
        this.initOrUpdateBaseVectors();
        this.initOrUpdateShapes();
      }
    });
    this.data.shapesSource.subscribe((newListOfShape) => {
      console.log('Matrix Board: receives new shape list');
      this.shapeList = newListOfShape;
      if (this.isInit) {
        this.initOrUpdateShapes();
      }
    });
    this.data.xScaleSource.subscribe((newXScale) => {
      console.log('Matrix Board: receives new x Scale');
      this.xScale = newXScale;
      if (this.isInit) {
        this.initOrUpdateBaseVectors();
        this.initOrUpdateShapes();
      }
    });
    this.data.yScaleSource.subscribe((newYScale) => {
      console.log('Matrix Board: receives new y Scale');
      this.yScale = newYScale;
      if (this.isInit) {
        this.initOrUpdateBaseVectors();
        this.initOrUpdateShapes();
      }
    });
  }

  initCoordinate(): void {
    // Main variables
    const svg = d3.select('svg.board');
    const width = parseInt(svg.style('width'), 10);
    const height = parseInt(svg.style('height'), 10);
    // Update global xScale and yScale
    // Observables are so great!
    // I thought I can never get the new xScale and yScale before rendering the shape, but it just works!
    this.data.setXScale(d3.scaleLinear().domain([-this.range, this.range]).range([this.margin.left, width - this.margin.right]));
    this.data.setYScale(d3.scaleLinear().domain([-this.range, this.range]).range([height - this.margin.bottom, this.margin.top]));
    // All the groups under the svg
    const axisGroup = d3.select('g.axis');
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

  /**
   * This function can also update the base vectors when the base vectors are already rendered.
   */
  initOrUpdateBaseVectors(): void {
    console.log('Matrix Board: rendering base vectors!');
    const baseVectorGroup = d3.select('g.base-vector');
    this.baseVectors.forEach((vector) => {
      if (document.getElementById(vector.id)) {
        vector.remove();
      }
      vector.render(baseVectorGroup, this.matrix, this.xScale, this.yScale);
    });
  }

  initOrUpdateShapes(): void {
    console.log('Matrix Board: rendering shapes!');
    const target = d3.select('g.shape');
    this.shapeList.forEach((elem) => {
      if (document.getElementById(elem.id)) {
        console.log('%c Item found! Remove it!', 'color: green');
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
