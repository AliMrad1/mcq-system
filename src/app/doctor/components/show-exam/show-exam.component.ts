import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {QuestionsService} from "../../../services/questions.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Question, Subject} from "../../../Classes/Models";
import {forkJoin} from "rxjs";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-show-exam',
  templateUrl: './show-exam.component.html',
  styleUrls: ['./show-exam.component.scss']
})
export class ShowExamComponent implements OnInit {

  @Input() subjectName: string = '';
  @Input() questions: any[] = [];
  @Input() subjectId = '';
  loading:boolean = false;

  constructor(private questionsService:QuestionsService,
              private route: ActivatedRoute,
              private cdr: ChangeDetectorRef,
              private authService: AuthService,
              private router: Router
  ) {
    this.route.queryParamMap.subscribe(params => {
      // @ts-ignore
      this.subjectId = params.get('id');
    });
  }

  ngOnInit() {
    if (this.questions.length === 0) {
      this.getSubjectDetails();
    }
  }

  getSubjectDetails() {
    this.questionsService.getSubjectById(this.subjectId).subscribe({
      next: (subject) => {
        this.subjectName = subject.name;
        this.getQuestions();
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
      }
    });
  }

  getQuestions() {
    this.questionsService.getQuestionsBySubjectId(this.subjectId).subscribe({
      next: (questions) => {
        if (questions.length === 0) {
          this.questions = [];
        } else {
          this.questions = questions;
          this.getAnswersForQuestions(questions);
        }
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
      }
    });
  }

  getAnswersForQuestions(questions: Question[]) {
    const answersObservables = questions.map(question =>
      this.questionsService.getAnswersByQuestionId(question.id)
    );

    forkJoin(answersObservables).subscribe({
      next: (answersArray) => {
        questions.forEach((question, index) => {
          question.answers = answersArray[index];
        });
        // Manually trigger change detection
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log('Data fetching completed');
      }
    });
  }

  isQuestionDeleted($event: any) {
    if($event === true) {
      alert('Question deleted')
      this.getQuestions()
    }
  }

  getUserRole() : string{
    return this.authService.getUserRole()!;
  }

  backToAllExams() {
    this.router.navigate(['subjects']).then();
  }

  goToAddQuestionPage(subjectId: string) {
    this.router.navigate(['add-question'], { queryParams: {id: subjectId} }).then();
  }
}
