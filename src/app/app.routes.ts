import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./features/builder/builder.module').then(m => m.BuilderModule)
    },

    {
        path: 'records',
        loadChildren: () => import('./features/records/records.module').then(m => m.RecordsModule)
    },
    { path: '**', redirectTo: '' } // fallback

];