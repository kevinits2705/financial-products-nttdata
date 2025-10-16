import { productReducer, initialState, ProductState } from './product.reducer';
import * as ProductActions from '@actions';
import { Product } from '@domain';

const mockProduct1: Product = { 
    id: '1', name: 'P1', description: 'Desc 1', logo: 'l1', 
    date_release: '2024-01-01', date_revision: '2025-01-01' 
};
const mockProduct2: Product = { 
    id: '2', name: 'P2', description: 'Desc 2', logo: 'l2', 
    date_release: '2024-02-01', date_revision: '2025-02-01' 
};
const mockError = { message: 'Failed to fetch' };

describe('Product Reducer', () => {
  
  it('debería devolver el estado inicial por defecto', () => {
    const result = productReducer(undefined, {} as any);
    expect(result).toEqual(initialState);
  });

  describe('Load Products Actions', () => {
    it('debería establecer loading en true en loadProducts', () => {
      const action = ProductActions.loadProducts();
      const state = productReducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('debería cargar productos y establecer loading en false en loadProductsSuccess', () => {
      const products = [mockProduct1, mockProduct2];
      const action = ProductActions.loadProductsSuccess({ products });
      const stateWithLoading: ProductState = { ...initialState, loading: true };
      
      const state = productReducer(stateWithLoading, action);
      
      expect(state.loading).toBe(false);
      expect(state.products).toEqual(products);
      expect(state.error).toBeNull();
    });

    it('debería establecer el error y loading en false en loadProductsFailure', () => {
      const action = ProductActions.loadProductsFailure({ error: mockError });
      const stateWithLoading: ProductState = { ...initialState, loading: true };

      const state = productReducer(stateWithLoading, action);
      
      expect(state.loading).toBe(false);
      expect(state.error).toEqual(mockError);
    });
  });

  describe('Add Product Actions', () => {
    const currentState: ProductState = { ...initialState, products: [mockProduct1] };

    it('debería establecer loading en true en addProduct', () => {
      const action = ProductActions.addProduct({ product: mockProduct2 });
      const state = productReducer(currentState, action);
      expect(state.loading).toBe(true);
    });

    it('debería agregar un producto a la lista en addProductSuccess', () => {
      const action = ProductActions.addProductSuccess({ product: mockProduct2 });
      const state = productReducer(currentState, action);
      
      expect(state.loading).toBe(false);
      expect(state.products.length).toBe(2);
      expect(state.products).toEqual([mockProduct1, mockProduct2]);
    });

    it('debería establecer el error en addProductFailure', () => {
      const action = ProductActions.addProductFailure({ error: mockError });
      const state = productReducer(currentState, action);
      
      expect(state.loading).toBe(false);
      expect(state.error).toEqual(mockError);
    });
  });

  describe('Update Product Actions', () => {
    const mockUpdatedProduct1 = { ...mockProduct1, name: 'P1 Updated' };
    const currentState: ProductState = { ...initialState, products: [mockProduct1, mockProduct2] };

    it('debería reemplazar el producto actualizado en updateProductSuccess', () => {
      const action = ProductActions.updateProductSuccess({ product: mockUpdatedProduct1 });
      const state = productReducer(currentState, action);
      
      expect(state.products.length).toBe(2); 
      expect(state.products.find(p => p.id === '1')!.name).toBe('P1 Updated'); 
      expect(state.products.find(p => p.id === '2')).toEqual(mockProduct2);
    });
    
    it('debería retornar el estado sin cambios si el ID no existe', () => {
      const mockNonExistentProduct = { ...mockProduct1, id: '999', name: 'Non Existent' };
      const action = ProductActions.updateProductSuccess({ product: mockNonExistentProduct });
      const state = productReducer(currentState, action);
      
      expect(state.products).toEqual([mockProduct1, mockProduct2]);
    });
  });

  describe('Delete Product Actions', () => {
    const currentState: ProductState = { ...initialState, products: [mockProduct1, mockProduct2] };

    it('debería eliminar el producto de la lista en deleteProductSuccess', () => {
      const action = ProductActions.deleteProductSuccess({ id: mockProduct1.id });
      const state = productReducer(currentState, action);
      
      expect(state.products.length).toBe(1); 
      expect(state.products[0]).toEqual(mockProduct2);
    });
    
    it('debería retornar el estado sin cambios si el ID a eliminar no existe', () => {
        const action = ProductActions.deleteProductSuccess({ id: '999' });
        const state = productReducer(currentState, action);
        
        expect(state.products).toEqual([mockProduct1, mockProduct2]);
    });
  });
});