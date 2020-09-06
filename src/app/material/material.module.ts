import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatButtonModule } from '@angular/material/button'
import { MatListModule } from '@angular/material/list'
import { MatIconModule } from '@angular/material/icon'

const MaterialComponents = [MatButtonModule, MatListModule, MatIconModule]

@NgModule({
    imports: [MaterialComponents],
    exports: [MaterialComponents],
})
export class MaterialModule {}
