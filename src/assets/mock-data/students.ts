import type { Student } from "../../core/models/Student";
import type { ClassOption } from "../../core/models/Class";


export const MOCK_CLASSES: ClassOption[] = [
  {
    id: "73299BF6-9E9D-4844-80FA-27B26B5CD400",
    name: "10-A",
    grade: 10,
    maxStudents: 30,
  },
  {
    id: "73299BF6-9E9D-4844-80FA-27B26B5CD401",
    name: "10-B",
    grade: 10,
    maxStudents: 30,
  },
  {
    id: "73299BF6-9E9D-4844-80FA-27B26B5CD402",
    name: "11-A",
    grade: 11,
    maxStudents: 25,
  },
  {
    id: "73299BF6-9E9D-4844-80FA-27B26B5CD403",
    name: "11-B",
    grade: 11,
    maxStudents: 25,
  },
];

export const MOCK_STUDENTS: Student[] = [
  {
    id: "1A992E60-D99A-4DE0-A0C9-ADF4F415D69A",
    firstName: "Ahmet",
    lastName: "Yılmaz",
    email: "ahmet.yilmaz@student.edu",
    phoneNumber: "(555) 123-4567",
    classId: "10A",
    gpa: 3.42,
    enrollmentDate: new Date("2024-09-01"),
    isActive: true,
    dateCreated: new Date("2024-09-01"),
    dateModified: new Date("2024-09-01"),
  },
  {
    id: "1A992E60-D99A-4DE0-A0C9-ADF4F415D69B",
    firstName: "Ayşe",
    lastName: "Demir",
    email: "ayse.demir@student.edu",
    phoneNumber: "(555) 234-5678",
    classId: "11B",
    gpa: 3.68,
    enrollmentDate: new Date("2023-09-01"),
    isActive: true,
    dateCreated: new Date("2023-09-01"),
    dateModified: new Date("2024-01-15"),
  },  {
    id: "1A992E60-D99A-4DE0-A0C9-ADF4F415D69C",
    firstName: "okan",
    lastName: "kanık",
    email: "okan.kanık@student.edu",
    phoneNumber: "(555) 234-5678",
    classId: "11B",
    gpa: 3.68,
    enrollmentDate: new Date("2023-09-01"),
    isActive: true,
    dateCreated: new Date("2023-09-01"),
    dateModified: new Date("2024-01-15"),
  },

];