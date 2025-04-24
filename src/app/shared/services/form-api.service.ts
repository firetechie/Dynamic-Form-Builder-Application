import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { FormTemplate } from '../models/form-template.model';

@Injectable({ providedIn: 'root' })
export class FormApiService {
    private forms: FormTemplate[] = [];

    getForms() {
        return of([...this.forms]);
    }

    saveForm(form: FormTemplate) {
        this.forms = this.forms.filter(f => f.id !== form.id);
        this.forms.push(form);
        return of(form);
    }

    deleteForm(id: string) {
        this.forms = this.forms.filter(f => f.id !== id);
        return of(true);
    }
}