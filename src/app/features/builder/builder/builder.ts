import { Component, HostListener } from '@angular/core';
import { FieldsPanelComponent } from '../fields-panel/fields-panel';
import { PropertiesPanelComponent } from '../properties-panel/properties-panel';

@Component({
  selector: 'app-builder',
  imports: [FieldsPanelComponent, PropertiesPanelComponent],
  templateUrl: './builder.html',
  styleUrl: './builder.scss',
})
export class BuilderComponent {
  activeTab: 'fields' | 'properties' = 'fields';
  isMobile = false;

  constructor() {
    this.checkScreen();
  }

  @HostListener('window:resize')
  checkScreen() {
    this.isMobile = window.innerWidth < 768;
  }
}
