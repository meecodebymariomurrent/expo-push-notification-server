import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogoComponent } from './logo.component';
import { ImageModule } from 'primeng/image';

@NgModule({
    declarations: [LogoComponent],
    exports: [LogoComponent],
    imports: [CommonModule, ImageModule],
})
export class LogoModule {}
