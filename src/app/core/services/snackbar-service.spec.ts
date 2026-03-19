import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SnackbarService } from './snackbar-service';

describe('SnackbarService', () => {
    let service: SnackbarService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SnackbarService);
    });

    // basic creation
    it('should create service', () => {
        expect(service).toBeTruthy();
    });

    // should add a message
    it('should add a message when show is called', () => {
        service.show('Test message');

        service.messages$.subscribe(messages => {
            expect(messages.length).toBe(1);
            expect(messages[0].text).toBe('Test message');
            expect(messages[0].type).toBe('info');
        });
    });

    // should use default duration if not provided
    it('should use default duration when not specified', () => {
        service.show('Test');

        service.messages$.subscribe(messages => {
            expect(messages[0].duration).toBe(3000);
        });
    });

    // should use custom duration
    it('should use custom duration if provided', () => {
        service.show('Test', 'info', 5000);

        service.messages$.subscribe(messages => {
            expect(messages[0].duration).toBe(5000);
        });
    });

    // should support success shortcut
    it('should add success message', () => {
        service.success('Success message');

        service.messages$.subscribe(messages => {
            expect(messages[0].type).toBe('success');
        });
    });

    // should support error shortcut
    it('should add error message', () => {
        service.error('Error message');

        service.messages$.subscribe(messages => {
            expect(messages[0].type).toBe('error');
        });
    });

    // should support warning shortcut
    it('should add warning message', () => {
        service.warning('Warning message');

        service.messages$.subscribe(messages => {
            expect(messages[0].type).toBe('warning');
        });
    });

    // should support info shortcut
    it('should add info message', () => {
        service.info('Info message');

        service.messages$.subscribe(messages => {
            expect(messages[0].type).toBe('info');
        });
    });

    // should remove a message manually
    it('should remove message by id', () => {
        service.show('Test message');

        let messageId: string = '';

        service.messages$.subscribe(messages => {
            if (messages.length) {
                messageId = messages[0].id;
            }
        });

        service.remove(messageId);

        service.messages$.subscribe(messages => {
            expect(messages.length).toBe(0);
        });
    });

    // should auto remove message after duration
    it('should auto dismiss message after duration', (done) => {
        service.show('Auto dismiss', 'info', 100);

        let messages: any[] = [];

        service.messages$.subscribe(m => {
            messages = m;
        });

        expect(messages.length).toBe(1);

        setTimeout(() => {
            expect(messages.length).toBe(0);
        }, 150);
    });

});