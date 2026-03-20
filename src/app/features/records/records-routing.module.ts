// records/records-routing.module.ts
import { RouterModule, Routes } from '@angular/router';
import { RecordsGridComponent } from './records-grid-component/records-grid-component';
import { EmployeeFormComponent } from './employee-form-component/employee-form-component';


export const routes: Routes = [
    { path: '', component: RecordsGridComponent },
    { path: 'edit/:id', component: EmployeeFormComponent },
    { path: 'create', component: EmployeeFormComponent },
];

export const RecordsRoutingModule = RouterModule.forChild(routes);