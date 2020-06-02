import { Component, OnInit, OnDestroy } from '@angular/core';
import { Shape, Vector, Dot, Ellipse, Rectangle, Polygon } from '../shape';
import { Matrix, det } from 'mathjs';
import { MatrixBoardDataService } from '../matrix-board-data.service';

@Component({
  selector: 'app-matrix-board-control',
  templateUrl: './matrix-board-control.component.html',
  styleUrls: ['./matrix-board-control.component.css']
})
export class MatrixBoardControlComponent implements OnInit, OnDestroy {

  matrix: Matrix;

  listOfShape: Shape[] = [];

  currentSelectedShape = '';

  currentSelectedShapeType: 'Vector' | 'Dot' | 'Ellipse' | 'Rectangle' | 'Polygon' = 'Vector';

  readonly acceptedShapes = {
    Vector,
    Dot,
    Ellipse,
    Rectangle,
    Polygon,
  };

  constructor(private data: MatrixBoardDataService) { }

  ngOnDestroy(): void {
    this.destroyDataSubscribe();
  }

  ngOnInit(): void {
    this.initDataSubscribe();
  }

  initDataSubscribe(): void {
    this.data.matrixSource.subscribe(matrix => this.matrix = matrix);
    this.data.shapesSource.subscribe(listOfShape => this.listOfShape = listOfShape);
  }

  destroyDataSubscribe(): void {
    // this.data.matrixSource.unsubscribe();
    // this.data.shapesSource.unsubscribe();
  }

  getMatDet(): number {
    return det(this.matrix);
  }

  getMatElem(row: number, column: number): number {
    return this.matrix.get([column, row]);
  }

}
