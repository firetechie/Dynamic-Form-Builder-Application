import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ActivatedRoute, Router } from '@angular/router';
import { FormService } from '../../../shared/services/form.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-form-builder',
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.scss']
})
export class FormBuilderComponent implements OnInit {
  formForm: FormGroup;
  fieldTypes = [
    { name: 'Text Input', type: 'text' },
    { name: 'Text Area', type: 'textarea' },
    { name: 'Dropdown', type: 'select' },
    { name: 'Checkbox', type: 'checkbox' },
    { name: 'Date Picker', type: 'date' },
    { name: 'Radio Button', type: 'radio' }
  ];
  isEditMode = false;
  selectedFieldIndex: number | null = null;
  isSaving!: boolean;

  constructor(
    private fb: FormBuilder,
    private formService: FormService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private changeDetector: ChangeDetectorRef
  ) {
    this.formForm = this.fb.group({
      id: [null],
      title: ['', Validators.required],
      description: [''],
      fields: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const formId = params['id'];
      if (formId && formId !== 'null' && formId !== 'new') {
        this.isEditMode = true;
        this.loadForm(formId);
      }
    });
  }

  private loadForm(formId: number): void {
    this.formService.getFormById(formId).subscribe(form => {
      if (form) {
        // Clear existing fields first
        while (this.fields.length !== 0) {
          this.fields.removeAt(0);
        }

        this.formForm.patchValue({
          id: form.id,
          title: form.title,
          description: form.description
        });

        form.fields.forEach((field: any) => {
          const fieldGroup = this.createField(field);
          this.fields.push(fieldGroup);
        });
      }
    });
  }

  get fields(): FormArray {
    return this.formForm.get('fields') as FormArray;
  }

  getFieldFormGroup(index: number): FormGroup {
    return this.fields.at(index) as FormGroup;
  }

  private fieldValidator(group: FormGroup): ValidationErrors | null {
    const required = group.get('required')?.value;
    const type = group.get('type')?.value;
    const label = group.get('label')?.value;
    const options = group.get('options') as FormArray;

    const errors: ValidationErrors = {};

    if (required) {
      if (!label || label.trim() === '') {
        errors['requiredLabel'] = true;
      }

      if (['radio', 'select', 'checkbox'].includes(type) && options.length === 0) {
        errors['requiredOptions'] = true;
      }
    }

    return Object.keys(errors).length > 0 ? errors : null;
  }

  addField(fieldData?: any): void {
    const fieldGroup = this.createField(fieldData);
    this.fields.push(fieldGroup);
    this.selectedFieldIndex = this.fields.length - 1;
  }

  handleDrop(event: CdkDragDrop<any[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.fields.controls, event.previousIndex, event.currentIndex);
    } else {
      const newField = this.createField({ type: event.item.data.type });
      this.fields.insert(event.currentIndex, newField);
      this.selectedFieldIndex = event.currentIndex;
    }
  }

  getOptions(fieldIndex: number): FormArray {
    return this.fields.at(fieldIndex).get('options') as FormArray;
  }

  addOption(fieldIndex: number, event: Event): void {
    event.preventDefault(); // Prevent form submission
    event.stopPropagation();

    const options = this.getOptions(fieldIndex);
    options.push(this.fb.control(''));
  }

  removeOption(fieldIndex: number, optionIndex: number): void {
    this.getOptions(fieldIndex).removeAt(optionIndex);
  }

  removeField(index: number): void {
    this.fields.removeAt(index);
    if (this.selectedFieldIndex === index) {
      this.selectedFieldIndex = null;
    } else if (this.selectedFieldIndex && this.selectedFieldIndex > index) {
      this.selectedFieldIndex--;
    }
  }

  selectField(index: number): void {
    this.selectedFieldIndex = index;
  }

  onSubmit(): void {
    if (this.formForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    // Disable the save button during operation
    this.isSaving = true;

    const formData = {
      ...this.formForm.value,
      fields: this.fields.value
    };

    this.formService.saveForm(formData).subscribe({
      next: (savedForm) => {
        this.snackBar.open('Form saved successfully!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });

        // Only navigate if we need to change routes
        if (!this.isEditMode) {
          // Use skipLocationChange to prevent guard from running again
          this.router.navigate(
            ['/admin/forms/edit', savedForm.id],
            {
              replaceUrl: true,
              state: { formSaved: true } // Add state to identify this navigation
            }
          );
        }
        this.isSaving = false;
      },
      error: (error) => {
        this.isSaving = false;
        this.snackBar.open('Error saving form', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        console.error('Save error:', error);
      }
    });
  }

  private markAllAsTouched(): void {
    this.formForm.markAllAsTouched();
    this.fields.controls.forEach(field => {
      field.markAllAsTouched();
      const options = field.get('options') as FormArray;
      options?.controls.forEach(opt => opt.markAsTouched());
    });
  }

  // Add this method to handle checkbox options
  getCheckboxOptions(fieldIndex: number): FormArray {
    return this.getFieldFormGroup(fieldIndex).get('options') as FormArray;
  }

  // Update the shouldShowOptions method
  shouldShowOptions(fieldIndex: number): boolean {
    if (fieldIndex === null || fieldIndex === undefined) return false;
    const fieldType = this.fields.at(fieldIndex).get('type')?.value;
    return ['select', 'radio', 'checkbox'].includes(fieldType);
  }

  // Update the createField method to initialize options properly
  createField(fieldData?: any): FormGroup {
    const options = fieldData?.options || [];
    return this.fb.group({
      id: [fieldData?.id || Date.now()],
      type: [fieldData?.type || 'text', Validators.required],
      label: [fieldData?.label || 'New Field', Validators.required],
      required: [fieldData?.required || false],
      options: this.fb.array(options.map((opt: string) => this.fb.control(opt))),
      placeholder: [fieldData?.placeholder || ''],
      defaultValue: [fieldData?.defaultValue || '']
    }, { validators: this.fieldValidator });
  }
}