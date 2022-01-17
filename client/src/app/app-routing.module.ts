import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/login-page/login-page.module').then(
        m => m.LoginPageModule,
      ),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home-page/home-page.module').then(
        m => m.HomePageModule,
      ),
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
