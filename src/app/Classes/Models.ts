export class User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  createdAt: Date;

  constructor(
    id: string,
    fullName: string,
    email: string,
    role: string,
  ) {
    this.id = id;
    this.fullName = fullName;
    this.email = email;
    this.role = role;
    this.createdAt = new Date();
  }
}

export class Student {
  id: string;
  userId: string;
  registrationNumber: string;
  major: string;
  currentSemester: number;

  constructor(
    id: string,
    userId: string,
    registrationNumber: string,
    major: string,
    currentSemester: number
  ) {
    this.id = id;
    this.userId = userId;
    this.registrationNumber = registrationNumber;
    this.major = major;
    this.currentSemester = currentSemester;
  }
}

export class Professor {
  id: string;
  userId: string;
  department: string;
  faculty: string;
  yearsOfExperience: number;
  specialization: string;

  constructor(
    id: string,
    userId: string,
    department: string,
    faculty: string,
    yearsOfExperience: number,
    specialization: string
  ) {
    this.id = id;
    this.userId = userId;
    this.department = department;
    this.faculty = faculty;
    this.yearsOfExperience = yearsOfExperience;
    this.specialization = specialization;
  }
}

export class Subject {
  id: string;
  professorId: string;
  name: string;
  code: string;
  createdAt: Date;
  questions: Question[];

  constructor(id: string, professorId: string, name: string, code: string) {
    this.id = id;
    this.professorId = professorId;
    this.name = name;
    this.code = code;
    this.createdAt = new Date();
    this.questions = [];
  }
}


export class Answer {
  id: string;
  questionId: string;
  text: string;

  constructor(id: string, questionId: string, text: string, isCorrect: boolean) {
    this.id = id;
    this.questionId = questionId;
    this.text = text;
  }
}

export class Question {
  id: string;
  subjectId: string;
  text: string;
  answers: Answer[];
  correctAnswerIndex:number;
  createdAt: Date;

  constructor(id: string, subjectId: string, text: string, correctAnswerIndex:number,answers: Answer[]) {
    this.id = id;
    this.subjectId = subjectId;
    this.text = text;
    this.correctAnswerIndex = correctAnswerIndex;
    this.answers = answers;
    this.createdAt = new Date();
  }
}

export class ExamResult {
  id: string;
  studentId: string;
  subjectId: string;
  professorId: string;
  score: number;
  result:string;
  createdAt: Date;
  user:UserInfo;
  subject:SubjectInfo;

  constructor(id: string, studentId: string, subjectId: string, score: number, result:string, professorId: string, user: UserInfo, subject: SubjectInfo) {
    this.id = id;
    this.studentId = studentId;
    this.subjectId = subjectId;
    this.score = score;
    this.result = result;
    this.professorId = professorId;
    this.createdAt = new Date();
    this.user = user;
    this.subject = subject;
  }
}

export class UserInfo {
  id:string;
  full_name: string;
  email: string;

  constructor(id: string, full_name: string, email: string) {
    this.id = id;
    this.full_name = full_name;
    this.email = email;
  }
}

export class SubjectInfo {
  id: string;
  subject_name:string;

  constructor(id: string, subject_name: string) {
    this.id = id;
    this.subject_name = subject_name;
  }
}
