import { MOCK_STUDENTS } from "../../assets/mock-data/students";
const STORAGE_KEY = "students"; 

import type { Student } from "../../core/models/Student";

function getStudents(): Student[] {
  let data = localStorage.getItem(STORAGE_KEY);

  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_STUDENTS));
    data = localStorage.getItem(STORAGE_KEY);
  }

  if (!data) {
    return [];
  }

  return JSON.parse(data) as Student[];
}

function deleteStudents(id: string) {
  const students = getStudents();
  const filteredStudents = students.filter((student) => student.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredStudents));
}

function addStudent(newStudent: Student){
  const students = getStudents();
  students.push(newStudent);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

function updateStudent(studentToUpdate: Student) {
  const students = getStudents();
  const index = students.findIndex((s) => s.id === studentToUpdate.id);

  if (index !== -1) {
    students[index] = studentToUpdate;
    studentToUpdate.dateModified = new Date(); 
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  }
}

function getStudentById(id: string) {
  const students = getStudents();
  return students.find(student => student.id === id) || null;
}

function countStudentsInClass(classId: string): number {
  const students = getStudents();
  return students.filter(student => student.classId === classId).length;
}

export default {
  getStudents,
  deleteStudents,
  addStudent,
  updateStudent,
  getStudentById,
  countStudentsInClass,   
};
