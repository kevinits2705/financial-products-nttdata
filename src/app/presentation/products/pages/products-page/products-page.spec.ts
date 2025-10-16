import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { ProductsPage } from './products-page';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Product } from '@domain';
import * as ProductSelectors from '@selector';
import * as ProductActions from '@actions';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

const mockProducts: Product[] = [
  { id: '1', name: 'Laptop HP', description: 'Portátil de alta gama', logo: '', date_release: '', date_revision: '' },
  { id: '2', name: 'Monitor Dell', description: 'Pantalla 27 pulgadas', logo: '', date_release: '', date_revision: '' },
  { id: '3', name: 'Teclado Redragon', description: 'Teclado mecánico', logo: '', date_revision: '', date_release: '' },
];

describe('ProductsPage', () => {
  let component: ProductsPage;
  let fixture: ComponentFixture<ProductsPage>;
  let mockStore: MockStore;
  let dispatchSpy: jasmine.Spy;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ProductsPage, RouterTestingModule],
      providers: [
        provideMockStore({
          selectors: [
            { selector: ProductSelectors.selectAllProducts, value: mockProducts },
            { selector: ProductSelectors.selectLoading, value: false },
          ]
        }),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsPage);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(MockStore);
    dispatchSpy = spyOn(mockStore, 'dispatch').and.callThrough();

    fixture.detectChanges();
  });

  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería despachar la acción loadProducts en ngOnInit', () => {
    expect(dispatchSpy).toHaveBeenCalledWith(ProductActions.loadProducts());
  });

  it('debería asignar products$ y loading$ a partir de los selectores', (done) => {
    component.products$.subscribe(products => {
      expect(products).toEqual(mockProducts);
      done();
    });
  });

  it('debería mostrar todos los productos si el término de búsqueda está vacío', fakeAsync(() => {
    let resultProducts: Product[] = [];

    component.filteredProducts$.subscribe(products => {
        resultProducts = products;
    });

    expect(resultProducts).toEqual(mockProducts);
  }));

  it('debería filtrar productos por nombre (case-insensitive) después del debounce', fakeAsync(() => {
    let resultProducts: Product[] = [];
    component.filteredProducts$.subscribe(products => resultProducts = products);

    component.onSearch('laptop');

    tick(249); 
    expect(resultProducts).toEqual(mockProducts);
    tick(1);
    expect(resultProducts.length).toBe(1);
    expect(resultProducts[0].id).toBe('1');
  }));

  it('debería filtrar productos por descripción', fakeAsync(() => {
    let resultProducts: Product[] = [];
    component.filteredProducts$.subscribe(products => resultProducts = products);

    component.onSearch('pantalla');
    tick(250);

    expect(resultProducts.length).toBe(1);
    expect(resultProducts[0].id).toBe('2');
  }));

  it('debería filtrar productos por ID', fakeAsync(() => {
    let resultProducts: Product[] = [];
    component.filteredProducts$.subscribe(products => resultProducts = products);

    component.onSearch('3');
    tick(250); 
    expect(resultProducts.length).toBe(1);
    expect(resultProducts[0].id).toBe('3');
  }));

  it('debería devolver una lista vacía si no hay coincidencias', fakeAsync(() => {
    let resultProducts: Product[] = [];
    component.filteredProducts$.subscribe(products => resultProducts = products);
    component.onSearch('inexistente');
    tick(250);
    expect(resultProducts.length).toBe(0);
    expect(resultProducts).toEqual([]);
  }));

  it('debería manejar búsquedas con espacios en blanco correctamente', fakeAsync(() => {
    let resultProducts: Product[] = [];
    component.filteredProducts$.subscribe(products => resultProducts = products);
    component.onSearch(' monitor  ');
    tick(250);

    expect(resultProducts.length).toBe(1);
    expect(resultProducts[0].id).toBe('2'); 
  }));

  it('debería llamar a onSearch() cuando se escribe en el input de búsqueda', () => {
    spyOn(component, 'onSearch').and.callThrough();
    const searchInput = fixture.debugElement.query(By.css('.search-input')).nativeElement;
    searchInput.value = 'nuevo término';
    searchInput.dispatchEvent(new Event('input')); 
    expect(component.onSearch).toHaveBeenCalledWith('nuevo término');
  });
});