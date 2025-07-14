import { MOCK_STUDENTS } from "../../assets/mock-data/students";

const STORAGE_KEY = "students"; // LocalStorage'da kullanılacak anahtar ismi

function getStudents() {
  // LocalStoragedan students anahtarı ile veri al
  let data = localStorage.getItem(STORAGE_KEY);

  // Eğer LocalStorage boşsa mock veriyi kaydet ve tekrar oku
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_STUDENTS));
    data = localStorage.getItem(STORAGE_KEY);
  }

  // Eğer hala veri yoksa boş dizi döndür
  if (!data) {
    return [];
  }

  // LocalStorage'daki JSON'ı js ye dönüştür
  return JSON.parse(data);
}

export default {
  getStudents,
};
