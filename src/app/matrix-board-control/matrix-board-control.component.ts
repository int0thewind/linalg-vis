import { Component, OnInit } from '@angular/core';
import { Shape, Vector, Dot, Ellipse, Rectangle, Polygon } from '../shape';
import { Matrix, det, eigs, matrix } from 'mathjs';
import { MatrixBoardDataService } from '../matrix-board-data.service';

export type shapeStr = 'Vector' | 'Dot' | 'Ellipse' | 'Rectangle' | 'Polygon';

@Component({
  selector: 'app-matrix-board-control',
  templateUrl: './matrix-board-control.component.html',
  styleUrls: ['./matrix-board-control.component.css']
})
export class MatrixBoardControlComponent implements OnInit {

  objectKeys = Object.keys; // alias of object keys to retrieve an key of an object;

  matrix: Matrix;

  shapeList: Shape[];

  currType: shapeStr = 'Vector';

  readonly acceptedShapes = {
    Vector,
    Dot,
    Ellipse,
    Rectangle,
    Polygon,
  };

  constructor(private data: MatrixBoardDataService) { }

  ngOnInit(): void {
    this.initDataSubscribe();
    this.getMatEigs();
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
  }

  getMatDet(): number {
    return det(this.matrix);
  }

  getMatElem(row: number, column: number): number {
    return this.matrix.get([column, row]);
  }

  getMatEigs() {
    return eigs(this.matrix);
  }

  updateMatrix(r1c1: any, r1c2: any, r2c1: any, r2c2: any) {
    const mat = matrix([[parseFloat(r1c1), parseFloat(r1c2)],
                        [parseFloat(r2c1), parseFloat(r2c2)]]);
    console.log(mat);
    console.log(mat.size());
    this.data.setMatrix(mat);
  }

}
