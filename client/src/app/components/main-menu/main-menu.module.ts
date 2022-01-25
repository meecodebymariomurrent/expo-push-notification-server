import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainMenuComponent } from './main-menu.component';
import { MainMenuItemComponent } from './main-menu-item/main-menu-item.component';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [MainMenuComponent, MainMenuItemComponent],
  exports: [MainMenuComponent, MainMenuItemComponent],
  imports: [CommonModule, RippleModule, ButtonModule, TranslateModule],
})
export class MainMenuModule {}
