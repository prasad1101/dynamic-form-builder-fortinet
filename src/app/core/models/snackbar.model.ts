export type SnackbarType = 'success' | 'error' | 'info' | 'warning';

export interface SnackbarMessage {
    id: string;
    text: string;
    type: SnackbarType;
    duration?: number;
}