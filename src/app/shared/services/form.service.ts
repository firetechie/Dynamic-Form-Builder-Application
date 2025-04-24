import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, Observable, of } from 'rxjs';

interface FormSubmission {
    id: number;
    formId: number;
    data: any;
    submittedAt: Date;
}

interface Form {
    id: number;
    title: string;
    description?: string;
    fields: FormField[];
}

interface FormField {
    id: number;
    type: string;
    label: string;
    required: boolean;
    options?: string[];
    placeholder?: string;
    defaultValue?: any;
}

@Injectable({
    providedIn: 'root'
})
export class FormService {
    private forms: any[] = [];
    private formSubmissions: any[] = [];
    private formsSubject = new BehaviorSubject<Form[]>([]);
    forms$ = this.formsSubject.asObservable();

    constructor() {
        this.loadInitialData();
    }

    private loadInitialData(): void {
        const formsJson = localStorage.getItem('forms');
        const forms: Form[] = formsJson ? JSON.parse(formsJson) : [];
        this.formsSubject.next(forms);
    }

    getForms(): Observable<Form[]> {
        return this.forms$; // Return the BehaviorSubject directly
    }

    getFormById(id: number): Observable<Form | null> {
        const forms = this.formsSubject.value;
        const form = forms.find(f => f.id === id);
        return of(form ? { ...form } : null).pipe(delay(100)); // Small delay to simulate API
    }

    saveForm(formData: Partial<Form>): Observable<Form> {
        return new Observable(observer => {
            try {
                const forms = this.formsSubject.value;
                const form: Form = {
                    id: formData.id || this.generateNewId(),
                    title: formData.title || 'Untitled Form',
                    description: formData.description || '',
                    fields: formData.fields || []
                };

                const index = forms.findIndex(f => f.id === form.id);
                const updatedForms = [...forms];

                if (index >= 0) {
                    updatedForms[index] = form;
                } else {
                    updatedForms.push(form);
                }

                localStorage.setItem('forms', JSON.stringify(updatedForms));
                this.formsSubject.next(updatedForms);

                observer.next(form);
                observer.complete();
            } catch (error) {
                observer.error(error);
            }
        });
    }

    private generateNewId(): number {
        const forms = this.formsSubject.value;
        const maxId = forms.reduce((max, form) => Math.max(max, form.id), 0);
        return maxId + 1;
    }

    deleteForm(id: number): Observable<boolean> {
        const forms = this.formsSubject.value.filter(f => f.id !== id);
        localStorage.setItem('forms', JSON.stringify(forms));
        this.formsSubject.next(forms);
        return of(true);
    }

    submitForm(formId: number, data: any) {
        const submission: FormSubmission = {
            id: Date.now(),
            formId,
            data,
            submittedAt: new Date()
        };
        this.formSubmissions.push(submission);
        this.persistSubmissions();
        return of({ ...submission });
    }

    getSubmissions(formId?: number) {
        let submissions = [...this.formSubmissions];
        if (formId) {
            submissions = submissions.filter(s => s.formId === formId);
        }
        return of(submissions);
    }

    private persistSubmissions(): void {
        localStorage.setItem('formSubmissions', JSON.stringify(this.formSubmissions));
    }
}