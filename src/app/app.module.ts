import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { CellComponent } from './components/cell/cell.component'
import { BoardComponent } from './components/board/board.component'

@NgModule({
    declarations: [AppComponent, CellComponent, BoardComponent],
    imports: [BrowserModule, AppRoutingModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
