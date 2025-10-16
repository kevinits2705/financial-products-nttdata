import { Observable } from "rxjs";
import { Product } from "../../models/product/product.model";
import { Injectable } from "@angular/core";

/**
 * Product Repository
 */
@Injectable({ providedIn: 'root' })
export abstract class ProductRepository {
  abstract  getAllProducts(): Observable<Product[]>;
  abstract verifyId(id: string): Observable<boolean>;
  abstract addProduct(product: Product): Observable<Product>;
  abstract updateProduct(id: string, product: Product): Observable<Product>;
  abstract deleteProduct(id: string): Observable<void>;
}
