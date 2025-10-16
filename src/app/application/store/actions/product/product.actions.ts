import { createAction, props } from '@ngrx/store';
import { Product } from '@domain';

// Cargar productos
export const loadProducts = createAction('[Product] Load');
export const loadProductsSuccess = createAction('[Product] Load Success', props<{ products: Product[] }>());
export const loadProductsFailure = createAction('[Product] Load Failure', props<{ error: any }>());

// Crear producto
export const addProduct = createAction('[Product] Add', props<{ product: Product }>());
export const addProductSuccess = createAction('[Product] Add Success', props<{ product: Product }>());
export const addProductFailure = createAction('[Product] Add Failure', props<{ error: any }>());

// Actualizar producto
export const updateProduct = createAction('[Product] Update', props<{ id: string, product: Product }>());
export const updateProductSuccess = createAction('[Product] Update Success', props<{ product: Product }>());
export const updateProductFailure = createAction('[Product] Update Failure', props<{ error: any }>());

// Eliminar producto
export const deleteProduct = createAction('[Product] Delete', props<{ id: string }>());
export const deleteProductSuccess = createAction('[Product] Delete Success', props<{ id: string }>());
export const deleteProductFailure = createAction('[Product] Delete Failure', props<{ error: any }>());
