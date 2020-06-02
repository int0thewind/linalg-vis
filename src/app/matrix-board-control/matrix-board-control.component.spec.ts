import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrixBoardControlComponent } from './matrix-board-control.component';

describe('MatrixBoardControlComponent', () => {
  let component: MatrixBoardControlComponent;
  let fixture: ComponentFixture<MatrixBoardControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatrixBoardControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatrixBoardControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
