import { Injectable } from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {Answer, Question, Subject} from "../Classes/Models";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  constructor(private db: AngularFireDatabase) { }

  async addSubject(subject: Subject) {
    // Push the item to the database and get the auto-generated key
    const itemRef = await this.db.list<Subject>('subjects').push(subject);
    const subjectId = itemRef.key;

    // Set the generated key as the ITEM_ID property of the item
    subject.id = subjectId!;

    // Update the item in the database with the generated key
    await itemRef.update(subject);

    return subject.id;
  }

  getSubjects(professorId: string): Observable<Subject[]> {
    return this.db.list<Subject>('subjects', ref =>
      ref.orderByChild('professorId').equalTo(professorId)
    ).valueChanges().pipe(
      map(items => {
        if (!items || !items.length) {
          return []; // Handle empty list scenario
        }
        const subjects = items.map(subject => ({
          ...subject,
          createdAt: new Date(subject.createdAt) // Convert createdAt to Date
        }));

        return subjects.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      })
    );
  }

  getAllSubjects(): Observable<Subject[]> {
      return this.db.list<Subject>('subjects').valueChanges().pipe(
        map(items => {
          if (!items || !items.length) {
            return []; // Handle empty list scenario
          }

          // Ensure createdAt is a Date object for sorting
          const subjects = items.map(subject => ({
            ...subject,
            createdAt: new Date(subject.createdAt) // Convert createdAt to Date
          }));

          return subjects.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        })
      );
  }

  deleteSubject(subjectId:string) : Promise<void> {
    return this.db.object<Subject>(`subjects/${subjectId}`).remove()
  }

  async addQuestion(question: any) {
    const itemRef = await this.db.list<Question>('questions').push(question);
    question.id = itemRef.key;
    await itemRef.update(question);
  }

  async addAnswer(answer: any) {
    const itemRef = await this.db.list<Answer>('answers').push(answer);
    answer.id = itemRef.key;
    await itemRef.update(answer);
  }
}
