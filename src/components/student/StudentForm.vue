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
          <el-button @click="addNewStudent" type="primary" style="width: 100%"
            >Kaydet</el-button
          >
        </el-form-item>
      </el-form>

      <template #footer>
        <div></div>
      </template>
    </el-card>
  </div>
</template>

<script>
import { ref } from "vue";
import { MOCK_CLASSES } from "../../assets/mock-data/students";
import { getRules } from "../../core/helpers/validation";
import StudentService from "../../core/services/StudentService";

export default {
  setup() {
    const classes = ref(MOCK_CLASSES);

    const form = ref({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      classId: "",
      enrollmentDate: "",
    });

    const { rules } = getRules();

    function addNewStudent() {
      //seçilen sınıf idsinin ismini alma fonksiyonu
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
        dateCreated: new Date(form.value.enrollmentDate),
        dateModified: new Date(),
      };
      StudentService.addStudent(newStudent);
    }

    return { form, rules, classes, addNewStudent };
  },
};
</script>
