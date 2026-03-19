import { Component, HostListener } from '@angular/core';
import { FieldsPanelComponent } from '../fields-panel-component/fields-panel-component';
import { PropertiesPanelComponent } from '../properties-panel-component/properties-panel-component';

@Component({
  selector: 'app-builder',
  imports: [FieldsPanelComponent, PropertiesPanelComponent],
  templateUrl: './builder-component.html',
  styleUrl: './builder-component.scss',
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
