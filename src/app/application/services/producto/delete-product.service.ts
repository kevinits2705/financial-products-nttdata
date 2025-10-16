import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductRepository } from '@domain';

@Injectable({ providedIn: 'root' })
export class DeleteProductService {

  /**
   * Constructor
   * @param repository
  */
  constructor(private repository: ProductRepository) {}

  /**
   * Delete a product
   * @param id
   * @returns
   */
  execute(id: string): Observable<void> {
    return this.repository.deleteProduct(id);
  }
}
