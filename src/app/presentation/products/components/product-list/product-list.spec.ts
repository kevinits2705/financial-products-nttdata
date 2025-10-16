import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductList } from './product-list';
import { SimpleChange, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Product } from '@domain';
import * as ProductActions from '@actions';
import { NO_ERRORS_SCHEMA } from '@angular/core';

const mockProducts: Product[] = [
    { id: '1', name: 'A', description: 'a', logo: 'l', date_release: '2024-01-01', date_revision: '2025-01-01' },
    { id: '2', name: 'B', description: 'b', logo: 'l', date_release: '2024-01-01', date_revision: '2025-01-01' },
    { id: '3', name: 'C', description: 'c', logo: 'l', date_release: '2024-01-01', date_revision: '2025-01-01' },
    { id: '4', name: 'D', description: 'd', logo: 'l', date_release: '2024-01-01', date_revision: '2025-01-01' },
    { id: '5', name: 'E', description: 'e', logo: 'l', date_release: '2024-01-01', date_revision: '2025-01-01' },
    { id: '6', name: 'F', description: 'f', logo: 'l', date_release: '2024-01-01', date_revision: '2025-01-01' },
    { id: '7', name: 'G', description: 'g', logo: 'l', date_release: '2024-01-01', date_revision: '2025-01-01' },
    { id: '8', name: 'H', description: 'h', logo: 'l', date_release: '2024-01-01', date_revision: '2025-01-01' },
];

const mockStore = { dispatch: jasmine.createSpy('dispatch') };

describe('ProductList', () => {
    let component: ProductList;
    let fixture: ComponentFixture<ProductList>;
    let cd: ChangeDetectorRef;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ProductList],
            providers: [
                { provide: Store, useValue: mockStore },
                ChangeDetectorRef,
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ProductList);
        component = fixture.componentInstance;
        cd = fixture.debugElement.injector.get(ChangeDetectorRef);
        
        component.products = mockProducts; 
        component.refresh(); 

        fixture.detectChanges();
        mockStore.dispatch.calls.reset();
    });

    it('debería inicializar y calcular la paginación correctamente', () => {
        expect(component.total).toBe(8);
        expect(component.totalPages).toBe(2);
        expect(component.currentPageProducts.length).toBe(5);
        expect(component.currentPageProducts[0].id).toBe('1');
    });

    it('ngOnChanges debería resetear el índice y refrescar al cambiar productos', () => {
        component.pageIndex = 1;
        
        const newProducts = [...mockProducts, { id: '9', name: 'I', description: 'i', logo: 'l', date_release: '2024-01-01', date_revision: '2025-01-01' }];
        const changes: SimpleChanges = {
            products: new SimpleChange(mockProducts, newProducts, false)
        };
        
        component.products = newProducts;
        component.ngOnChanges(changes);

        expect(component.pageIndex).toBe(0); 
        expect(component.total).toBe(9);
        expect(component.currentPageProducts.length).toBe(5);
    });
    
    it('onPageSizeChange debe cambiar el tamaño de página y resetear el índice', () => {
        component.onPageSizeChange(10);
        expect(component.pageSize).toBe(10);
        expect(component.pageIndex).toBe(0);
        expect(component.currentPageProducts.length).toBe(8);
        expect(component.totalPages).toBe(1);
    });
    
    it('nextPage debe avanzar si no es la última página (RAMA TRUE)', () => {
        component.nextPage();
        expect(component.pageIndex).toBe(1);
        expect(component.currentPageProducts[0].id).toBe('6');
        
        component.nextPage();
        expect(component.pageIndex).toBe(1);
    });

    it('prevPage debe retroceder si no es la primera página (RAMA TRUE)', () => {
        component.pageIndex = 1;
        component.refresh();
        component.prevPage();
        expect(component.pageIndex).toBe(0);
        
        component.prevPage(); 
        expect(component.pageIndex).toBe(0); 
    });

    it('goToPage debe navegar a una página válida y no navegar a una inválida (cubrir IF)', () => {
        component.goToPage(1); 
        expect(component.pageIndex).toBe(1);
        
        component.goToPage(5); 
        expect(component.pageIndex).toBe(1);
        
        component.goToPage(-1); 
        expect(component.pageIndex).toBe(1);
    });

    it('trackById debe devolver el ID del producto', () => {
        const result = component.trackById(0, mockProducts[0]);
        expect(result).toBe('1');
    });

    it('toggleMenu debe activar y desactivar el menú (cubrir IF y ELSE)', () => {
        component.toggleMenu('2'); 
        expect(component.activeMenuId).toBe('2');
        
        component.toggleMenu('2'); 
        expect(component.activeMenuId).toBeNull();
    });

    it('delete debe establecer el ítem y abrir el modal', () => {
        spyOn(component, 'openModal');
        component.delete(mockProducts[0]);
        
        expect(component.deleteItem).toEqual(mockProducts[0]);
        expect(component.openModal).toHaveBeenCalled();
    });

    it('onConfirmDelete debe despachar deleteProduct y cerrar el modal', () => {
        spyOn(component, 'closeModal');
        const itemToDelete = mockProducts[0];
        
        component.onConfirmDelete(itemToDelete);
        
        expect(mockStore.dispatch).toHaveBeenCalledWith(
            ProductActions.deleteProduct({ id: itemToDelete.id })
        );
        expect(component.closeModal).toHaveBeenCalled();
    });
    
    it('onFormSubmittedFromChild debe llamar a closeModal', () => {
        spyOn(component, 'closeModal');
        component.onFormSubmittedFromChild();
        expect(component.closeModal).toHaveBeenCalled();
    });

    it('showingFrom y showingTo deben reflejar el rango de la página actual', () => {
        // Página 0 (1-5 de 8)
        expect(component.showingFrom).toBe(1);
        expect(component.showingTo).toBe(5);
        
        // Página 1 (6-8 de 8)
        component.pageIndex = 1;
        component.refresh();
        expect(component.showingFrom).toBe(6);
        expect(component.showingTo).toBe(8); 
        
        // Caso total = 0
        component.products = [];
        component.refresh();
        expect(component.showingFrom).toBe(0);
        expect(component.showingTo).toBe(0);
    });

    it('onPageSizeChange debe cambiar el tamaño de página a 10', () => {
        component.onPageSizeChange(10);
        expect(component.pageSize).toBe(10);
    });

    it('onPageSizeChange debe cambiar el tamaño de página a 5 cuando se pasa una cadena no válida', () => {
        component.onPageSizeChange('invalido');
        expect(component.pageSize).toBe(5);
    });

    it('onPageSizeChange debe usar 5 si el valor no es un número válido', () => {
        component.onPageSizeChange('invalido'); 
        expect(component.pageSize).toBe(5);
        expect(component.pageIndex).toBe(0);
    });
});