export interface FormField {
    type: 'text' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date';
    label: string;
    name: string;
    required: boolean;
    placeholder?: string;
    helpText?: string;
    options?: string[];
    minLength?: number;
    maxLength?: number;
    pattern?: string;
}