import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import packageInfo from '../../../../package.json';
import { Router } from '@angular/router';
import { Message, MessageService } from 'primeng/api';
import { MessageSeverity } from '../../constants/primeng/message-severity.enum';
import { AuthenticationService } from '../../services/authentication.service';
import { sha256 } from 'js-sha256';
import { Page } from '../../constants/page.enum';
import { UserInputValues } from '../../models/user-input-values.model';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  private redirectUrl = '';
  public errorMessage: string = '';
  public appVersion: string = packageInfo.version;

  constructor(private authenticationService: AuthenticationService,
              private router: Router,
              private logger: NGXLogger,
              private messageService: MessageService) {
  }

  ngOnInit() {
    this.errorMessage = '';
    if (this.authenticationService.isLogged()) {
      this.navigateTo();
    }
  }

  public async login(data: UserInputValues) {
    try {
      this.redirectUrl = await this.authenticationService.login(data.username, sha256(data.password));
      this.navigateTo(Page.Home);
    } catch (e) {
      this.errorMessage = 'Wrong Credentials!';
      const message: Message = {severity: MessageSeverity.Error, summary: this.errorMessage};
      this.messageService.add(message);
      this.logger.error('Unable to Login!\n', e);
    }
  }

  public register(): void {
    this.navigateTo(Page.Register);
  }

  public navigateTo(url?: string) {
    url = url || '';
    this.router.navigate([url], {replaceUrl: true}).catch(console.error);
  }
}
