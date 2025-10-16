import { ProductState } from '@reducer';
import {
  selectProductState,
  selectAllProducts,
  selectLoading,
  selectError,
  selectProducts,
} from './index';
import { Product } from '@domain';

const mockProduct1: Product = {
  id: '1', name: 'P1', description: 'D1', logo: 'l1',
  date_release: '2024-01-01', date_revision: '2025-01-01',
};
const mockProduct2: Product = {
  id: '2', name: 'P2', description: 'D2', logo: 'l2',
  date_release: '2024-02-01', date_revision: '2025-02-01',
};
const mockError = { status: 404, message: 'Not Found' };

const mockFeatureState: { products: ProductState } = {
  products: {
    products: [mockProduct1, mockProduct2],
    loading: false,
    error: null,
  },
};

describe('Product Selectors', () => {
  it('selectProductState debería devolver el estado del feature "products"', () => {
    const result = selectProductState(mockFeatureState);
    expect(result).toEqual(mockFeatureState.products);
  });

  it('selectAllProducts debería devolver toda la lista de productos', () => {
    const result = selectAllProducts.projector(mockFeatureState.products);
    expect(result).toEqual([mockProduct1, mockProduct2]);
  });
  
  it('selectAllProducts debería devolver un array vacío si el estado es nulo', () => {
    const result = selectAllProducts.projector(null as any);
    expect(result).toEqual([]);
  });

  it('selectLoading debería devolver el estado de carga (loading)', () => {
    const result = selectLoading.projector(mockFeatureState.products);
    expect(result).toBe(false);

    const stateLoading: ProductState = { ...mockFeatureState.products, loading: true };
    const resultLoading = selectLoading.projector(stateLoading);
    expect(resultLoading).toBe(true);
  });
  
  it('selectLoading debería devolver false si el estado es nulo', () => {
      const result = selectLoading.projector(null as any);
      expect(result).toBe(false);
  });

  it('selectError debería devolver el objeto de error', () => {
    const stateWithError: ProductState = { ...mockFeatureState.products, error: mockError };
    const result = selectError.projector(stateWithError);
    expect(result).toEqual(mockError);

    const resultNull = selectError.projector(mockFeatureState.products);
    expect(resultNull).toBeNull();
  });
  
  it('selectError debería devolver null si el estado es nulo', () => {
      const result = selectError.projector(null as any);
      expect(result).toBeNull();
  });

  it('selectProducts debería devolver la lista de productos (uso sin operadores nullish)', () => {
    const result = selectProducts.projector(mockFeatureState.products);
    expect(result).toEqual([mockProduct1, mockProduct2]);
  });
});