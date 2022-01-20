import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { SubscribersComponent } from './subscribers.component';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { RippleModule } from 'primeng/ripple';
import { DialogModule } from 'primeng/dialog';

@NgModule({
  declarations: [SubscribersComponent],
  exports: [SubscribersComponent],
    imports: [
        CommonModule,
        InputTextModule,
        TranslateModule,
        ButtonModule,
        FormsModule,
        TableModule,
        ToolbarModule,
        RippleModule,
        DialogModule,
    ],
})
export class SubscribersModule {
}
