import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Matrix, matrix } from 'mathjs';
import { Shape } from './shape';
import * as d3 from 'd3';

@Injectable({
  providedIn: 'root'
})
export class MatrixBoardDataService {
  private matrixSubject = new BehaviorSubject<Matrix>(matrix([[1, 0], [0, 1]]));

  private shapesSubject = new BehaviorSubject<Shape[]>([]);

  private xScaleSubject = new BehaviorSubject<d3.ScaleLinear<number, number>>(d3.scaleLinear());

  private yScaleSubject = new BehaviorSubject<d3.ScaleLinear<number, number>>(d3.scaleLinear());

  public matrixSource = this.matrixSubject.asObservable();

  public shapesSource = this.shapesSubject.asObservable();

  public xScaleSource = this.xScaleSubject.asObservable();

  public yScaleSource = this.yScaleSubject.asObservable();

  setMatrix(newMatrix: Matrix): void {
    this.matrixSubject.next(newMatrix);
  }

  setShapes(newShapes: Shape[]): void {
    this.shapesSubject.next(newShapes);
  }

  setXScale(newXScale: d3.ScaleLinear<number, number>) {
    this.xScaleSubject.next(newXScale);
  }

  setYScale(newYScale: d3.ScaleLinear<number, number>) {
    this.yScaleSubject.next(newYScale);
  }
}
