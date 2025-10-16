import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '@domain';

@Component({
  selector: 'app-modal-delete',
  imports: [],
  templateUrl: './modal.html',
  styleUrl: './modal.css'
})
export class ModalDelete {

  @Input() product : Product | undefined;
  @Output() close = new EventEmitter<void>();
  @Output() confirmDelete = new EventEmitter<Product>();

  confirm() {
    this.confirmDelete.emit(this.product);
  }

  closeModal(){
    this.close.emit();
  }
}
