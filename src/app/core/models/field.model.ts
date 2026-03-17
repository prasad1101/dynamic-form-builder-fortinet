export type FieldType =
    | 'text'
    | 'integer'
    | 'decimal'
    | 'textarea'
    | 'datetime'
    | 'email'
    | 'phone'
    | 'url';

export interface FieldConfig {
    id: string;
    type: FieldType;
    title: string;
    required: boolean;
    key: string
    min?: number;
    max?: number;

    minLength?: number;
    maxLength?: number;

    pattern?: string;
    defaultValue?: any;
}