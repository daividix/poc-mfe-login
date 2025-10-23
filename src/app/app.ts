import { Component, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { UserSessionService } from '@poc-mfe/shared';

@Component({
  selector: 'login-root',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  
  loginForm!: FormGroup;
  isInvalidLogin = signal<boolean>(false);
  sendingData = signal<boolean>(false);

  constructor(
    private _auth: AuthService,
    private _userSession: UserSessionService
    ) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required])
    });

    this.loginForm.valueChanges.subscribe(value => {
      if(this.isInvalidLogin()) {
        this.isInvalidLogin.set(false);
      }
    });
  }

  get userNameIsInvalid() {
    return this.loginForm.get('username')?.invalid && 
    this.loginForm.get('username')?.touched
  }

  get passwordIsInvalid() {
    return this.loginForm.get('password')?.invalid && 
    this.loginForm.get('password')?.touched
  }


  login() {
    const user = this.loginForm.get('username')?.value;
    const pass = this.loginForm.get('password')?.value
    this.sendingData.set(true);
    this._auth.login(user, pass)
    .subscribe(us => {
      console.log(us);
      this.sendingData.set(false);
      this._userSession.saveSession(us);
    }, error => {
      console.log(error)
      this.sendingData.set(false);
      this.isInvalidLogin.set(true);
    })
  }
}
