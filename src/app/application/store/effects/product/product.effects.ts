import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';
import * as ProductActions from '@actions';
import { GetProductService, AddProductService, UpdateProductService, DeleteProductService } from '@services';

@Injectable()
export class ProductEffects {
  loadProducts$;
  addProduct$;
  updateProduct$;
  deleteProduct$;

  constructor(
    private actions$: Actions,
    private getProducts: GetProductService,
    private addProduct: AddProductService,
    private updateProduct: UpdateProductService,
    private deleteProduct: DeleteProductService
  ) {
    this.loadProducts$ = createEffect(() =>
      this.actions$.pipe(
        ofType(ProductActions.loadProducts),
        mergeMap(() =>
          this.getProducts.execute().pipe(
            map(products => ProductActions.loadProductsSuccess({ products })),
            catchError(error => of(ProductActions.loadProductsFailure({ error })))
          )
        )
      )
    );

    this.addProduct$ = createEffect(() =>
      this.actions$.pipe(
        ofType(ProductActions.addProduct),
        mergeMap(({ product }) =>
          this.addProduct.execute(product).pipe(
            map(newProduct => ProductActions.addProductSuccess({ product: newProduct })),
            catchError(error => of(ProductActions.addProductFailure({ error })))
          )
        )
      )
    );

    this.updateProduct$ = createEffect(() =>
      this.actions$.pipe(
        ofType(ProductActions.updateProduct),
        mergeMap(({ id, product }) =>
          this.updateProduct.execute(id, product).pipe(
            map(updated => ProductActions.updateProductSuccess({ product: updated })),
            catchError(error => of(ProductActions.updateProductFailure({ error })))
          )
        )
      )
    );

    this.deleteProduct$ = createEffect(() =>
      this.actions$.pipe(
        ofType(ProductActions.deleteProduct),
        mergeMap(({ id }) =>
          this.deleteProduct.execute(id).pipe(
            map(() => ProductActions.deleteProductSuccess({ id })),
            catchError(error => of(ProductActions.deleteProductFailure({ error })))
          )
        )
      )
    );
  }
}
