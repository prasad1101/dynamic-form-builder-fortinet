import { Routes } from '@angular/router';
import { BuilderComponent } from './features/builder/builder-component/builder-component';
import { EmployeeFormComponent } from './features/records/employee-form-component/employee-form-component';
import { RecordsGridComponent } from './features/records/records-grid-component/records-grid-component';

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