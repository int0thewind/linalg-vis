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

  range = 10;

  margin = {top: 20, bottom: 20, right: 20, left: 20};

  xScale: d3.ScaleLinear<number, number> = null;

  yScale: d3.ScaleLinear<number, number> = null;

  listOfShape: Shape[] = [];

  xBaseVectorId = 'x-base-vector';

  yBaseVectorId = 'y-base-vector';

  constructor() {}

  ngOnInit(): void {
    this.initCoordinate();
    this.initBaseVectors();
  }

  initCoordinate(): void {
    const svg = d3.select('svg.board');
    const width = parseInt(svg.style('width'), 10);
    const height = parseInt(svg.style('height'), 10);

    // Update global xScale and yScale
    this.xScale = d3.scaleLinear().domain([-this.range, this.range])
      .range([this.margin.left, width - this.margin.right]);
    this.yScale = d3.scaleLinear().domain([-this.range, this.range])
      .range([height - this.margin.bottom, this.margin.top]);

    const xAxisGroup = svg.append('g').attr('class', 'xAxis').style('transform', `translate(0px, ${height / 2}px)`);
    const yAxisGroup = svg.append('g').attr('class', 'yAxis').style('transform', `translate(${width / 2}px, 0px)`);
    xAxisGroup.call(d3.axisTop(this.xScale));
    yAxisGroup.call(d3.axisLeft(this.yScale));

    document.querySelectorAll('g.tick > text').forEach((textElem) => {
      if (textElem.innerHTML === '0') {
        // Dont know why angular complains about the style property. It is actually work.
        // textElem.style.visibility = 'hidden';
      }
    });
  }

  removeCoordinate(): void {
    // Remove the coordinate drawing
    const xAxisGroup = document.querySelector('g.xAxis');
    const yAxisGroup = document.querySelector('g.yAxis');
    xAxisGroup.parentNode.removeChild(xAxisGroup);
    yAxisGroup.parentNode.removeChild(yAxisGroup);
    // We do not reset the xScale and yScale here.
  }

  updateCoordinate(): void {
    this.removeCoordinate();
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
