import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

import StudentList from "../views/StudentList.vue";
import StudentForm from "../components/student/StudentForm.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "StudentList",
    component: StudentList,
  },
{
  path: "/student-form/:id?",
  name: "StudentForm",
  component: StudentForm,
  props: true,
}

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
