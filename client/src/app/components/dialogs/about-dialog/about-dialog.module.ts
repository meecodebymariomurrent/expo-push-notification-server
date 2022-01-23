import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutDialogComponent } from './about-dialog.component';
import { DialogModule } from 'primeng/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ImageModule } from 'primeng/image';

@NgModule({
  declarations: [AboutDialogComponent],
  exports: [AboutDialogComponent],
  imports: [CommonModule, DialogModule, TranslateModule, ImageModule],
})
export class AboutDialogModule {}
