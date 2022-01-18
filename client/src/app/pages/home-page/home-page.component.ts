import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { Page } from '../../constants/page.enum';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  public items: Array<MenuItem> = [
    {
      label: 'Logout',
      icon: 'pi pi-fw pi-logout',
      command: () => {
        this.logout();
      }
    },
  ];

  constructor(private authenticationService: AuthenticationService,
              private router: Router) {
  }

  ngOnInit(): void {
  }

  private logout(): void {
    this.authenticationService.logout();
    this.router.navigate([Page.Login]);
  }
}
