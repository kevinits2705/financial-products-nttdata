import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Product } from '@domain';
import { ModalDelete } from '../modal-delete/modal-delete';
import { Store } from '@ngrx/store';
import * as ProductActions from '@actions';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, ModalDelete],
  selector: 'app-product-list',
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList implements OnChanges{
  cd = inject(ChangeDetectorRef);
  store = inject(Store);
  @Input() products: Product[] | null = [];

  activeMenuId: string | null = null;
  pageSizeOptions = [5, 10, 20];
  pageSize = 5;
  pageIndex = 0;

  total = 0;
  totalPages = 0;
  currentPageProducts: Product[] = [];
  deleteItem! : Product;
  isModalOpen: boolean = false;
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['products']) {
      this.pageIndex = 0;
      this.refresh();
    }
  }

  refresh() {
    this.total = this.products?.length ?? 0;
    this.totalPages = Math.max(1, Math.ceil(this.total / this.pageSize));
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.currentPageProducts = (this.products ?? []).slice(start, end);
  }

  onPageSizeChange(value: string | number) {
    this.pageSize = Number(value) || 5;
    this.pageIndex = 0;
    this.refresh();
  }

  prevPage() {
    if (this.pageIndex > 0) {
      this.pageIndex--;
      this.refresh();
    }
  }

  nextPage() {
    if (this.pageIndex < this.totalPages - 1) {
      this.pageIndex++;
      this.refresh();
    }
  }

  goToPage(i: number) {
    if (i >= 0 && i < this.totalPages) {
      this.pageIndex = i;
      this.refresh();
    }
  }

  trackById(index: number, item: Product) {
    return item.id ?? index;
  }

  toggleMenu(productId: string): void {
    if (this.activeMenuId === productId) {
      this.activeMenuId = null;
    } else {
      this.activeMenuId = productId;
    }
  }

  delete(entidad : Product){
    this.deleteItem = entidad;
    this.openModal();
  }

  onConfirmDelete(product: Product) {
    this.store.dispatch(ProductActions.deleteProduct({ id: product.id }));
    this.closeModal();
  }
  
  openModal() {
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden';
    this.cd.detectChanges();
  }

  closeModal() {
    this.isModalOpen = false;
    document.body.style.overflow = 'auto';
    this.cd.detectChanges();
  }

  onFormSubmittedFromChild() {
    this.closeModal();
  }

  get showingFrom() { return this.total === 0 ? 0 : this.pageIndex * this.pageSize + 1; }
  get showingTo() { return Math.min(this.total, (this.pageIndex + 1) * this.pageSize); }
}
