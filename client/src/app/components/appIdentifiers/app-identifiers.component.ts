import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppIdentifier } from '../../models/app-identifier.model';
import { AppIdentifierService } from '../../services/app-identifier.service';
import { Message, MessageService } from 'primeng/api';
import { NGXLogger } from 'ngx-logger';
import { MessageSeverity } from '../../constants/primeng/message-severity.enum';

@Component({
  selector: 'app-app-identifiers',
  templateUrl: './app-identifiers.component.html',
  styleUrls: ['./app-identifiers.component.scss']
})
export class AppIdentifiersComponent implements OnInit {

  @Input() public appIdentifiers: Array<AppIdentifier> = new Array<AppIdentifier>();
  @Output() public appIdentifierSaved: EventEmitter<void> = new EventEmitter<void>();
  @Output() public deleteAppIdentifier: EventEmitter<Array<AppIdentifier>> = new EventEmitter<Array<AppIdentifier>>();

  public selectedAppIdentifier: Array<AppIdentifier> = new Array<AppIdentifier>();
  public appIdentifierDialogVisible: boolean = false;
  public appIdentifier: AppIdentifier = {} as AppIdentifier;

  constructor(private appIdentifierService: AppIdentifierService,
              private messageService: MessageService,
              private logger: NGXLogger) {

  }


  ngOnInit(): void {
  }

  public deleteSelectedAppIdentifier(): void {
    this.deleteAppIdentifier.emit(this.selectedAppIdentifier);
    this.selectedAppIdentifier = new Array<AppIdentifier>();
  }

  public createAppIdentifier(): void {
    this.appIdentifierDialogVisible = true;
  }

  public closeDialog(): void {
    this.appIdentifierDialogVisible = false;
  }

  public handleSaveAppIdentifier(): void {
    this.appIdentifierService.create(this.appIdentifier).then(() => {
      this.appIdentifierSaved.emit();
      this.closeDialog();
    }).catch((error) => {
      const message: Message = {severity: MessageSeverity.Error, summary: 'Error while creating an app identifier'};
      this.messageService.add(message);
      this.logger.error('Error while creating an app identifier', error);
    });
  }
}
