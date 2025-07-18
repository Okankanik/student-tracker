<template>
  <div class="card-container">
    <el-card class="form-card">
      <template #header>
        <div
          class="card-header"
          style="display: flex; justify-content: space-between"
        >
          <span>ÖĞRENCİ LİSTESİ</span>
          <router-link to="/student-form" style="text-decoration: none">
            <el-button type="primary" :icon="Plus">Öğrenci ekle</el-button>
          </router-link>
        </div>
      </template>

      <h3>Kayıtlı Öğrenciler</h3>
      <div style="overflow-x: auto">
        <el-table :data="students">
          <el-table-column prop="firstName" label="Ad" />
          <el-table-column prop="lastName" label="Soyad" />
          <el-table-column prop="classId" label="Sınıf" />
          <el-table-column prop="gpa" label="Not ortalaması" />
          <el-table-column label="İşlemler" width="100">
            <template #default="scope">
              <div class="islemler">
                <el-button
                  :icon="Edit"
                  size="small"
                  @click="handleEdit(scope.row)"
                ></el-button>
                <el-button
                  :icon="Delete"
                  size="small"
                  type="danger"
                  @click="handleDelete(scope.row.id)"
                ></el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <template #footer>
        <div></div>
      </template>
    </el-card>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Edit, Delete, Plus } from "@element-plus/icons-vue";
import StudentService from "../core/services/StudentService";
import type { Student } from "../core/models/Student";

export default {
  setup() {
    const router = useRouter();
    const students = ref<Student[]>([]);
    const isEditMode = ref(false);
    const formDialogVisible = ref(false);
    const formData = ref<Student | null>(null);

    onMounted(() => {
      students.value = StudentService.getStudents();
    });

    function handleDelete(id: string) {
      StudentService.deleteStudents(id);
      students.value = StudentService.getStudents();
    }

    function handleEdit(student: Student) {
      formData.value = { ...student };
      isEditMode.value = true;
      formDialogVisible.value = true;

      router.push({ name: "StudentForm", params: { id: student.id } });
    }

    return {
      students,
      isEditMode,
      formDialogVisible,
      formData,
      handleDelete,
      handleEdit,
      Edit,
      Delete,
      Plus,
    };
  },
};
</script>

