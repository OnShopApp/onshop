import {AppPagesComponent} from './app-pages.component';
import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {HomePageComponent} from './home';
import {InventoryPageComponent} from './inventory';
import {ContactUsPageComponent} from './contact-us';
import {ProductDetailsPageComponent} from './product-details';
import {CategoriesPageComponent} from './categories';
import {TrackOrderPageComponent} from './track-order';
import {CartPageComponent} from './cart';
import {SearchResultPageComponent} from './search-result';
import {CheckoutPageComponent} from './checkout';
import {LoginPageComponent} from './login';
import {AccountPageComponent, OrdersPageComponent, ProfilePageComponent} from './profile';

export const routes: Routes = [
  {
    path: '', component: AppPagesComponent,
    children: [
      {
        path: '',
        component: HomePageComponent
      },
      {
        path: 'cart',
        component: CartPageComponent,
      },
      {
        path: 'checkout',
        component: CheckoutPageComponent
      },
      {
        path: 'categories',
        component: CategoriesPageComponent
      },
      {
        path: 'inventory/:categorySlug',
        component: InventoryPageComponent,
      },
      {
        path: 'product/:slug',
        component: ProductDetailsPageComponent
      },
      {
        path: 'search-result',
        component: SearchResultPageComponent
      },
      {
        path: 'contact-us',
        component: ContactUsPageComponent
      },
      {
        path: 'login',
        component: LoginPageComponent
      },
      {
        path: 'profile',
        component: ProfilePageComponent,
        children: [
          {
            path: '',
            component: AccountPageComponent
          },
          {
            path: 'orders',
            component: OrdersPageComponent
          }
        ]
      },
      {
        path: 'track-order',
        component: TrackOrderPageComponent
      }
    ]
  }
];
export const AppPagesRouting: ModuleWithProviders = RouterModule.forChild(routes);