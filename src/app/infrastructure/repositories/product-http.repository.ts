import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_CONFIG } from '../http/api.config';
import { Product, ProductRepository } from '@domain';

@Injectable({ providedIn: 'root' })
export class ProductHttpRepository implements ProductRepository {
  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<{ data: Product[] }>(API_CONFIG.BASE_URL)
      .pipe(map(res => res.data));
  }

  verifyId(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${API_CONFIG.BASE_URL}/verification/${id}`);
  }

  addProduct(product: Product): Observable<Product> {
    return this.http.post<{ data: Product }>(API_CONFIG.BASE_URL, product)
      .pipe(map(res => res.data));
  }

  updateProduct(id: string, product: Product): Observable<Product> {
    return this.http.put<{ data: Product }>(`${API_CONFIG.BASE_URL}/${id}`, product)
      .pipe(map(res => res.data));
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${API_CONFIG.BASE_URL}/${id}`);
  }
}
