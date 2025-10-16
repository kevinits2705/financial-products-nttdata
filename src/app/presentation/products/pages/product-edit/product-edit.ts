import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '@domain';
import * as ProductActions from '@actions';
import { selectProducts } from '@selector';

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-edit.html',
  styleUrl: './product-edit.css'
})
export class ProductEdit implements OnInit {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  form: FormGroup;

  constructor(){
    this.form = this.fb.group({
      id: [{ value: '', disabled: true }, Validators.required],
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

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.store.select(selectProducts).subscribe(products => {
      const product = products.find(p => p.id === id);
      if (product) {
        this.form.patchValue(product);
      }
    });

    this.form.get('date_release')?.valueChanges.subscribe((releaseDate) => {
      if (releaseDate) {
        const release = new Date(releaseDate);
        const revision = new Date(release);
        revision.setFullYear(release.getFullYear() + 1);
        this.form.get('date_revision')?.setValue(revision.toISOString().split('T')[0]);
      } else {
        this.form.get('date_revision')?.reset();
      }
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const product: Product = this.form.getRawValue() as Product;
      this.store.dispatch(ProductActions.updateProduct({ id: product.id, product: product }));
      this.router.navigate(['/']);
    } else {
      this.form.markAllAsTouched();
    }
  }

  goToList(): void {
    this.router.navigate(['/']);
  }

  onReset(): void {
    const idValue = this.form.get('id')?.value;
    this.form.reset({
      id: idValue,
      name: '',
      description: '',
      logo: '',
      date_release: '',
      date_revision: ''
    });
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
}
