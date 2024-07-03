import {Component, Input, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  ɵGetProperty,
  ɵTypedOrUntyped
} from "@angular/forms";
import {SubjectService} from "../../../services/subject.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.scss']
})
export class AddQuestionComponent implements OnInit {

  @Input() subjectId = "";
  @Input() noNeedStepper = true;

  loading:boolean = false
  professorId:string = '';
  questionCollapsed: boolean[] = [];
  completedStepper = [true, true, true];

  questions: any[] = [];

  quizForm: FormGroup;

  constructor(private subjectService:SubjectService, private fb: FormBuilder, private activatedRoute:ActivatedRoute) {
    this.quizForm = this.fb.group({
      questions: this.fb.array([])
    });

    this.activatedRoute.queryParamMap.subscribe(params => {
      // @ts-ignore
      if (params.get('id')){
        // @ts-ignore
        this.subjectId = params.get('id');
      }
    });
  }

  ngOnInit(): void {
    this.professorId = localStorage.getItem("userID")!;
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

  addQuestion(subjectId: string) {
    this.questionsFormArray.push(this.createQuestion(subjectId));
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
