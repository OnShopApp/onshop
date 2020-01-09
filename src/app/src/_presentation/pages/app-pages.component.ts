import {Component} from '@angular/core';
import {AppInfo, CartService, InfoService} from '../../_core';
import {AppRepository} from '../../_data';

@Component({
  selector: 'app-pages-component',
  styleUrls: ['./app-pages.component.scss'],
  templateUrl: './app-pages.component.html',
})
export class AppPagesComponent {

  /// constructor
  constructor(public cartService: CartService,
              public infoService: InfoService,
              private appRepository: AppRepository) {
    this.appRepository.getShopInfo().subscribe(data => {
      this.infoService.setAppInfo(new AppInfo({address: data.address, email: data.email, phone: data.phone}));
    });
  }
}
