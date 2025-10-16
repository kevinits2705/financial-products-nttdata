import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalDelete } from './modal-delete';
import { Product } from '@domain';
import { NO_ERRORS_SCHEMA } from '@angular/core';

// --- Datos de Mock ---
const mockProduct: Product = {
    id: '1', name: 'Laptop', description: 'Portátil', logo: 'l1', 
    date_release: '2024-01-01', date_revision: '2025-01-01'
};

describe('ModalDelete', () => {
    let component: ModalDelete;
    let fixture: ComponentFixture<ModalDelete>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ModalDelete],
            // Usamos NO_ERRORS_SCHEMA para ignorar cualquier elemento o pipe en el template
            schemas: [NO_ERRORS_SCHEMA] 
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ModalDelete);
        component = fixture.componentInstance;
        // Asignamos un producto para las pruebas
        component.product = mockProduct; 
        fixture.detectChanges();
    });

    it('debería crearse el componente', () => {
        expect(component).toBeTruthy();
    });

    // --- Prueba de Emisión de Evento de Confirmación ---
    it('confirm() debería emitir el evento confirmDelete con el producto correcto', () => {
        // 1. Espiar el EventEmitter
        spyOn(component.confirmDelete, 'emit');
        
        // 2. Ejecutar el método
        component.confirm();
        
        // 3. Verificar la emisión
        expect(component.confirmDelete.emit).toHaveBeenCalledWith(mockProduct);
    });

    it('closeModal() debería emitir el evento close', () => {
        // Espiar el EventEmitter
        spyOn(component.close, 'emit');
        
        // Ejecutar el método
        component.closeModal();
        
        // CORRECCIÓN: Solo verifica que emit fue llamado, sin argumentos específicos.
        expect(component.close.emit).toHaveBeenCalled(); 
        // Opcionalmente, puedes verificar que se llamó exactamente una vez.
        expect(component.close.emit).toHaveBeenCalledTimes(1); 
    });
});