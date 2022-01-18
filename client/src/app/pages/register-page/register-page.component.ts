import { Component, OnInit } from '@angular/core';
import packageInfo from '../../../../package.json';
import { UserInputValues } from '../../models/user-input-values.model';
import { Message, MessageService } from 'primeng/api';
import { MessageSeverity } from '../../constants/primeng/message-severity.enum';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../services/user.service';
import { Page } from '../../constants/page.enum';
import { sha256 } from 'js-sha256';
import { NGXLogger } from 'ngx-logger';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit {

  public appVersion: string = packageInfo.version;

  constructor(private messageService: MessageService,
              private userService: UserService,
              private logger: NGXLogger,
              private router: Router,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
  }

  public async register(data: UserInputValues): Promise<void> {
    try {
      await this.userService.create(data.username, sha256(data.password));
      this.navigateTo(Page.Login);
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
}
