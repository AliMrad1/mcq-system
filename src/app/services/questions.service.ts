import { Injectable } from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {Observable} from "rxjs";
import {Answer, Question, Subject} from "../Classes/Models";

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {

  constructor(private db: AngularFireDatabase) { }

  getSubjectById(subjectID: string): Observable<any> {
    return this.db.object<Subject>(`subjects/${subjectID}`).valueChanges();
  }

  getQuestionsBySubjectId(subjectID: string): Observable<Question[]> {
    return this.db.list<Question>(`questions`, ref =>
      ref.orderByChild('subjectId').equalTo(subjectID)).valueChanges();
  }

  getAnswersByQuestionId(questionID: string): Observable<Answer[]> {
    return this.db.list<Answer>(`answers`, ref =>
      ref.orderByChild('questionId').equalTo(questionID)).valueChanges();
  }

  deleteQuestion(id: string) {
    return this.db.object(`questions/${id}`).remove();
  }

  deleteAnswersByQuestionId(id: string) {
    return this.db.list(`answers`, ref => ref.orderByChild('questionId').equalTo(id)).remove();
  }
}
