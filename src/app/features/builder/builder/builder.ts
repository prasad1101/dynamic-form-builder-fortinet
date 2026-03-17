import { Component } from '@angular/core';
import { FieldsPanelComponent } from '../fields-panel/fields-panel';
import { PropertiesPanelComponent } from '../properties-panel/properties-panel';

@Component({
  selector: 'app-builder',
  imports: [FieldsPanelComponent, PropertiesPanelComponent],
  templateUrl: './builder.html',
  styleUrl: './builder.scss',
})
export class BuilderComponent { }
