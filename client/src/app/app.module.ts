import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { HttpConfigInterceptor } from './services/http/interceptor.service';
import { RegisterPageModule } from './pages/register-page/register-page.module';
import { LoginPageModule } from './pages/login-page/login-page.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomePageModule } from './pages/home-page/home-page.module';
import { lastValueFrom } from 'rxjs';
import { AppIdentifierPageModule } from './pages/app-identifier-page/app-identifier-page.module';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { LogoModule } from './components/logo/logo.module';
import { MainMenuModule } from './components/main-menu/main-menu.module';
import { FooterModule } from './components/footer/footer.module';
import { AboutDialogModule } from './components/dialogs/about-dialog/about-dialog.module';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RegisterPageModule,
    AppIdentifierPageModule,
    LoginPageModule,
    HomePageModule,
    LoggerModule.forRoot({level: NgxLoggerLevel.DEBUG, serverLogLevel: NgxLoggerLevel.ERROR}),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    ToastModule,
    ToolbarModule,
    LogoModule,
    MainMenuModule,
    FooterModule,
    AboutDialogModule,
    MenuModule,
    ButtonModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpConfigInterceptor,
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      deps: [TranslateService],
      multi: true
    },
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function appInitializerFactory(translate: TranslateService) {
  return () => {
    translate.addLangs(['en']);
    translate.setDefaultLang('en');
    translate.use('en');
    return lastValueFrom(translate.use('en'));
  };
}
