import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordsGrid } from './records-grid';

describe('RecordsGrid', () => {
  let component: RecordsGrid;
  let fixture: ComponentFixture<RecordsGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecordsGrid],
    }).compileComponents();

    fixture = TestBed.createComponent(RecordsGrid);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
