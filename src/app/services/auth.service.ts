import { Injectable } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {Observable} from "rxjs";
import {Professor, Student, User} from "../Classes/Models";
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<any>;

  constructor(private afAuth: AngularFireAuth,private db: AngularFireDatabase) {
    this.user$ = this.afAuth.authState;
  }

  async login(email: string, password: string): Promise<any> {
    try {
      const result = await this.afAuth.signInWithEmailAndPassword(email, password);

      if (result.user) {
        const adminId = result.user.uid;
        localStorage.setItem('userID', adminId);
      }

      return result;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.afAuth.signOut();

      // Remove access token from local storage
      localStorage.removeItem('accessToken');
      // Remove user uid from local storage
      localStorage.removeItem('userID');
      // Remove role from local storage
      localStorage.removeItem('role');
    } catch (error) {
      console.log('Error logging out:', error);
      throw error;
    }
  }

  isLoggedIn() {
    return !!localStorage.getItem('accessToken');
  }


  async registerUser(user: User,password:string, role: string, data: any): Promise<void> {
    try {

      if (!user.email || !password) {
        throw new Error('Email and password are required.');
      }

      const userCredential = await this.afAuth.createUserWithEmailAndPassword(user.email, password);
      if (!userCredential.user) {
        throw new Error('Failed to create user with Firebase Authentication.');
      }

      const { uid } = userCredential.user;

      // Set user data in the `users` collection
      await this.db.object(`users/${uid}`).set(user);

      // Set role-specific data in the appropriate collection
      const roleData = { ...data, userId: uid }; // Ensure data object is spread to avoid mutation
      await this.db.object(`${role.toLowerCase()}s/${uid}`).set(roleData);
    } catch (error) {
      console.error('Error registering user:', error);
      throw error; // Re-throw the error to handle it in the component
    }
  }

  getUserByUID(uid: string): Observable<User | null> {
    return this.db.object<User>(`users/${uid}`).valueChanges().pipe(
      map(user => user ? user : null)
    );
  }

  getUserRole() {
    return localStorage.getItem('role');
  }

  getFullName(){
    return localStorage.getItem('fullName');
  }

  getUserUID() {
    return localStorage.getItem('userID');
  }

  getCurrentUserFromLocalStorage(){
    return JSON.parse(localStorage.getItem('currentUser')!!);
  }
}
