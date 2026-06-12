<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="app-shell">
    <header class="site-header">
      <RouterLink class="brand" to="/" aria-label="返回首页">
        <span class="brand-mark">P</span>
        <span>宠物衣服尺码助手</span>
      </RouterLink>
      <RouterLink v-if="route.path !== '/plans'" class="header-link" to="/plans">
        我的方案
      </RouterLink>
    </header>

    <main class="page-shell">
      <RouterView />
    </main>

    <footer class="site-footer">
      尺码建议仅供选购参考，实际穿着请以宠物舒适和活动自如为准。
    </footer>
  </div>
</template>
