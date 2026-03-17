import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldsPanel } from './fields-panel';

describe('FieldsPanel', () => {
  let component: FieldsPanel;
  let fixture: ComponentFixture<FieldsPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldsPanel],
    }).compileComponents();

    fixture = TestBed.createComponent(FieldsPanel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
