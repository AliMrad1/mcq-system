import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { NewExamComponent } from './components/new-exam/new-exam.component';
import { StudentsComponent } from './components/students/students.component';
import { SubjectsComponent } from './components/subjects/subjects.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NumberToAlphabetPipe} from "./number-to-alphabet.pipe";
import { ShowExamComponent } from './components/show-exam/show-exam.component';
import { QuestionComponent } from './components/question/question.component';
import { AddQuestionComponent } from './components/add-question/add-question.component';



@NgModule({
  declarations: [
    NewExamComponent,
    StudentsComponent,
    SubjectsComponent,
    NumberToAlphabetPipe,
    ShowExamComponent,
    QuestionComponent,
    AddQuestionComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class DoctorModule { }
