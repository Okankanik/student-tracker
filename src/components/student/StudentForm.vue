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
          <el-input v-model="form.firstName" placeholder="Ad" />
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

        <el-form-item>
          <el-button @click="offsubmit" type="secondary" style="width: 100%">
            Geri
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import { ref, watch, computed } from "vue";
import { useRouter } from "vue-router";
import { getRules } from "../../core/helpers/validation";
import { MOCK_CLASSES } from "../../assets/mock-data/students";
import StudentService from "../../core/services/StudentService";
import { ElMessage, ElNotification } from "element-plus";
import type { FormInstance } from "element-plus";
import type { Student } from "../../core/models/Student";
import { getCurrentInstance } from "vue";

export default {
  props: {
    formData: {
      type: Object as () => Partial<Student> | null,
      default: null,
    },
    isEditMode: Boolean,
  },
  setup(props) {
    const internalInstance = getCurrentInstance();
    const emit = internalInstance?.emit;

    const classes = ref(MOCK_CLASSES);
    const router = useRouter();
    const { rules } = getRules();
    const studentId = computed(() => props.formData?.id || null);
    const formRef = ref<FormInstance | null>(null);

    async function onSubmit() {
      if (!formRef.value) return;
      try {
        await formRef.value.validate();
        if (props.isEditMode) {
          updateStudent();
        } else {
          addNewStudent();
        }
      } catch (error) {
        ElNotification.error("Lütfen formdaki tüm alanları doğru doldurun.");
      }
    }

    function offsubmit() {
      emit?.("form-closed");
      router.push("/");
      formRef.value?.resetFields();
    }

    const form = ref({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      classId: "",
      enrollmentDate: "",
    });

    watch(
      () => props.formData,
      (newVal) => {
        if (newVal) {
          form.value = {
            firstName: newVal.firstName || "",
            lastName: newVal.lastName || "",
            email: newVal.email || "",
            phoneNumber: newVal.phoneNumber || "",
            classId: newVal.classId || "",
            enrollmentDate:
              newVal.enrollmentDate?.toString().substring(0, 10) || "",
          };
        } else {
          form.value = {
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            classId: "",
            enrollmentDate: "",
          };
        }
      },
      { immediate: true }
    );

    function addNewStudent() {
      const selectedClass = classes.value.find(
        (cls) => cls.id === form.value.classId
      );

      if (!selectedClass) {
        ElNotification.error("Lütfen geçerli bir sınıf seçin.");
        return;
      }

      const currentCount = StudentService.countStudentsInClass(
        selectedClass.id
      );
      // 4. Eğer mevcut öğrenci sayısı sınıfın maxStudents değerine eşit veya fazlaysa
      // kullanıcıya kontenjan dolu mesajı göster ve eklemeyi durdur
      if (currentCount >= selectedClass.maxStudents) {
        ElNotification.error("Bu sınıfın kontenjanı dolmuştur.");
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
          gpa: selectedClass.grade,
          enrollmentDate: new Date(form.value.enrollmentDate),
          isActive: true,
          dateCreated: new Date(),
          dateModified: new Date(),
        };

        StudentService.addStudent(newStudent);
        ElNotification.success("Öğrenci başarıyla eklendi.");
        emit?.("form-closed");
        router.push("/");
        formRef.value?.resetFields();
      } catch (error) {
        ElNotification.error("Öğrenci eklenirken bir hata oluştu !!!");
      }
    }

    function updateStudent() {
      if (!studentId.value) return;

      const selectedClass = classes.value.find(
        (c) => c.id === form.value.classId
      );
      if (!selectedClass) {
        ElNotification.error("Lütfen geçerli bir sınıf seçin.");
        return;
      }

      const currentCount = StudentService.countStudentsInClass(
        selectedClass.id
      );

      if (!studentId.value) {
        ElNotification.error("Geçerli bir öğrenci ID'si yok.");
        return;
      }

      const originalStudent = StudentService.getStudentById(studentId.value);
      if (!originalStudent) {
        ElNotification.error("Öğrenci bulunamadı.");
        return;
      }

      // Eğer sınıf değişmişse ve yeni sınıf kontenjan doluysa engelle
      // Eğer sınıf değişmemişse yani aynı sınıftaysa kontenjanı -1 olarak düşün kendi kaydı zaten sayıda
      const adjustedCount =
        form.value.classId === originalStudent.classId
          ? currentCount - 1
          : currentCount;

      if (adjustedCount >= selectedClass.maxStudents) {
        ElNotification.error("Bu sınıfın kontenjanı dolmuştur.");
        return;
      }

      try {
        const updatedStudent = {
          id: studentId.value,
          firstName: form.value.firstName,
          lastName: form.value.lastName,
          email: form.value.email,
          phoneNumber: form.value.phoneNumber,
          classId: form.value.classId,
          enrollmentDate: new Date(form.value.enrollmentDate),
          isActive: true,
          dateCreated: originalStudent.dateCreated, // eski kayıt tarihini koru
          dateModified: new Date(),
          gpa: selectedClass.grade,
        };

        StudentService.updateStudent(updatedStudent);
        ElNotification.success("Öğrenci bilgileri başarıyla güncellendi.");
        emit?.("form-closed");
        router.push("/");
      } catch (error) {
        ElNotification.error("Öğrenci güncellenirken bir hata oluştu.");
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
      router,
      offsubmit,
    };
  },
};
</script>
