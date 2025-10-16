import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product, ProductRepository } from '@domain';

@Injectable({ providedIn: 'root' })
export class AddProductService {
  /**
   * Constructor
   * @param repository
  */
  constructor(private repository: ProductRepository) {}

  /**
   * Add a new product
   * @param product Product
   * @returns Observable<Product>
  */
  execute(product: Product): Observable<Product> {
    return this.repository.addProduct(product);
  }
}
