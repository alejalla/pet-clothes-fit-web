<script setup lang="ts">
import { ref } from 'vue'
import type { PetClothingPlan } from '../types'
import { deletePlan, getPlans } from '../utils/storage'

const plans = ref<PetClothingPlan[]>(sortPlans(getPlans()))

function sortPlans(items: PetClothingPlan[]) {
  return [...items].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

function removePlan(plan: PetClothingPlan) {
  if (!window.confirm(`确定删除“${plan.title}”吗？`)) return
  if (deletePlan(plan.id)) plans.value = plans.value.filter((item) => item.id !== plan.id)
}
</script>

<template>
  <section class="plans-page">
    <div class="plans-heading">
      <div>
        <span class="eyebrow">SAVED PLANS</span>
        <h1>我的方案</h1>
        <p>保存在当前浏览器中的宠物穿搭记录。</p>
      </div>
      <RouterLink class="button button-primary" to="/profile">＋ 创建新方案</RouterLink>
    </div>

    <div v-if="plans.length" class="plans-list">
      <article v-for="plan in plans" :key="plan.id" class="plan-item">
        <RouterLink class="plan-main" :to="{ path: '/result', query: { id: plan.id } }">
          <div class="plan-size">{{ plan.recommendedSize }}</div>
          <div class="plan-copy">
            <span class="plan-scene">{{ plan.preference.scene }}</span>
            <h2>{{ plan.title }}</h2>
            <p>{{ plan.petProfile.name }} · {{ plan.petProfile.breed }} · {{ formatDate(plan.createdAt) }}</p>
          </div>
          <span class="plan-arrow" aria-hidden="true">→</span>
        </RouterLink>
        <button class="delete-button" type="button" :aria-label="`删除 ${plan.title}`" @click="removePlan(plan)">
          删除
        </button>
      </article>
    </div>

    <div v-else class="empty-state">
      <span class="empty-mark">P</span>
      <h2>还没有保存的方案</h2>
      <p>完成一次尺码测试并保存后，就可以在这里随时查看。</p>
      <RouterLink class="button button-primary" to="/profile">去创建方案</RouterLink>
    </div>
  </section>
</template>
