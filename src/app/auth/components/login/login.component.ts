import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loading:boolean = false
  passwordError: string = '';

  constructor(private authService:AuthService, private fb: FormBuilder, private router:Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    console.log(this.loginForm.value);
    if(this.loginForm.valid) {
      this.loading = true;

      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).then(r => {
        let accessToken = r.user.multiFactor.user.accessToken
        localStorage.setItem('accessToken', accessToken);
        let uid = r.user.uid
        this.getUserByUID(uid);
      })
        .catch(() => {
          this.loading = false;
          this.passwordError = "Incorrect email or password."
        });
    } else {
      return;
    }

  }

  private getUserByUID(uid:string) {
    this.authService.getUserByUID(uid).subscribe({
      next: (user) => {
        if(user){
          localStorage.setItem('role', user!.role);
          localStorage.setItem('fullName', user?.fullName!!);
          // @ts-ignore
          localStorage.setItem('currentUser', JSON.stringify(user));
        }

        this.passwordError = "";
        this.loading = false;
        this.router.navigate(['/subjects']).then();
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
      }
    })
  }
}
