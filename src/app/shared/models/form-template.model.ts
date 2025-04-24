import { FormField } from "./form-field.model";

export interface FormTemplate {
    id: string;
    name: string;
    fields: FormField[];
    createdAt: Date;
    updatedAt: Date;
}