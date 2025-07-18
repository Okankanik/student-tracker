<template>
  <div class="card-container">
    <el-card class="form-card">
      <template #header>
        <div class="card-header">
          <span>Öğrenci Kayıt Formu</span>
        </div>
      </template>

      <el-form :model="form" :rules="rules" ref="formRef" label-position="top">
        <el-form-item label="Ad" prop="firstName">
          <el-input v-model="form.firstName" placeholder="Ad Soyad" />
        </el-form-item>

        <el-form-item label="Soyad" prop="lastName">
          <el-input v-model="form.lastName" placeholder="Soyad" />
        </el-form-item>

        <el-form-item label="E-mail" prop="email">
          <el-input v-model="form.email" placeholder="E-mail" />
        </el-form-item>

        <el-form-item label="Telefon" prop="phoneNumber">
          <el-input v-model="form.phoneNumber" placeholder="Telefon" />
        </el-form-item>

        <el-form-item label="Sınıf" prop="classId">
          <el-select v-model="form.classId" placeholder="Sınıf Seçiniz">
            <el-option
              v-for="cls in classes"
              :key="cls.id"
              :label="cls.name"
              :value="cls.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="Kayıt Tarihi" prop="form.enrollmentDate">
          <el-date-picker
            v-model="form.enrollmentDate"
            type="date"
            placeholder="Pick a date"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item>
          <el-button @click="onSubmit" type="primary" style="width: 100%">
            Kaydet
          </el-button>
        </el-form-item>
      </el-form>

      <template #footer>
        <div></div>
      </template>
    </el-card>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { MOCK_CLASSES } from "../../assets/mock-data/students";
import StudentService from "../../core/services/StudentService";

export default {
  setup() {
    function onSubmit() {
      if (studentId) {
        updateStudent();
      } else {
        addNewStudent();
      }
    }

    const classes = ref(MOCK_CLASSES);
    const route = useRoute();
    const studentId =
      typeof route.params.id === "string" ? route.params.id : null;

    const form = ref({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      classId: "",
      enrollmentDate: "",
    });

    onMounted(() => {
      if (studentId) {
        const student = StudentService.getStudentById(studentId);
        if (student) {
          form.value = {
            firstName: student.firstName,
            lastName: student.lastName,
            email: student.email,
            phoneNumber: student.phoneNumber,
            classId: student.classId,
            enrollmentDate: new Date(student.enrollmentDate)
              .toISOString()
              .substring(0, 10),
          };
        }
      }
    });

    function addNewStudent() {
      const selectedClass = classes.value.find(
        (cls) => cls.id === form.value.classId
      );
      const className = selectedClass ? selectedClass.name : "";

      const newStudent = {
        id: crypto.randomUUID(),
        firstName: form.value.firstName,
        lastName: form.value.lastName,
        email: form.value.email,
        phoneNumber: form.value.phoneNumber,
        classId: className,
        gpa: 1,
        enrollmentDate: new Date(form.value.enrollmentDate),
        isActive: true,
        dateCreated: new Date(),
        dateModified: new Date(),
      };
      StudentService.addStudent(newStudent);
    }

    function updateStudent() {
      if (!studentId) return;

      const updatedStudent = {
        id: studentId,
        firstName: form.value.firstName,
        lastName: form.value.lastName,
        email: form.value.email,
        phoneNumber: form.value.phoneNumber,
        classId: form.value.classId,
        enrollmentDate: new Date(form.value.enrollmentDate),
        isActive: true,
        dateCreated: new Date(), 
        dateModified: new Date(),
        gpa: 1,
      };
      StudentService.updateStudent(updatedStudent);
    }
    return {
      classes,
      form,
      onSubmit,
      addNewStudent,
      updateStudent,
    };
  },
};
</script>
