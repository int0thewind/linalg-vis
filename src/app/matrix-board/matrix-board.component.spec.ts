import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrixBoardComponent } from './matrix-board.component';

describe('MatrixBoardComponent', () => {
  let component: MatrixBoardComponent;
  let fixture: ComponentFixture<MatrixBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatrixBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatrixBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
