import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserInputValues } from '../../models/user-input-values.model';

@Component({
  selector: 'app-user-input',
  templateUrl: './user-input.component.html',
  styleUrls: ['./user-input.component.scss']
})
export class UserInputComponent implements OnInit {

  @Output() public onValuesSubmitted = new EventEmitter<UserInputValues>();

  @Input() public buttonCaption: string = '';

  public username: string = '';
  public password: string = '';

  constructor() {
  }

  ngOnInit(): void {
  }

  public submitValues(username: string, password: string): void {
    this.onValuesSubmitted.emit({username, password});
  }
}
