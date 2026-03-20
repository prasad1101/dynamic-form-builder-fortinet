// records/records-routing.module.ts
import { RouterModule, Routes } from '@angular/router';
import { BuilderComponent } from './builder-component/builder-component';

export const routes: Routes = [
    { path: '', component: BuilderComponent },
];

export const BuilderRoutingModule = RouterModule.forChild(routes);