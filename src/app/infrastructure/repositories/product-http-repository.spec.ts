import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { API_CONFIG } from '../http/api.config';
import { Product } from '@domain';
import { HttpClient } from '@angular/common/http';
import { ProductHttpRepository } from './product-http.repository';

const mockProduct: Product = {
    id: '1', name: 'Test Product', description: 'Test Desc', logo: 'l1', 
    date_release: '2025-01-01', date_revision: '2026-01-01'
};
const mockProducts: Product[] = [mockProduct];
const BASE_URL = API_CONFIG.BASE_URL;

describe('ProductHttpRepository', () => {
  let repository: ProductHttpRepository;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], 
      providers: [
        ProductHttpRepository,
      ],
    });

    repository = TestBed.inject(ProductHttpRepository);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('getAllProducts() debería realizar un GET y mapear la respuesta .data', () => {
    repository.getAllProducts().subscribe(products => {
      expect(products).toEqual(mockProducts);
    });
    const req = httpTestingController.expectOne(BASE_URL);
    expect(req.request.method).toBe('GET');
    req.flush({ data: mockProducts });
  });

  it('verifyId() debería realizar un GET al endpoint de verificación', () => {
    const testId = 'ID456';
    repository.verifyId(testId).subscribe(isUnique => {
      expect(isUnique).toBe(true);
    });

    const expectedUrl = `${BASE_URL}/verification/${testId}`;
    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(true);
  });

  it('addProduct() debería realizar un POST y devolver el producto creado', () => {
    repository.addProduct(mockProduct).subscribe(product => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpTestingController.expectOne(BASE_URL);

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockProduct);

    req.flush({ data: mockProduct });
  });
  
  it('updateProduct() debería realizar un PUT con el ID correcto', () => {
    const updatedProduct = { ...mockProduct, name: 'Updated' };
    const testId = mockProduct.id;

    repository.updateProduct(testId, updatedProduct).subscribe(product => {
      expect(product.name).toBe('Updated');
    });

    const expectedUrl = `${BASE_URL}/${testId}`;
    const req = httpTestingController.expectOne(expectedUrl);

    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedProduct);

    req.flush({ data: updatedProduct });
  });

  it('deleteProduct() debería realizar un DELETE con el ID correcto', (done) => {
    const testId = '999';

    repository.deleteProduct(testId).subscribe(() => {
      done(); 
    });

    const expectedUrl = `${BASE_URL}/${testId}`;
    const req = httpTestingController.expectOne(expectedUrl);

    expect(req.request.method).toBe('DELETE');

    req.flush(null);
  });
});