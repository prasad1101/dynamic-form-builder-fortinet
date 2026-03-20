// records/records.module.ts
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BuilderComponent } from './builder-component/builder-component';
import { FieldsPanelComponent } from './fields-panel-component/fields-panel-component';
import { PropertiesPanelComponent } from './properties-panel-component/properties-panel-component';
import { BuilderRoutingModule } from './builder-routing.module';

@NgModule({
    imports: [
        BuilderComponent,
        FieldsPanelComponent,
        PropertiesPanelComponent,
        RouterModule,
        BuilderRoutingModule
    ]
})
export class BuilderModule { }