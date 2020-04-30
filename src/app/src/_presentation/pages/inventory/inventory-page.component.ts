import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {finalize} from 'rxjs/operators';
import {
  CategoryModel,
  ProductModel,
  ProductFilter,
  ProductRepository,
  ProductSearchResult,
  CategoryRepository,
  SearchResultFilters
} from '../../../_data';
import {AppMapper} from '../../_mapper';
import {AuthService, CartService, FilterAttribute, FilterCategory, InventoryFilter, PriceRange} from '../../../_domain';

@Component({
  selector: 'app-inventory-page',
  styleUrls: ['./inventory-page.component.scss'],
  templateUrl: './inventory-page.component.html'
})
export class InventoryPageComponent implements OnInit {
  /// fields
  public items: Array<ProductModel> = [];
  public category: CategoryModel = new CategoryModel();
  public filter: SearchResultFilters;
  public pagination = {setPage: 1, setAmount: 12};
  public sorting = {name: '', property: ''};
  public dynamicFilterSave = '';
  public sortingSave: any;
  public searchResult: ProductSearchResult;
  public itemFilters: any;
  public categoryId: number;
  public showCategories: true;
  public element: HTMLElement;
  public sortChanged: number;
  /// predicates
  public isLoading = true;

  /// events
  public filtersChanged(dynamicFilter: string, page: any, sorting: any) {
    this.isLoading = true;

    this.scrollToView();
    if (page && this.pagination !== page) {
      this.pagination.setPage = page.setPage;
      this.pagination.setAmount = page.setAmount;
    } else if (this.dynamicFilterSave !== dynamicFilter) {
      this.sortChanged = 1;
      this.pagination.setPage = 1;
    }
    const a = new ProductFilter({
      page: this.pagination.setPage,
      per_page: this.pagination.setAmount,
      category: this.category.id
    });
    if (sorting && this.sorting !== sorting) {
      this.sorting.name = sorting.name;
      this.sorting.property = sorting.property;
      if (this.sorting.name !== 'all') {
        a.order = this.sorting.property;
        a.orderby = this.sorting.name;
      } else {
        this.sorting.name = '';
        this.sorting.property = '';
      }
      a.page = 1;
    } else {
      a.order = this.sorting.property;
      a.orderby = this.sorting.name;
    }

    this.productRepository.getProducts(a, dynamicFilter)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(result => {
        localStorage.setItem('pageForPagination', this.pagination.setPage.toString());
        localStorage.setItem('amountForPagination', this.pagination.setAmount.toString());
        this.filter = result.filters;
        this.searchResult = result;
        this.dynamicFilterSave = dynamicFilter;
      });
  }

  /// constructor
  constructor(private productRepository: ProductRepository,
              private categoryRepository: CategoryRepository,
              private cartService: CartService,
              public authService: AuthService,
              private route: ActivatedRoute,
              private router: Router) {
    // this.filter = DefaultFilters.Get();
    this.searchResult = new ProductSearchResult();
  }

  ngOnInit(): void {
    if (localStorage.getItem('pageForPagination')) {
      this.pagination.setPage = Number(localStorage.getItem('pageForPagination'));
      this.pagination.setAmount = Number(localStorage.getItem('amountForPagination'));
      localStorage.removeItem('pageForPagination');
      localStorage.removeItem('amountForPagination');
    }

    this.route.params.subscribe(params => {
      this.productRepository.getFiltersProduct(0).subscribe(res => {
        this.itemFilters = res;
      });
      this.categoryId = params.cacategoryId;
      this.categoryRepository.getCategory(params.categoryId).subscribe(item => {
        this.category = item;
      });
      if (params.categoryId.toString() === 'all') {
        this.showCategories = true;
        this.productRepository.getProducts(new ProductFilter({per_page: this.pagination.setAmount, page: this.pagination.setPage}),
          null)
          .pipe(finalize(() => this.isLoading = false))
          .subscribe(result => {
            const filterResult = result.filters.filterItems;
            for (let i = 0; i < filterResult.length; i++) {
              if (filterResult[i].name === 'category') {
                const temp = filterResult[0];
                filterResult[0] = filterResult[i];
                filterResult[i] = temp;
              }
            }
            this.filter = result.filters;
            this.searchResult = result;
            this.sortChanged = this.pagination.setPage;
          });
      } else {
        this.productRepository.getProducts(new ProductFilter({
          per_page: this.pagination.setAmount,
          page: this.pagination.setPage,
          category: params.categoryId
        }), null)
          .pipe(finalize(() => this.isLoading = false))
          .subscribe(result => {
            this.filter = result.filters;
            this.searchResult = result;
            this.sortChanged = this.pagination.setPage;
          });
      }
    });
  }

  /// methods
  public productClick(slug: string, event: any) {
    const classList = event.target.classList as DOMTokenList;
    if (classList.contains('add-to-cart') || classList.contains('material-icons-outlined')) {
      return;
    }
    this.router.navigate([`product/${slug}`]).then();
  }

  public addToCart(item: ProductModel) {
    if (!item) {
      (window as any).toastr.options.positionClass = 'toast-bottom-right';
      (window as any).toastr.info('Login to make shopping');
    } else {
      this.cartService.addItem(AppMapper.toCartItem(item));
    }
  }

  public scrollToView() {
    this.element = document.getElementById('scrollView') as HTMLElement;
    this.element.scrollIntoView({block: 'start', behavior: 'smooth'});
  }
}

export class DefaultFilters {
  public static Get(): InventoryFilter {
    const result = new InventoryFilter({
      priceRange: new PriceRange({
        min: 0,
        max: 1000,
        start: 0,
        end: 1000
      }),
      categories: [
        new FilterCategory({
          title: 'Available for Rent',
          attributes: [
            new FilterAttribute({name: 'Yes', isChecked: true, isDisabled: true}),
            new FilterAttribute({name: 'No', isChecked: true, isDisabled: true})
          ]
        }),
        new FilterCategory({
          title: 'Stock Status',
          attributes: [
            new FilterAttribute({name: 'In Stock', isChecked: true, isDisabled: true}),
            new FilterAttribute({name: 'Out of Stock', isChecked: false, isDisabled: true}),
            new FilterAttribute({name: 'On Backorder', isChecked: false, isDisabled: true})
          ]
        })
      ]
    });
    return result;
  }
}
