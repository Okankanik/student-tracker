import { MOCK_STUDENTS } from "../../assets/mock-data/students";
const STORAGE_KEY = "students"; // LocalStorage'da kullanılacak anahtar ismi

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
  // LocalStorage'dan tüm öğrencileri al
  const students = getStudents();

  // id parametresi ile eşleşmeyen öğrencileri filtrele (yani silmek istediğimiz id hariç tüm öğrencileri)
  const filteredStudents = students.filter((student) => student.id !== id);

  // Güncellenmiş öğrenci listesini tekrar LocalStoragea JSON formatında kaydet
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredStudents));
}


export default {
  getStudents,
  deleteStudents,
};
