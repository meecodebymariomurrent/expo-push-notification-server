import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import packageInfo from '../../../../package.json';
import { UserInputValues } from '../../models/user-input-values.model';
import { Message, MessageService } from 'primeng/api';
import { MessageSeverity } from '../../constants/primeng/message-severity.enum';
import { UserService } from '../../services/user.service';
import { Page } from '../../constants/page.enum';
import { sha256 } from 'js-sha256';
import { NGXLogger } from 'ngx-logger';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RegisterPageComponent implements OnInit {

  public appVersion: string = packageInfo.version;

  constructor(private messageService: MessageService,
              private userService: UserService,
              private translateService: TranslateService,
              private logger: NGXLogger,
              private router: Router) {
  }

  ngOnInit(): void {
  }

  public async register(data: UserInputValues): Promise<void> {
    try {
      await this.userService.create(data.username, sha256(data.password));
      this.messageService.clear();
      this.messageService.add({
        key: 'registered-message',
        sticky: true,
        severity: 'success',
        summary: this.translateService.instant('Register.AccountCreated'),
        detail: this.translateService.instant('Register.GoToLogin')
      });
    } catch (e) {
      const message: Message = {severity: MessageSeverity.Error, summary: 'Error while registering user'};
      this.messageService.add(message);
      this.logger.error('Unable to Register!\n', e);
    }
  }

  public navigateTo(url?: string) {
    url = url || '';
    this.router.navigate([url], {replaceUrl: true}).catch(console.error);
  }

  public onReject(): void {
    this.messageService.clear('c');
  }

  public onConfirm(): void {
    this.messageService.clear('c');
    this.navigateTo(Page.Login);
  }
}
