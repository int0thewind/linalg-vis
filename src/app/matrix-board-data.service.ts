import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Matrix, matrix } from 'mathjs';
import { Shape } from './shape';

@Injectable({
  providedIn: 'root'
})
export class MatrixBoardDataService {
  private matrixSubject = new BehaviorSubject<Matrix>(matrix([[1, 0], [0, 1]]));

  private shapesSubject = new BehaviorSubject<Shape[]>([]);

  public matrixSource = this.matrixSubject.asObservable();

  public shapesSource = this.shapesSubject.asObservable();

  setMatrix(newMatrix: Matrix): void {
    this.matrixSubject.next(newMatrix);
  }

  setShapes(newShapes: Shape[]): void {
    this.shapesSubject.next(newShapes);
  }
}
