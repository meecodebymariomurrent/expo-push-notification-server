import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Page } from './constants/page.enum';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { AuthGuard } from './guards/auth.guard';
import { AppIdentifierPageComponent } from './pages/app-identifier-page/app-identifier-page.component';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';

const routes: Routes = [
  {
    path: Page.Login,
    component: LoginPageComponent
  },
  {
    path: Page.Home,
    component: HomePageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: Page.AppIdentifier,
    component: AppIdentifierPageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: Page.Settings,
    component: SettingsPageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: Page.Register,
    component: RegisterPageComponent
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
