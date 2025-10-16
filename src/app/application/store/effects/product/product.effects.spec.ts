import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { ProductEffects } from './product.effects';
import * as ProductActions from '@actions';
import { Product } from '@domain';
import {
  GetProductService,
  AddProductService,
  UpdateProductService,
  DeleteProductService,
} from '@services'; // Asumiendo que estos son mocks de servicios

// Mocks de servicios
const mockProduct: Product = {
  id: '123',
  name: 'prueba',
  description: 'prueba de escritorio',
  logo: 'logo.png',
  date_release: '2025-10-02',
  date_revision: '2026-10-02'
};
const mockError = new Error('API Error');

const mockGetProducts = { execute: jasmine.createSpy('execute') };
const mockAddProduct = { execute: jasmine.createSpy('execute') };
const mockUpdateProduct = { execute: jasmine.createSpy('execute') };
const mockDeleteProduct = { execute: jasmine.createSpy('execute') };

describe('ProductEffects', () => {
  let actions$: Observable<any>;
  let effects: ProductEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductEffects,
        provideMockActions(() => actions$), 
        { provide: GetProductService, useValue: mockGetProducts },
        { provide: AddProductService, useValue: mockAddProduct },
        { provide: UpdateProductService, useValue: mockUpdateProduct },
        { provide: DeleteProductService, useValue: mockDeleteProduct },
      ],
    });

    effects = TestBed.inject(ProductEffects);
  });

  it('debería despachar loadProductsSuccess en caso de éxito', (done) => {
    actions$ = of(ProductActions.loadProducts());
    
    const products: Product[] = [mockProduct];
    mockGetProducts.execute.and.returnValue(of(products));

    effects.loadProducts$.subscribe((resultAction) => {
      expect(mockGetProducts.execute).toHaveBeenCalled(); 
      expect(resultAction).toEqual(ProductActions.loadProductsSuccess({ products })); 
      done();
    });
  });

  it('debería despachar loadProductsFailure en caso de error', (done) => {
    actions$ = of(ProductActions.loadProducts());
    mockGetProducts.execute.and.returnValue(throwError(() => mockError));
    effects.loadProducts$.subscribe((resultAction) => {
      expect(mockGetProducts.execute).toHaveBeenCalled();
      expect(resultAction).toEqual(ProductActions.loadProductsFailure({ error: mockError }));
      done();
    });
  });
});