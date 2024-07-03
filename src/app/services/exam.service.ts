import { Injectable } from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {forkJoin, Observable} from "rxjs";
import {ExamResult, Student, Subject, User} from "../Classes/Models";

@Injectable({
  providedIn: 'root'
})
export class ExamService {

  constructor(private db: AngularFireDatabase) { }

  async addExamResult(result:ExamResult) {
    const itemRef = await this.db.list<ExamResult>('exam-results').push(result);
    const examResultId = itemRef.key;

    // Set the generated key as the ITEM_ID property of the item
    result.id = examResultId!;

    // Update the item in the database with the generated key
    await itemRef.update(result);

    return result.id;
  }

  getAllExamResultsForStudentsByProfessorId(professorId: string): Observable<ExamResult[]> {
    // @ts-ignore
    return this.db.list<ExamResult>('exam-results', ref =>
      ref.orderByChild('professorId').equalTo(professorId)
    ).valueChanges();
  }


  getStudentById(studentId: string): Observable<User> {
    // @ts-ignore
    return this.db.object<User>(`users/${studentId}`).valueChanges();
  }

  getAllExamResultsForStudentsByStudentId(studentId: string) {
    // @ts-ignore
    return this.db.list<ExamResult>('exam-results', ref =>
      ref.orderByChild('studentId').equalTo(studentId)
    ).valueChanges();
  }
}
