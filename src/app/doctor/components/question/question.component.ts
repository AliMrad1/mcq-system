import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Question} from "../../../Classes/Models";
import {QuestionsService} from "../../../services/questions.service";

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent {

  @Input() question: Question | null = null;
  @Input() i:number = 0;
  @Output() emitDeleteQuestion = new EventEmitter();

  loading = false;

  constructor(private questionsService:QuestionsService) {}

  deleteQuestion(id: string | undefined) {
    this.loading = true;
    this.questionsService.deleteQuestion(id!).then(() => {
      this.questionsService.deleteAnswersByQuestionId(id!).then(() => {
        this.loading = false;
        this.emitDeleteQuestion.emit(true);
      });
    }).catch(e => {
      this.loading = false;
      this.emitDeleteQuestion.emit(false);
    });
  }
}
