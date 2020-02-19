import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ProductEntity} from '../../../../_data';

@Component({
  selector: 'app-product-item',
  styleUrls: ['./product-item.component.scss'],
  templateUrl: './product-item.component.html'
})
export class ProductItemComponent {
  /// binding
  @Input() item: ProductEntity;
  @Input() baseUrl: string;
  @Output() addToCart = new EventEmitter<ProductEntity>();

  /// constructor
  constructor() {
  }
}
