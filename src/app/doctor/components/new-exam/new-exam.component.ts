import { Component, OnInit } from '@angular/core';
import {SubjectService} from "../../../services/subject.service";
import {Subject} from "../../../Classes/Models";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  ɵGetProperty,
  ɵTypedOrUntyped
} from "@angular/forms";

@Component({
  selector: 'app-new-exam',
  templateUrl: './new-exam.component.html',
  styleUrls: ['./new-exam.component.scss']
})
export class NewExamComponent implements OnInit {

  loading:boolean = false
  subjectName:string = '';
  professorId:string = '';
  questionCollapsed: boolean[] = [];
  completedStepper = [true, true, true];

  questions: any[] = [];

  quizForm: FormGroup;

  subjectId:string = '';

  constructor(private subjectService:SubjectService, private fb: FormBuilder) {
    this.quizForm = this.fb.group({
      questions: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.professorId = localStorage.getItem("userID")!;
  }

  addSubject(){

    if(this.subjectName !== ''){
      this.loading = true;
      let subject = new Subject("",this.professorId, this.subjectName, this.subjectName.slice(0,2));
      this.subjectService.addSubject(subject).then(r => {

        this.loading = false;
        this.completedStepper[1] = true;

        this.subjectId = subject.id;
        this.quizForm.get('subjectId')?.setValue(subject.id);

        // Create questions with the subjectId
        const questionsArray = this.quizForm.get('questions') as FormArray;
        const newQuestion = this.createQuestion(subject.id);
        questionsArray.push(newQuestion);

      }).catch(err => {
        console.log(err);
      });
    } else {
      return;
    }

  }

  createQuestion(subjectId:string): FormGroup {
    return this.fb.group({
      id: [''],
      subjectId: subjectId,
      text: ['', Validators.required],
      answers: this.fb.array([
        this.createAnswer(),
        this.createAnswer(),
        this.createAnswer(),
        this.createAnswer()
      ]),
      correctAnswerIndex: [null, Validators.required]
    });
  }

  createAnswer(): FormGroup {
    return this.fb.group({
      id: [''],
      text: ['', Validators.required]
    });
  }

  get questionsFormArray(): FormArray {
    return this.quizForm.get('questions') as FormArray;
  }

  answersFormArray(question: AbstractControl): ɵTypedOrUntyped<any, Array<any>, Array<AbstractControl<any>>> {
    return (question.get('answers') as FormArray).controls;
  }

  addQuestion(subjectId: AbstractControl<ɵGetProperty<any, "subjectId">> | null) {
    this.questionsFormArray.push(this.createQuestion(subjectId?.value));
  }

  removeQuestion(index: number) {
    if (this.questionsFormArray.length > 1) {
      this.questionsFormArray.removeAt(index);
    }
  }

  addAnswer(question: AbstractControl) {
    const answers = question.get('answers') as FormArray;
    answers.push(this.createAnswer());
  }

  removeAnswer(question: AbstractControl, index: number) {
    const answers = question.get('answers') as FormArray;
    if (answers.length > 1) {
      answers.removeAt(index);
    }
  }

  saveQuiz() {
    const quizData = this.quizForm.value;
    this.loading = true;

    let questions = quizData.questions; // array of questions
    const promises = questions.map(async (question: any) => {
      await this.subjectService.addQuestion(question);
      const answerPromises = question.answers.map((answer: any) => {
        answer.questionId = question.id;
        return this.subjectService.addAnswer(answer);
      });
      return Promise.all(answerPromises);
    });

    Promise.all(promises)
      .then(() => {
        this.loading = false;
        this.completedStepper[2] = true;
        this.questions = questions;
      })
      .catch((err: any) => {
        console.error('Error saving questions and answers:', err);
      });


  }

  toggleQuestion(index: number) {
    this.questionCollapsed[index] = !this.questionCollapsed[index];
  }
}
