import { Injectable } from "@angular/core";
import { Product, ProductRepository } from "@domain";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GetProductService{
  /**
   * Constructor
   * @param repository
  */
  constructor(private repository : ProductRepository) {}

  /**
   * Get all products
   * @returns Observable<Product[]>
  */
  execute(): Observable<Product[]>{
    return this.repository.getAllProducts();
  }
}
