import { Component, OnInit } from '@angular/core';
import { Shape, Vector, Dot, Ellipse, Rectangle, Polygon } from '../shape';
import { Matrix, det, eigs, matrix, zeros } from 'mathjs';
import { MatrixBoardDataService } from '../matrix-board-data.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-matrix-board-control',
  templateUrl: './matrix-board-control.component.html',
  styleUrls: ['./matrix-board-control.component.css']
})
export class MatrixBoardControlComponent implements OnInit {
  matrix: Matrix;

  shapeList: Shape[];

  readonly acceptedShapes = ['Vector', 'Dot', 'Ellipse', 'Rectangle', 'Polygon'];

  currType = 'Vector';

  xScale = d3.scaleLinear();

  yScale = d3.scaleLinear();

  constructor(private data: MatrixBoardDataService) { }

  ngOnInit(): void {
    this.initDataSubscribe();
  }

  initDataSubscribe(): void {
    this.data.matrixSource.subscribe((newMatrix) => {
      console.log('Matrix Board Control: receives new matrix data');
      this.matrix = newMatrix;
    });
    this.data.shapesSource.subscribe((newListOfShape) => {
      console.log('Matrix Board Control: receives new shape list');
      this.shapeList = newListOfShape;
    });
    this.data.xScaleSource.subscribe((newXScale) => {
      console.log('Matrix Board Control: receives new x Scale');
      this.xScale = newXScale;
    });
    this.data.yScaleSource.subscribe((newYScale) => {
      console.log('Matrix Board Control: receives new y Scale');
      this.yScale = newYScale;
    });
  }

  getMatDet(): number {
    console.log('Matrix Board Control: getting matrix determinant');
    return det(this.matrix);
  }

  getMatRank(): number {
    console.log('Matrix Board Control: getting matrix rank');
    if (this.getMatDet() !== 0) {
      return 2;
    }
    if (this.matrix.toArray().toString() === '0,0,0,0') {
      return 0;
    }
    return 1;
  }

  getMatElem(row: number, column: number): number {
    console.log(`Matrix Board Control: getting matrix row ${row} and column ${column}`);
    return this.matrix.get([row, column]);
  }

  getMatEigs() {
    console.log('Matrix Board Control: getting matrix eigen info');
    return eigs(this.matrix);
  }

  updateMatrix(r1c1: any, r1c2: any, r2c1: any, r2c2: any) {
    console.log('Matrix Board Control: updating matrix');
    const mat = matrix([[parseFloat(r1c1), parseFloat(r1c2)],
                        [parseFloat(r2c1), parseFloat(r2c2)]]);
    this.data.setMatrix(mat);
  }
}
