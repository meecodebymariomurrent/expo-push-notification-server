import { Component, OnInit } from '@angular/core';
import { Page } from '../../constants/page.enum';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit {

  public page = Page;

  constructor(private router: Router) {
  }

  ngOnInit(): void {

  }

  public handleNavigate(page: Page): void {
    this.router.navigate([page]);
  }
}
