import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserInputComponent } from './user-input.component';
import { InputTextModule } from 'primeng/inputtext';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [UserInputComponent],
  exports: [UserInputComponent],
  imports: [
    CommonModule,
    InputTextModule,
    TranslateModule,
    ButtonModule,
    FormsModule,
  ],
})
export class UserInputModule {
}
