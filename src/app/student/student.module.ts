import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamComponent } from './components/exam/exam.component';
import { SharedModule } from '../shared/shared.module';
import { ExamQuestionComponent } from './components/exam-question/exam-question.component';
import { ExamAnswerComponent } from './components/exam-answer/exam-answer.component';
import {ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    ExamComponent,
    ExamQuestionComponent,
    ExamAnswerComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    ReactiveFormsModule
  ]
})
export class StudentModule { }
