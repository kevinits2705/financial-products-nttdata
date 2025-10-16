import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule, AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as ProductActions from '@actions';
import { Product, ProductRepository } from '@domain';
import { CommonModule } from '@angular/common';
import { map, catchError, of } from 'rxjs';
import { Router, RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  selector: 'app-product-form',
  templateUrl: './product-form.html',
  styleUrls: ['./product-form.css']
})
export class ProductForm {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private productRepo: ProductRepository,
    private router: Router
  ) {
    this.form = this.fb.group({
      id: [
        '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(10)],
        [this.idExistsValidator()]
      ],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', [Validators.required]],
      date_release: ['', [Validators.required, this.releaseDateValidator]],
      date_revision: [{ value: '', disabled: true }, Validators.required]
    }, {
      validators: [this.revisionDateValidator]
    });

    this.form.get('date_release')?.valueChanges.subscribe((releaseDate) => {
        if (releaseDate) {
            const parts = releaseDate.split('-');
            const year = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            const day = parseInt(parts[2], 10);
            
            const release = new Date(year, month, day); 
            
            const revision = new Date(release);
            revision.setFullYear(release.getFullYear() + 1);

            this.form.get('date_revision')?.setValue(revision.toISOString().split('T')[0]);
        } else {
            this.form.get('date_revision')?.reset();
        }
    });
  }

  get f() {
    return this.form.controls;
  }

  idExistsValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      const id = control.value?.trim();
      if (!id) return of(null);

      return this.productRepo.verifyId(id).pipe(
        map(exists => (exists ? { idExists: true } : null)),
        catchError(() => of(null))
      );
    };
  }

  releaseDateValidator = (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;
      const parts = value.split('-');
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; 
      const day = parseInt(parts[2], 10);
      const date = new Date(year, month, day); 
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (isNaN(date.getTime())) return null;
      return date < today ? { invalidReleaseDate: true } : null;
  }

  revisionDateValidator(group: AbstractControl): ValidationErrors | null {
    const release = group.get('date_release')?.value;
    const revision = group.get('date_revision')?.value;
    if (!release || !revision) return null;

    const releaseDate = new Date(release);
    const revisionDate = new Date(revision);

    const expectedRevision = new Date(releaseDate);
    expectedRevision.setFullYear(expectedRevision.getFullYear() + 1);

    return revisionDate.getTime() === expectedRevision.getTime()
      ? null
      : { invalidRevisionDate: true };
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.form.value.date_revision = this.form.get('date_revision')?.value;
      const product: Product = this.form.value as Product;
      this.store.dispatch(ProductActions.addProduct({ product }));
      this.form.reset();
      this.router.navigate(['/']);
    } else {
      this.form.markAllAsTouched();
    }
  }

  onResetForm(){
    this.form.reset();
  }

  goToList(){
    this.router.navigate(['/']);
  }
}
