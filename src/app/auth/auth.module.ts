import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatRadioModule} from "@angular/material/radio";
import {MatButtonModule} from "@angular/material/button";



@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent
  ],
    imports: [
      MatFormFieldModule,
      MatInputModule,
      MatRadioModule,
      MatButtonModule,
      SharedModule,
      CommonModule,
      ReactiveFormsModule
    ]
})
export class AuthModule { }
