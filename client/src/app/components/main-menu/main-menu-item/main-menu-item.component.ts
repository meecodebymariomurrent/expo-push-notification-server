import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-menu-item',
  templateUrl: './main-menu-item.component.html',
  styleUrls: ['./main-menu-item.component.scss']
})
export class MainMenuItemComponent implements OnInit {

  @Input() caption: string = '';

  constructor() {

  }

  public ngOnInit() {

  }

}
