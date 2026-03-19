import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuilderComponent } from './builder-component';
import { FieldsPanelComponent } from '../fields-panel-component/fields-panel-component';
import { PropertiesPanelComponent } from '../properties-panel-component/properties-panel-component';

describe('BuilderComponent', () => {
  let component: BuilderComponent;
  let fixture: ComponentFixture<BuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuilderComponent, FieldsPanelComponent, PropertiesPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should default to fields tab', () => {
    expect(component.activeTab).toBe('fields');
  });

  it('should detect mobile screen', () => {
    // simulate small screen
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 500 });
    component.checkScreen();
    expect(component.isMobile).toBe(true);

    // simulate large screen
    window.innerWidth = 1024;
    component.checkScreen();
    expect(component.isMobile).toBe(false);
  });

  it('should update isMobile when window is resized', () => {
    // window resize triggers HostListener
    window.innerWidth = 400;
    window.dispatchEvent(new Event('resize'));
    component.checkScreen();
    expect(component.isMobile).toBe(true);
  });
});