import { Component, Input, OnInit } from '@angular/core';
import { AppIdentifier } from '../../models/app-identifier.model';

@Component({
  selector: 'app-app-identifiers',
  templateUrl: './app-identifiers.component.html',
  styleUrls: ['./app-identifiers.component.scss']
})
export class AppIdentifiersComponent implements OnInit {

  @Input() public appIdentifiers: Array<AppIdentifier> = new Array<AppIdentifier>();

  public selectedAppIdentifier: Array<AppIdentifier> = new Array<AppIdentifier>();

  constructor() {
  }

  ngOnInit(): void {
  }

  public deleteSelectedAppIdentifier(): void {

  }

  public createAppIdentifier():void{

  }

}
