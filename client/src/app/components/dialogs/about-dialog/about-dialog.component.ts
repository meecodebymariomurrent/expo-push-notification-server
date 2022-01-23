import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import packageInfo from '../../../../../package.json';

@Component({
  selector: 'app-about-dialog',
  templateUrl: './about-dialog.component.html',
  styleUrls: ['./about-dialog.component.scss']
})
export class AboutDialogComponent implements OnInit {

  @Input() public display = false;
  @Output() public closeDialog = new EventEmitter<void>();

  public appVersion = packageInfo.version;
  public copyRight = 'Copyright (c) 2022 MeeCode by Mario Murrent';

  constructor() {
  }

  ngOnInit(): void {
  }

  public handleDialogClose(): void {
    this.closeDialog.emit();
  }
}
