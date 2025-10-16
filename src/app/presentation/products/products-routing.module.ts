import { Routes } from '@angular/router';
import { ProductsPage } from './pages/products-page/products-page';
import { ProductForm } from './pages/product-add/product-form';

export const productsRoutes: Routes = [
  {
    path: '',
    component: ProductsPage
  },
  {
    path: 'products/add',
    loadComponent  : () => import('./pages/product-add/product-form').then(m => m.ProductForm)
  },
  {
    path: 'products/edit/:id',
    loadComponent  : () => import('./pages/product-edit/product-edit').then(m => m.ProductEdit)
  }
];
