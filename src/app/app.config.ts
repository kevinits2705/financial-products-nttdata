import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { ProductRepository } from '@domain';
import { GetProductService, AddProductService, UpdateProductService, DeleteProductService } from '@services';
import { ProductHttpRepository } from './infrastructure';
import { ProductEffects, productReducer } from '@application';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes), provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
    provideStore({ products: productReducer }),
    provideEffects([ProductEffects]),
    { provide: ProductRepository, useClass: ProductHttpRepository },
    GetProductService,
    AddProductService,
    UpdateProductService,
    DeleteProductService,

    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })
]
};
