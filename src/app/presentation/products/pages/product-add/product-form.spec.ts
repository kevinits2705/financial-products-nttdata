import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, AbstractControl, ValidationErrors, Validators } from '@angular/forms';
import { ProductForm } from './product-form';
import { Store } from '@ngrx/store';
import { Product, ProductRepository } from '@domain';
import * as ProductActions from '@actions';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

const mockStore = { dispatch: jasmine.createSpy('dispatch') };
const mockProductRepo = { verifyId: jasmine.createSpy('verifyId') };
const mockRouter = { navigate: jasmine.createSpy('navigate') };

describe('ProductForm', () => {
  let component: ProductForm;
  let fixture: ComponentFixture<ProductForm>;
  let fb: FormBuilder;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ProductForm, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: Store, useValue: mockStore },
        { provide: ProductRepository, useValue: mockProductRepo },
        { provide: Router, useValue: mockRouter }
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductForm);
    component = fixture.componentInstance;
    fb = TestBed.inject(FormBuilder);
    mockProductRepo.verifyId.and.returnValue(of(false)); 
    
    fixture.detectChanges(); 
    mockStore.dispatch.calls.reset();
    mockRouter.navigate.calls.reset();
  });

  it('debería crearse el componente y el formulario', () => {
    expect(component).toBeTruthy();
    expect(component.form).toBeDefined();
  });

  // --- Pruebas de Validadores Síncronos ---
  describe('ID Control Validations', () => {
    let idControl: AbstractControl;
    beforeEach(() => {
      idControl = component.form.get('id')!;
    });

    it('debería ser inválido cuando está vacío (required)', () => {
      idControl.setValue('');
      expect(idControl.errors!['required']).toBeTrue();
    });

    it('debería ser inválido por minLength (2 chars)', () => {
      idControl.setValue('ab');
      expect(idControl.errors!['minlength']).toBeTruthy(); 
      expect(idControl.errors!['minlength'].actualLength).toBe(2); 
    });

    it('debería ser inválido por maxLength (11 chars)', () => {
      idControl.setValue('1234567890X');
      expect(idControl.errors!['maxlength']).toBeTruthy();
      expect(idControl.errors!['maxlength'].actualLength).toBe(11);
    });

    it('debería ser válido con 5 caracteres', fakeAsync(() => {
      idControl.setValue('valid');
      expect(idControl.errors).toBeNull();
    }));
  });

  describe('ID Exists Validator (Async)', () => {
    let idControl: AbstractControl;
    beforeEach(() => {
      idControl = component.form.get('id')!;
      idControl.setValue('test-id');
    });

    it('debería pasar si el ID no existe', fakeAsync(() => {
      mockProductRepo.verifyId.and.returnValue(of(false)); 
      
      idControl.updateValueAndValidity();
      tick();

      expect(idControl.pending).toBeFalse();
      expect(idControl.errors).toBeNull();
    }));

    it('debería fallar si el ID ya existe', fakeAsync(() => {
      mockProductRepo.verifyId.and.returnValue(of(true)); 

      idControl.updateValueAndValidity();
      tick();

      expect(idControl.pending).toBeFalse();
      expect(idControl.errors!['idExists']).toBeTrue();
    }));
    
    it('debería devolver null en caso de error de la API (catchError)', fakeAsync(() => {
        idControl.setValue('test-error'); 
        mockProductRepo.verifyId.and.returnValue(throwError(() => new Error('API Error')));
        idControl.updateValueAndValidity();
        tick();
        expect(idControl.pending).toBeFalse();
        expect(idControl.errors).toBeNull(); 
    }));
  });
  
  const validProductData: Product = {
    id: 'valid-id',
    name: 'Valid Name',
    description: 'Valid description text',
    logo: 'url-logo',
    date_release: '2025-06-01',
    date_revision: '2026-06-01',
  } as Product;
});