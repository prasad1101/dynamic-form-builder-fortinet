// records/records.module.ts
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EmployeeFormComponent } from './employee-form-component/employee-form-component';
import { RecordsGridComponent } from './records-grid-component/records-grid-component';
import { RecordsRoutingModule } from './records-routing.module';

@NgModule({
    imports: [
        EmployeeFormComponent,
        RecordsGridComponent,
        RouterModule,
        RecordsRoutingModule
    ]
})
export class RecordsModule { }