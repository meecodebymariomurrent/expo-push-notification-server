import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ImageModule } from 'primeng/image';
import { SettingsDialogComponent } from './settings-dialog.component';

@NgModule({
  declarations: [SettingsDialogComponent],
  exports: [SettingsDialogComponent],
  imports: [CommonModule, DialogModule, TranslateModule, ImageModule],
})
export class SettingsDialogModule {}
