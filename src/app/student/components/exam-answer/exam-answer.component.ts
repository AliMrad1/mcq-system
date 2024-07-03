import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Answer} from "../../../Classes/Models";

@Component({
  selector: 'app-exam-answer',
  templateUrl: './exam-answer.component.html',
  styleUrls: ['./exam-answer.component.scss']
})
export class ExamAnswerComponent {

  @Input() index = 0;
  // @ts-ignore
  @Input() answer:Answer
  @Input() questionIndex!: number;
  @Output() onAnswerSelected = new EventEmitter();

  onAnswerSelect(){
    console.log(this.index)
    this.onAnswerSelected.emit({answerIndex:this.index, questionIndex: this.questionIndex});
  }
}
