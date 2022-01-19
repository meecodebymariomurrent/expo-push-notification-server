import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { AppIdentifiersComponent } from './app-identifiers.component';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { RippleModule } from 'primeng/ripple';

@NgModule({
  declarations: [AppIdentifiersComponent],
  exports: [AppIdentifiersComponent],
  imports: [
    CommonModule,
    InputTextModule,
    TranslateModule,
    ButtonModule,
    FormsModule,
    TableModule,
    ToolbarModule,
    RippleModule,
  ],
})
export class AppIdentifiersModule {
}
