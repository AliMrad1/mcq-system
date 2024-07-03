import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Question} from "../../../Classes/Models";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-exam-question',
  templateUrl: './exam-question.component.html',
  styleUrls: ['./exam-question.component.scss']
})
export class ExamQuestionComponent {

  // @ts-ignore
  @Input() question: Question;
  @Input() i:number =1;
  @Output() correctAnswerSelected = new EventEmitter();
  questionForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.questionForm = this.fb.group({
      selectedAnswer: [null]
    });
  }

  onAnswerSelect(event:any): void {
    const {answerIndex, questionIndex} = event

    if(answerIndex === this.question.correctAnswerIndex) {
      this.correctAnswerSelected.emit({answerIndex, questionIndex, correctAnswerIndex: true});
    } else {
      this.correctAnswerSelected.emit({answerIndex, questionIndex, correctAnswerIndex: false});
    }
  }
}
