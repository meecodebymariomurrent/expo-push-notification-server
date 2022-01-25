import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-main-menu-item',
  templateUrl: './main-menu-item.component.html',
  styleUrls: ['./main-menu-item.component.scss']
})
export class MainMenuItemComponent implements OnInit {

  @Input() caption: string = '';
  @Output() press: EventEmitter<any> = new EventEmitter<any>();

  constructor() {

  }

  public ngOnInit() {

  }

  public handleClick(): void {
    this.press.emit();
  }
}
