import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Imported for NgModel bindings for select.
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatrixBoardComponent } from './matrix-board/matrix-board.component';
import { MatrixBoardControlComponent } from './matrix-board-control/matrix-board-control.component';

@NgModule({
  declarations: [
    AppComponent,
    MatrixBoardComponent,
    MatrixBoardControlComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
