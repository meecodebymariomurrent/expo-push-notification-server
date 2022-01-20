import { Component, Input, OnInit } from '@angular/core';
import { Subscriber } from '../../models/subscriber.model';

@Component({
  selector: 'app-subscribers',
  templateUrl: './subscribers.component.html',
  styleUrls: ['./subscribers.component.scss']
})
export class SubscribersComponent implements OnInit {

  @Input() public subscribers: Array<Subscriber> = new Array<Subscriber>();

  public selectedSubscriber: Array<string> = new Array<string>();

  constructor() {
  }

  ngOnInit(): void {
  }

  public deleteSelectedSubscriber(): void {

  }

  public expireSelectedSubscriber(): void {

  }
}
