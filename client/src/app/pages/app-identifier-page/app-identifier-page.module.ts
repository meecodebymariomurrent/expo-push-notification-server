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
import { TabViewModule } from 'primeng/tabview';
import { SubscribersModule } from '../../components/subscribers/subscribers.module';
import { AppIdentifiersModule } from '../../components/appIdentifiers/app-identifiers.module';
import { FooterModule } from '../../components/footer/footer.module';
import { AboutDialogModule } from '../../components/dialogs/about-dialog/about-dialog.module';
import { MainMenuModule } from '../../components/main-menu/main-menu.module';
import { AppIdentifierPageComponent } from './app-identifier-page.component';

@NgModule({
  declarations: [AppIdentifierPageComponent],
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
    TabViewModule,
    SubscribersModule,
    AppIdentifiersModule,
    FooterModule,
    AboutDialogModule,
    MainMenuModule
  ],
})
export class AppIdentifierPageModule {
}
