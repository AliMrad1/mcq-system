import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ExamService} from "../../../services/exam.service";
import {AuthService} from "../../../services/auth.service";
import {ExamResult} from "../../../Classes/Models";

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {

  displayedColumns: string[] = [];
  dataSource:any;
  examResults:ExamResult[] = [];
  constructor(
    private examService: ExamService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ){
   }


  ngOnInit(): void {
    if(this.getUserRole() === 'Professor') {
      this.displayedColumns = ['id', 'full_name', 'email','subject_name','score','result'];
      this.getAllExamResultsByProfessorId();
    } else if(this.getUserRole() === 'Student') {
      this.displayedColumns = ['id','subject_name','score','result'];
      this.getAllExamResultsByStudentId();
    }
  }

  private getAllExamResultsByProfessorId() {
    this.examService.getAllExamResultsForStudentsByProfessorId(this.authService.getUserUID()!).subscribe({
      next: (result) => {
        console.log(result);
        this.examResults = result;
        this.organizeDataSourceForProfessor()
      },
      error: (err) => {
        console.log(err)
      },
      complete: () => {
        console.log('complete')
      }
    });
  }

  private getAllExamResultsByStudentId() {
    this.examService.getAllExamResultsForStudentsByStudentId(this.authService.getUserUID()!).subscribe({
      next: (result) => {
        console.log(result);
        this.examResults = result;
        this.organizeDataSourceForStudent()
      },
      error: (err) => {
        console.log(err)
      },
      complete: () => {
        console.log('complete')
      }
    });
  }

  private organizeDataSourceForProfessor() {
    this.dataSource = this.examResults.map((examResult: ExamResult, index: number) => {
      return {
        id: examResult.id,
        full_name: examResult.user.full_name,
        email: examResult.user.email,
        subject_name: examResult.subject.subject_name,
        score: examResult.score,
        result: examResult.result
      }
    });
    this.cdr.detectChanges();
  }

  private organizeDataSourceForStudent() {
    this.dataSource = this.examResults.map((examResult: ExamResult, index: number) => {
      return {
        id: examResult.id,
        subject_name: examResult.subject.subject_name,
        score: examResult.score,
        result: examResult.result
      }
    });
    this.cdr.detectChanges();
  }

  getUserRole() {
    return this.authService.getUserRole()!;
  }

}
