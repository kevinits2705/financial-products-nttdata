import { createReducer, on } from '@ngrx/store';
import { Product } from '@domain';

import * as ProductActions from '@actions';

export interface ProductState {
  products: Product[];
  loading: boolean;
  error: any;
}

export const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
};

export const productReducer = createReducer(
  initialState,
  // Load
  on(ProductActions.loadProducts, state => ({ ...state, loading: true })),
  on(ProductActions.loadProductsSuccess, (state, { products }) => ({ ...state, loading: false, products })),
  on(ProductActions.loadProductsFailure, (state, { error }) => ({ ...state, loading: false, error })),

  // Add
  on(ProductActions.addProduct, state => ({ ...state, loading: true })),
  on(ProductActions.addProductSuccess, (state, { product }) => ({
    ...state,
    loading: false,
    products: [...state.products, product],
  })),
  on(ProductActions.addProductFailure, (state, { error }) => ({ ...state, loading: false, error })),

  // Update
  on(ProductActions.updateProductSuccess, (state, { product }) => ({
    ...state,
    products: state.products.map(p => (p.id === product.id ? product : p)),
  })),

  // Delete
  on(ProductActions.deleteProductSuccess, (state, { id }) => ({
    ...state,
    products: state.products.filter(p => p.id !== id),
  }))
);
