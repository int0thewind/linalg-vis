import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Matrix, matrix } from 'mathjs';
import { Shape } from './shape';

@Injectable({
  providedIn: 'root'
})
export class MatrixBoardDataService {
  private matrixSubject = new BehaviorSubject<Matrix>(matrix([[1, 0], [0, 1]]));

  private shapesSubject = new BehaviorSubject<Shape[]>([]);

  get matrixSource() {
    return this.matrixSubject.asObservable();
  }

  get shapesSource() {
    return this.shapesSubject.asObservable();
  }

  setMatrix(newMatrix: Matrix): void {
    console.assert(newMatrix !== null && newMatrix.size() === [2, 2]);
    this.matrixSubject.next(newMatrix);
  }

  setShapes(newShapes: Shape[]): void {
    this.shapesSubject.next(newShapes);
  }
}
