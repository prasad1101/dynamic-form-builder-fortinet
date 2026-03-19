import { TestBed } from '@angular/core/testing';
import { CustomTableComponent } from './custom-table';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CustomTableComponent', () => {

    let component: CustomTableComponent;

    const mockColumns = [
        { key: 'name' },
        { key: 'age' }
    ];

    const mockData = [
        { id: '1', name: 'Alice', age: 25 },
        { id: '2', name: 'Bob', age: 30 },
        { id: '3', name: 'Charlie', age: 20 }
    ];

    beforeEach(async () => {

        TestBed.configureTestingModule({
            imports: [CustomTableComponent],
            schemas: [NO_ERRORS_SCHEMA]
        });

        // override template to avoid templateUrl issue
        TestBed.overrideComponent(CustomTableComponent, {
            set: { template: `<div></div>` }
        });

        await TestBed.compileComponents();

        const fixture = TestBed.createComponent(CustomTableComponent);
        component = fixture.componentInstance;

        component.columns = mockColumns;
        component.data = mockData;

        component.ngOnChanges();
    });

    it('should create component', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize filteredData on changes', () => {
        expect(component.filteredData.length).toBe(3);
    });

    it('should filter data based on column filter', () => {
        component.onFilter('alice', 'name');
        expect(component.filteredData.length).toBe(1);
        expect(component.filteredData[0].name).toBe('Alice');
    });

    it('should sort data ascending and descending', () => {
        component.sort('age');
        expect(component.filteredData[0].age).toBe(20);

        component.sort('age');
        expect(component.filteredData[0].age).toBe(30);
    });

    it('should paginate data correctly', () => {
        component.pageSize = 2;
        component.applyAll();

        expect(component.paginatedData.length).toBe(2);
    });

    it('should change page within valid range', () => {
        component.pageSize = 1;
        component.applyAll();

        component.changePage(2);
        expect(component.page).toBe(2);
    });

    it('should not change page if out of range', () => {
        component.changePage(999);
        expect(component.page).toBe(1);
    });

    it('should toggle row selection', () => {
        const emitSpy = vi.spyOn(component.selectionChange, 'emit');

        component.toggleRow(mockData[0]);
        expect(component.selectedRows.has('1')).toBe(true);
        expect(emitSpy).toHaveBeenCalled();

        component.toggleRow(mockData[0]);
        expect(component.selectedRows.has('1')).toBe(false);
    });

    it('should select all rows', () => {
        const emitSpy = vi.spyOn(component.selectionChange, 'emit');

        component.toggleAll({ target: { checked: true } });

        expect(component.selectedRows.size).toBe(3);
        expect(emitSpy).toHaveBeenCalled();
    });

    it('should clear selection on toggleAll false', () => {
        component.toggleAll({ target: { checked: true } });
        component.toggleAll({ target: { checked: false } });

        expect(component.selectedRows.size).toBe(0);
    });

    it('should emit deleteSelected and clear selection', () => {
        const deleteSpy = vi.spyOn(component.deleteSelected, 'emit');

        component.toggleRow(mockData[0]);
        component.onDeleteSelected();

        expect(deleteSpy).toHaveBeenCalledWith(['1']);
        expect(component.selectedRows.size).toBe(0);
    });

    it('should perform global search', () => {
        component.onGlobalSearch('bob');

        expect(component.filteredData.length).toBe(1);
        expect(component.filteredData[0].name).toBe('Bob');
    });

    it('should reset global search when empty', () => {
        component.onGlobalSearch('');
        expect(component.filteredData.length).toBe(3);
    });

    it('should toggle mobile selection', () => {
        component.pageSize = 10;
        component.applyAll();

        component.toggleSelectAllMobile();
        expect(component.selectedRows.size).toBe(3);

        component.toggleSelectAllMobile();
        expect(component.selectedRows.size).toBe(0);
    });

});