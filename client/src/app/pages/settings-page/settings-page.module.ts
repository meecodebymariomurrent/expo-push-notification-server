import {  NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogoModule } from '../../components/logo/logo.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { TranslateModule } from '@ngx-translate/core';
import { ToolbarModule } from 'primeng/toolbar';
import { MenuModule } from 'primeng/menu';
import { SettingsPageComponent } from './settings-page.component';

@NgModule({
  declarations: [SettingsPageComponent],
  imports: [
    CommonModule,
    LogoModule,
    FlexLayoutModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    MessagesModule,
    MessageModule,
    ToastModule,
    TranslateModule,
    ToolbarModule,
    MenuModule,
  ],
})
export class SettingsPageModule {
}
