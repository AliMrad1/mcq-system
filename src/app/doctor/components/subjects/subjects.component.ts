import { Component, OnInit } from '@angular/core';
import {SubjectService} from "../../../services/subject.service";
import {Subject} from "../../../Classes/Models";
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.scss']
})
export class SubjectsComponent implements OnInit {

  subjects:Subject[] = [];

  constructor(private subject:SubjectService,private authService:AuthService, private router:Router) { }

  ngOnInit(): void {
    this.getSubjects();
  }

  getSubjects(){

    if(this.getUserRole() == 'Professor') {
      // @ts-ignore
      return this.subject.getSubjects(this.authService.getUserUID()).subscribe({
        next: (data) => {
          this.subjects = data
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          console.log('complete');
        }
      });
    } else {
      return this.subject.getAllSubjects().subscribe({
        next: (data) => {
          this.subjects = data
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          console.log('complete');
        }
      });
    }

  }

  deleteSubject(id:string){
    this.subject.deleteSubject(id).then(() => {

    })
  }

  getUserRole() : string{
    return this.authService.getUserRole()!;
  }

  goToShowExamsDetails(id: string) {
    this.router.navigate(['/show-exam'], {queryParams: {id: id}}).then()
  }

  goToExamTest(id: string) {
    this.router.navigate(['/exam'], {queryParams: {id: id}}).then()
  }
}
