<template>
  <el-container>
    <el-header style="background-color: #409eff">
      <el-row justify="center" align="middle" style="height: 60px">
        <el-col :span="24" style="text-align: center">
          <h1 style="color: #ecf0f1; margin: 0">Student Tracker</h1>
        </el-col>
      </el-row>
    </el-header>

    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>

<script setup lang="ts"></script>
