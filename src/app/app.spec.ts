import { render, screen, fireEvent } from '@testing-library/angular';
import { of, throwError } from 'rxjs';
import { App } from './app';
import { AuthService } from './services/auth.service';
import { UserSessionService } from '@poc-mfe/shared';
import { ReactiveFormsModule } from '@angular/forms';
import { vi } from 'vitest';

describe('App (LoginComponent)', () => {

  let mockAuth: any;
  let mockUserSession: any;

  beforeEach(async () => {
    mockAuth = {
      login: vi.fn()
    };
    mockUserSession = {
      saveSession: vi.fn()
    };
  });

  it('debería crear el formulario al inicializar', async () => {
    const { fixture } = await render(App, {
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: mockAuth },
        { provide: UserSessionService, useValue: mockUserSession }
      ]
    });

    const comp = fixture.componentInstance;
    comp.ngOnInit();

    expect(comp.loginForm).toBeDefined();
    expect(comp.loginForm.get('username')).toBeTruthy();
    expect(comp.loginForm.get('password')).toBeTruthy();
  });

  it('debería llamar al servicio AuthService.login y guardar sesión en caso de éxito', async () => {
    // mock: login devuelve un observable con un usuario
    const mockUser = { id: 1, name: 'John' };
    mockAuth.login.mockReturnValue(of(mockUser));

    const { fixture } = await render(App, {
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: mockAuth },
        { provide: UserSessionService, useValue: mockUserSession }
      ]
    });

    const comp = fixture.componentInstance;
    comp.ngOnInit();

    comp.loginForm.setValue({ username: 'john', password: '1234' });
    comp.login();

    // assertions
    expect(mockAuth.login).toHaveBeenCalledWith('john', '1234');
    expect(mockUserSession.saveSession).toHaveBeenCalledWith(mockUser);
    expect(comp.sendingData()).toBe(false);
    expect(comp.isInvalidLogin()).toBe(false);
  });

  it('debería marcar isInvalidLogin en true cuando el login falla', async () => {
    mockAuth.login.mockReturnValue(throwError(() => new Error('invalid credentials')));

    const { fixture } = await render(App, {
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: mockAuth },
        { provide: UserSessionService, useValue: mockUserSession }
      ]
    });

    const comp = fixture.componentInstance;
    comp.ngOnInit();

    comp.loginForm.setValue({ username: 'baduser', password: 'wrong' });
    comp.login();

    expect(mockAuth.login).toHaveBeenCalled();
    expect(comp.sendingData()).toBe(false);
    expect(comp.isInvalidLogin()).toBe(true);
  });

  it('userNameIsInvalid debe reflejar el estado del control', async () => {
    const { fixture } = await render(App, {
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: mockAuth },
        { provide: UserSessionService, useValue: mockUserSession }
      ]
    });
    const comp = fixture.componentInstance;
    comp.ngOnInit();

    const usernameCtrl = comp.loginForm.get('username')!;
    usernameCtrl.markAsTouched();
    usernameCtrl.setValue('');

    expect(comp.userNameIsInvalid).toBe(true);

    usernameCtrl.setValue('valid');
    expect(comp.userNameIsInvalid).toBe(false);
  });
});
