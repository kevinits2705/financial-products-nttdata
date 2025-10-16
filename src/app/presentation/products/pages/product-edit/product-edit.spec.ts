import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import * as ProductActions from '@actions';
import { ProductEdit } from './product-edit';
import { Product } from '@domain';
import { selectProducts } from '@selector';

describe('ProductEdit Component', () => {
  let component: ProductEdit;
  let fixture: ComponentFixture<ProductEdit>;
  let store: MockStore;
  let router: Router;

  const mockProduct: Product = {
    id: '1',
    name: 'Producto Test',
    description: 'Descripción test',
    logo: 'logo.png',
    date_release: '2025-10-15',
    date_revision: '2026-10-15'
  };

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductEdit, ReactiveFormsModule, RouterTestingModule],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: selectProducts,
              value: [mockProduct]
            }
          ]
        }),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: (key: string) => '1' } }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductEdit);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  }));

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar el producto correcto desde el store', () => {
    expect(component.form.get('id')?.value).toBe('1');
    expect(component.form.get('name')?.value).toBe('Producto Test');
  });

  it('debería recalcular la fecha de revisión cuando cambia la fecha de lanzamiento', () => {
    component.form.get('date_release')?.setValue('2025-01-01');
    const revision = component.form.get('date_revision')?.value;
    expect(revision).toBe('2026-01-01');
  });

  it('debería despachar updateProduct y navegar al home cuando el formulario es válido', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    const navigateSpy = spyOn(router, 'navigate');

    component.form.patchValue({
      id: '1',
      name: 'Producto Editado',
      description: 'Nuevo texto',
      logo: 'nuevo-logo.png',
      date_release: '2025-10-15',
      date_revision: '2026-10-15'
    });

    component.onSubmit();

    expect(dispatchSpy).toHaveBeenCalledWith(
      ProductActions.updateProduct({
        id: '1',
        product: jasmine.objectContaining({
          id: '1',
          name: 'Producto Editado',
          description: 'Nuevo texto',
          logo: 'nuevo-logo.png',
          date_release: '2025-10-15',
          date_revision: '2026-10-15'
        }) as any
      })
    );

    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  });

  it('debería marcar todos los campos como tocados si el formulario es inválido', () => {
    component.form.get('name')?.setValue('');
    const spy = spyOn(component.form, 'markAllAsTouched');
    component.onSubmit();
    expect(spy).toHaveBeenCalled();
  });

  it('debería mantener el id y resetear los demás campos al hacer reset', () => {
    component.form.patchValue({
      id: '1',
      name: 'Algo',
      description: 'Probando',
      logo: 'imagen.png',
      date_release: '2025-10-15',
      date_revision: '2026-10-15'
    });

    component.onReset();

    expect(component.form.get('id')?.value).toBe('1');
    expect(component.form.get('name')?.value).toBe('');
    expect(component.form.get('description')?.value).toBe('');
    expect(component.form.get('logo')?.value).toBe('');
    expect(component.form.get('date_release')?.value).toBe('');
    expect(component.form.get('date_revision')?.value).toBe('');
  });

  it('debería navegar a la lista al llamar goToList()', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.goToList();
    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  });
});
