import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppIdentifier } from '../../models/app-identifier.model';

@Component({
  selector: 'app-app-identifiers',
  templateUrl: './app-identifiers.component.html',
  styleUrls: ['./app-identifiers.component.scss']
})
export class AppIdentifiersComponent implements OnInit {

  @Input() public appIdentifiers: Array<AppIdentifier> = new Array<AppIdentifier>();
  @Output() public saveAppIdentifier: EventEmitter<AppIdentifier> = new EventEmitter<AppIdentifier>();

  public selectedAppIdentifier: Array<AppIdentifier> = new Array<AppIdentifier>();
  public appIdentifierDialogVisible: boolean = false;
  public appIdentifier: AppIdentifier = {} as AppIdentifier;

  constructor() {
  }

  ngOnInit(): void {
  }

  public deleteSelectedAppIdentifier(): void {

  }

  public deleteAppIdentifier(): void {

  }

  public createAppIdentifier(): void {
    this.appIdentifierDialogVisible = true;
  }

  public closeDialog(): void {
    this.appIdentifierDialogVisible = false;
  }

  public handleSaveAppIdentifier(): void {
    this.saveAppIdentifier.emit(this.appIdentifier);
  }
}
