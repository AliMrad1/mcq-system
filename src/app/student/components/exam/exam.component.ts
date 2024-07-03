import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ExamResult, Question, SubjectInfo, UserInfo} from "../../../Classes/Models";
import {forkJoin} from "rxjs";
import {QuestionsService} from "../../../services/questions.service";
import {MatDialog} from "@angular/material/dialog";
import {DialogComponent} from "../../../shared/components/dialog/dialog.component";
import {ExamService} from "../../../services/exam.service";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.scss']
})
export class ExamComponent implements OnInit {

  subjectId: string = '';
  subjectName: string = '';

  questions: Question[] = [];
  correctAnswerSelected:number =0
  selectedQuestions = new Set();
  private message: any;
  loading: boolean = false;
  private professorId: string = '';

  constructor(private route:ActivatedRoute,
              private questionsService:QuestionsService,
              private cdr: ChangeDetectorRef,
              public dialog: MatDialog,
              private router:Router,
              private examService:ExamService,
              private authService:AuthService
  ) {
    this.route.queryParamMap.subscribe(params => {
      // @ts-ignore
      this.subjectId = params.get('id');
    });
  }

  ngOnInit(): void {
    this.getSubjectDetails();
  }

  getSubjectDetails() {
    this.questionsService.getSubjectById(this.subjectId).subscribe({
      next: (subject) => {
        this.subjectName = subject.name;
        this.professorId = subject.professorId;
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

  onCorrectAnswerSelected($event: any) {
    this.selectedQuestions.add($event.questionIndex)
    console.log(this.selectedQuestions.size)
    console.log(this.questions.length)
    if($event.correctAnswerIndex) {
      this.correctAnswerSelected++;
    }else{
      if(this.correctAnswerSelected === 0) {
        return
      }
      this.correctAnswerSelected--;
    }
  }

  showExamResult(): void {

    if(this.selectedQuestions.size !== this.questions.length){
      return
    }

    this.loading = true;

    if(this.questions.length === this.correctAnswerSelected){
      this.message = "🎉 Congratulation 🎉! You passed the exam.";
    } else if(this.questions.length/2 === this.correctAnswerSelected) {
      this.message = "You passed the exam with a passing grade.";
    } else {
      this.message = "You failed the exam.";
    }

    let user = this.authService.getCurrentUserFromLocalStorage()
    // save the exam score and result in the firebase
    let examResult = new ExamResult(
      '',
      this.authService.getUserUID()!,
      this.subjectId,
      this.correctAnswerSelected * 100 / this.questions.length,
      `${this.questions.length}\\${this.correctAnswerSelected}`,
      this.professorId,
      new UserInfo(this.authService.getUserUID()!,user.fullName,user.email),
      new SubjectInfo(this.subjectId,this.subjectName)
    )

    this.examService.addExamResult(examResult).then(() => {
      this.loading = false;

      const dialogRef = this.dialog.open(DialogComponent, {
        width: '450px',
        data: {
          examScore: this.questions.length,
          correctAnswerSelected: this.correctAnswerSelected,
          message: this.message
        },
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.router.navigate(['/subjects']).then();
      });
    }).catch((error) => {
      this.loading = false;
    });
  }
}
