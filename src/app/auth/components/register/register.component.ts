import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, MinLengthValidator, Validators} from "@angular/forms";
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";
import {Professor, Student, User} from "../../../Classes/Models";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  loading:boolean = false

  constructor(private authService:AuthService, private fb: FormBuilder, private router:Router) {
    this.registerForm = this.fb.group({
      role: ['', Validators.required],
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      registrationNumber: [null, [Validators.min(10)]],
      major: [''],
      currentSemester: [null, [Validators.min(1)]],
      department: [''],
      faculty: [''],
      yearsOfExperience: [null, [Validators.min(0)]],
      specialization: ['']
    });
  }

  ngOnInit(): void {
  }

  register() :void {
    if(this.registerForm.valid) {
      this.loading = true;
      let roleT = this.switchBetweenStudentAndDoctor()

      let data = this.registerForm.value
      let dataExtra;
      if(roleT === 'Student') {
        dataExtra = new Student("","",data.registrationNumber, data.major, data.currentSemester);
      } else if(roleT === 'Professor') {
        dataExtra = new Professor("","", data.department, data.faculty, data.yearsOfExperience, data.specialization);
      }

      let user = new User("", data.fullName, data.email, data.role)

      this.authService.registerUser(user, data.password, data.role,dataExtra).then((res) => {
        this.loading = false;
        console.log(res)
        this.registerForm.reset();
        this.router.navigate(['/login']).then();
      })
        .catch((err) => {
          this.loading = false;
          console.log(err)
          // this.passwordError = "Incorrect email or password."
        });
    }
  }

  switchBetweenStudentAndDoctor() : string {
     return this.registerForm.controls['role'].value;
  }

}
