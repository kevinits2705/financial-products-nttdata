import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product, ProductRepository } from '@domain';

@Injectable({ providedIn: 'root' })
export class UpdateProductService {
  /**
   * Constructor
   * @param repository
  */
  constructor(private repository: ProductRepository) {}

  /**
   * Update a product
   * @param id
   * @param product
   * @returns
   */
  execute(id: string, product: Product): Observable<Product> {
    return this.repository.updateProduct(id, product);
  }
}
