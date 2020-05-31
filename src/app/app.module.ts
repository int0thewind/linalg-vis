import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Imported for NgModel bindings for select.
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatrixBoardComponent } from './matrix-board/matrix-board.component';

@NgModule({
  declarations: [
    AppComponent,
    MatrixBoardComponent
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
