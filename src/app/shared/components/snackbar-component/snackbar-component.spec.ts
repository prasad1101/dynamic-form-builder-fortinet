import { TestBed } from '@angular/core/testing';
import { SnackbarComponent } from './snackbar-component';
import { SnackbarService } from '../../../core/services/snackbar-service';
import { BehaviorSubject } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SnackbarComponent', () => {

    let mockService: any;

    beforeEach(async () => {

        // mock snackbar service
        mockService = {
            messages$: new BehaviorSubject([]),
            remove: vi.fn()
        };

        TestBed.configureTestingModule({
            imports: [SnackbarComponent],
            providers: [
                { provide: SnackbarService, useValue: mockService }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });

        // override template to avoid templateUrl issue
        TestBed.overrideComponent(SnackbarComponent, {
            set: {
                template: `<div *ngFor="let m of messages$ | async">{{ m.text }}</div>`
            }
        });

        await TestBed.compileComponents();
    });

    it('should create component', () => {
        const fixture = TestBed.createComponent(SnackbarComponent);
        const component = fixture.componentInstance;

        expect(component).toBeTruthy();
    });

    it('should render messages from service', () => {
        const fixture = TestBed.createComponent(SnackbarComponent);

        mockService.messages$.next([
            { id: '1', text: 'Hello', type: 'info', duration: 1000 }
        ]);

        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.textContent).toContain('Hello');
    });

    it('should call remove on service when remove is triggered', () => {
        const fixture = TestBed.createComponent(SnackbarComponent);
        const component = fixture.componentInstance;

        component.remove('123');

        expect(mockService.remove).toHaveBeenCalledWith('123');
    });

});