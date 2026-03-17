import { Routes } from '@angular/router';
import { BuilderComponent } from './features/builder/builder/builder';
import { EmployeeFormComponent } from './features/records/employee-form/employee-form';
import { RecordsGridComponent } from './features/records/records-grid/records-grid';

export const routes: Routes = [
    {
        path: '',
        component: BuilderComponent
    },

    {
        path: 'create',
        component: EmployeeFormComponent
    },

    {
        path: 'edit/:id', // new route
        component: EmployeeFormComponent
    },

    {
        path: 'records',
        component: RecordsGridComponent
    }

];