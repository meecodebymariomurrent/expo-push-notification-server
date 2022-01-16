import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import packageInfo from '../../../../package.json';
import { AuthenticationService } from '../../../../../src/services/authentication.service';
import { Router } from '@angular/router';
import { Message, MessageService } from 'primeng/api';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  private redirectUrl = '';

  public email: string;
  public password: string;
  public errorMessage: string;
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

  public async login(email: string, password: string) {
    try {
      const url = (await this.authenticationService.login(
        email,
        password,
      )) as string;
      this.redirectUrl = url;
    } catch (e) {
      this.errorMessage = 'Wrong Credentials!';
      const message: Message = new PrimeNGMessageBuilder().severity(MessageSeverity.Error).summary(this.errorMessage).build();
      this.messageService.add(message);
      this.logger.error('Unable to Login!\n', e);
    }
  }

  public navigateTo(url?: string) {
    url = url || 'nav';
    this.router.navigate([url], {replaceUrl: true}).catch(console.error);
  }
}
