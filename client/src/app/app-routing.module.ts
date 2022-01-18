import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Page } from './constants/page.enum';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';


const routes: Routes = [
  {
    path: Page.Login,
    component: LoginPageComponent
  },
  {
    path: Page.Home,
    component: HomePageComponent
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
