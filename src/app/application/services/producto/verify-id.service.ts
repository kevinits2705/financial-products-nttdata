import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductRepository } from '@domain';

@Injectable({ providedIn: 'root' })
export class VerifyIdService {
  /**
   * Constructor
   * @param repository
  */
  constructor(private repository: ProductRepository) {}

  /**
   * Verify if a product ID exists
   * @param id
   * @returns
   */
  execute(id: string): Observable<boolean> {
    return this.repository.verifyId(id);
  }
}
