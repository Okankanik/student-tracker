<template>
  <el-drawer
    v-model="drawerVisible"
    title="Yeni Öğrenci Ekle"
    direction="rtl"
    size="47%"
    :with-header="true"
    :before-close="closeDrawer"
  >
    <StudentForm
      :formData="formData"
      :isEditMode="isEditMode"
      @form-closed="closeDrawer"
    />
  </el-drawer>
  <div class="card-container">
    <el-card class="form-card">
      <template #header>
        <div class="card-header">
          <span class="header-title">ÖĞRENCİ LİSTESİ</span>

          <el-select
            v-model="selectedClassId"
            placeholder="Sınıfa göre filtrele"
            clearable
            class="filter-select"
          >
            <el-option value="">Hepsi</el-option>
            <el-option
              v-for="cls in classes"
              :key="cls.id"
              :label="cls.name"
              :value="cls.id"
            />
          </el-select>
          <el-button type="primary" :icon="Plus" @click="openDrawer"
            >Öğrenci ekle</el-button
          >
        </div>
      </template>

      <h3>Kayıtlı Öğrenciler</h3>
      <div style="overflow-x: auto">
        <el-table :data="paginatedStudents">
          <el-table-column prop="firstName" label="Ad" />
          <el-table-column prop="lastName" label="Soyad" />
          <el-table-column label="Sınıf">
            <!-- özel işlem için slot template açıyoruz -->
            <template #default="scope">
              {{ getClassName(scope.row.classId) }}
            </template>
          </el-table-column>
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
        <div class="footer">
          <el-pagination
            v-model:current-page="currentPage"
            :page-size="pageSize"
            :total="filteredStudents.length"
            layout="prev, pager, next"
            background
            class="pagination"
            style="margin-top: 20px; text-align: right"
          />
        </div>
      </template>
    </el-card>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { Edit, Delete, Plus } from "@element-plus/icons-vue";
import StudentService from "../core/services/StudentService";
import type { Student } from "../core/models/Student";
import { MOCK_CLASSES } from "../../src/assets/mock-data/students";
import { ElMessageBox, ElMessage, ElNotification} from "element-plus";
import StudentForm from "../components/student/StudentForm.vue";

export default {
    components: {
    StudentForm,
  },
  
 setup() {
    const router = useRouter();
    const students = ref<Student[]>([]);
    const isEditMode = ref(false);
    const formData = ref<Student | null>(null);
    const classes = ref(MOCK_CLASSES);
    const selectedClassId = ref("");
    const currentPage = ref(1);
    const pageSize = 10;
    const drawerVisible = ref(false);

    function openDrawer() {
      console.log("Drawer açılıyor");
      drawerVisible.value = true;
    }

    function closeDrawer() {
      console.log("drawer kapandı")
      formData.value = null
      drawerVisible.value = false;
    }

    const paginatedStudents = computed(() => {
      const start = (currentPage.value - 1) * pageSize;
      const end = start + pageSize;
      return filteredStudents.value.slice(start, end);
    });

    watch(selectedClassId, () => {
      currentPage.value = 1;
    });

    const filteredStudents = computed(() => {
      if (!selectedClassId.value) {
        return students.value;
      }
      return students.value.filter(
        (student) => student.classId === selectedClassId.value
      );
    });

    function getClassName(classId: string) {
      const cls = classes.value.find((c) => c.id === classId);
      return cls ? cls.name : "bilinmiyor";
    }

    onMounted(() => {
      students.value = StudentService.getStudents();
    });

    async function handleDelete(id: string) {
      try {
        await ElMessageBox.confirm(
          "Bu Öğrenciyi silmek istediğinize emin misiniz ?",
          "uyarı",
          {
            confirmButtonText: "evet",
            cancelButtonText: "iptal",
            type: "warning",
          }
        );

        StudentService.deleteStudents(id);
        students.value = StudentService.getStudents();

        ElNotification ({
          type: "success",
          message: "Öğrenci başarıyla silindi.",
        });
      } catch {
        ElNotification ({
          type: "info",
          message: "Silme işlemi iptal edildi.",
        });
      }
    }

    function handleEdit(student: Student) {
      formData.value = { ...student };
      isEditMode.value = true;
      drawerVisible.value = true;
    }

    return {
      students,
      isEditMode,
      formData,
      handleDelete,
      handleEdit,
      Edit,
      Delete,
      Plus,
      classes,
      getClassName,
      selectedClassId,
      filteredStudents,
      paginatedStudents,
      currentPage,
      pageSize,
      StudentForm,
      openDrawer,
      closeDrawer,
      drawerVisible,
    };
  },
};
</script>