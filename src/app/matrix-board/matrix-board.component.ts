import { Component, OnInit } from '@angular/core';
import * as math from 'mathjs';
import * as d3 from 'd3';

@Component({
  selector: 'app-matrix-board',
  templateUrl: './matrix-board.component.html',
  styleUrls: ['./matrix-board.component.css']
})
export class MatrixBoardComponent implements OnInit {

  public mat = math.matrix([[1, 0], [0, 1]]);

  constructor() {}

  ngOnInit(): void {
    console.log(this.mat);
  }

  getDet(): number {
    return math.det(this.mat);
  }

}
