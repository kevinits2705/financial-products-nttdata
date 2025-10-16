import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, map, Observable, startWith } from 'rxjs';
import { Product } from '@domain';
import * as ProductActions from '@actions';
import * as ProductSelectors from '@selector';
import { CommonModule } from '@angular/common';
import { ProductList } from '../../components/product-list/product-list';
import { ProductForm } from '../product-add/product-form';
import { RouterModule } from '@angular/router';
import { ModalDelete } from "../../components/modal-delete/modal-delete";

@Component({
  standalone: true,
  imports: [CommonModule, ProductList, RouterModule],
  templateUrl: './products-page.html',
  styleUrl: './products-page.css'
})
export class ProductsPage implements OnInit {
  products$!: Observable<Product[]>;
  filteredProducts$!: Observable<Product[]>;
  loading$!: Observable<boolean>;

  private search$ = new BehaviorSubject<string>('');

  constructor(private store: Store, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.products$ = this.store.select(ProductSelectors.selectAllProducts);
    this.loading$ = this.store.select(ProductSelectors.selectLoading);
    this.store.dispatch(ProductActions.loadProducts());

    this.filteredProducts$ = combineLatest([
      this.products$,
      this.search$.pipe(
        debounceTime(250),
        distinctUntilChanged(),
        map(s => s.trim().toLowerCase()),
        startWith('')
      )
    ]).pipe(
      map(([products, term]) => {
        if (!term) return products;
        return products.filter(p =>
          (p.name ?? '').toLowerCase().includes(term) ||
          (p.description ?? '').toLowerCase().includes(term) ||
          (p.id ?? '').toLowerCase().includes(term)
        );
      })
    );
  }

  onSearch(value: string) {
    this.search$.next(value);
  }
}
