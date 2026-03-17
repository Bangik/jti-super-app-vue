<script setup lang="ts">
import WeeklyScheduleGrid from '@/organism/schedule/WeeklyScheduleGrid.vue'
</script>

<template>
  <div class="pa-4 pa-sm-6 w-100 max-w-100 h-100 bg-background overflow-auto">
    <div class="mb-4">
      <h2 class="text-h4 font-weight-bold">Jadwal Mingguan</h2>
      <p class="text-subtitle-1 text-medium-emphasis">Silakan pilih filter untuk melihat jadwal perkuliahan dan praktikum.</p>
    </div>
    <WeeklyScheduleGrid />
  </div>
</template>
