<template>
  <div>
    <el-card>
      <template #header>
        <div>
          <span>Öğrenci İşlemleri</span>
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

        <el-form-item label="Kayıt Tarihi" prop="enrollmentDate">
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
    </el-card>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { getRules } from "../../core/helpers/validation";
import { MOCK_CLASSES } from "../../assets/mock-data/students";
import StudentService from "../../core/services/StudentService";
import { ElMessage } from "element-plus";
import router from "../../router";

export default {
  setup(props) {
    const classes = ref(MOCK_CLASSES);
    const route = useRoute();
    const { rules } = getRules();
    const formRef = ref(null);

    defineProps({
      formData: Object,
      isEditMode: Boolean,
    });

    async function onSubmit() {
      if (studentId) {
        updateStudent();
      } else {
        addNewStudent();
      }
    }

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

      if (!selectedClass) {
        ElMessage.error("Lütfen geçerli bir sınıf seçin.");
        return;
      }

      const currentCount = StudentService.countStudentsInClass(
        selectedClass.id
      );
      // 4. Eğer mevcut öğrenci sayısı sınıfın maxStudents değerine eşit veya fazlaysa
      // kullanıcıya kontenjan dolu mesajı göster ve eklemeyi durdur
      if (currentCount >= selectedClass.maxStudents) {
        ElMessage.error("Bu sınıfın kontenjanı dolmuştur.");
        return;
      }

      try {
        const newStudent = {
          id: crypto.randomUUID(),
          firstName: form.value.firstName,
          lastName: form.value.lastName,
          email: form.value.email,
          phoneNumber: form.value.phoneNumber,
          classId: selectedClass ? selectedClass.id : "",
          gpa: 1,
          enrollmentDate: new Date(form.value.enrollmentDate),
          isActive: true,
          dateCreated: new Date(),
          dateModified: new Date(),
        };
        StudentService.addStudent(newStudent);
        ElMessage.success("Öğrenci başarıyla eklendi.");
        router.push("/");
      } catch (error) {
        ElMessage.error("Öğrenci eklenirken bir hata oluştu !!!");
      }
    }

    function updateStudent() {
      if (!studentId) return;

      const selectedClass = classes.value.find(
        (c) => c.id === form.value.classId
      );
      if (!selectedClass) {
        ElMessage.error("Lütfen geçerli bir sınıf seçin.");
        return;
      }

      const currentCount = StudentService.countStudentsInClass(
        selectedClass.id
      );

      const originalStudent = StudentService.getStudentById(studentId);
      if (!originalStudent) {
        ElMessage.error("Öğrenci bulunamadı.");
        return;
      }

      // Eğer sınıf değişmişse ve yeni sınıf kontenjan doluysa engelle
      // Eğer sınıf değişmemişse yani aynı sınıftaysa kontenjanı -1 olarak düşün kendi kaydı zaten sayıda
      const adjustedCount =
        form.value.classId === originalStudent.classId
          ? currentCount - 1
          : currentCount;

      if (adjustedCount >= selectedClass.maxStudents) {
        ElMessage.error("Bu sınıfın kontenjanı dolmuştur.");
        return;
      }

      try {
        const updatedStudent = {
          id: studentId,
          firstName: form.value.firstName,
          lastName: form.value.lastName,
          email: form.value.email,
          phoneNumber: form.value.phoneNumber,
          classId: form.value.classId,
          enrollmentDate: new Date(form.value.enrollmentDate),
          isActive: true,
          dateCreated: originalStudent.dateCreated, // eski kayıt tarihini koru
          dateModified: new Date(),
          gpa: 1,
        };

        StudentService.updateStudent(updatedStudent);
        ElMessage.success("Öğrenci bilgileri başarıyla güncellendi.");
        router.push("/");
      } catch (error) {
        ElMessage.error("Öğrenci güncellenirken bir hata oluştu.");
      }
    }

    return {
      classes,
      form,
      onSubmit,
      addNewStudent,
      updateStudent,
      rules,
      ElMessage,
      formRef,
    };
  },
};
</script>
