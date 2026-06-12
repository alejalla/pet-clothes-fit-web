<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { PetClothingPlan } from '../types'
import {
  getCurrentPlan,
  getPlanById,
  resetTestDraft,
  savePlan,
} from '../utils/storage'

const route = useRoute()
const router = useRouter()
const message = ref('')
const id = typeof route.query.id === 'string' ? route.query.id : ''
const plan = ref<PetClothingPlan | null>(id ? getPlanById(id) : getCurrentPlan())
const isSavedDetail = computed(() => Boolean(id))

function flash(text: string) {
  message.value = text
  window.setTimeout(() => {
    if (message.value === text) message.value = ''
  }, 2600)
}

function handleSave() {
  if (!plan.value) return
  flash(savePlan(plan.value) ? '方案已保存到“我的方案”' : '保存失败，请检查浏览器存储权限')
}

async function copyOrder() {
  if (!plan.value) return

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(plan.value.orderText)
    } else {
      const textarea = document.createElement('textarea')
      textarea.value = plan.value.orderText
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      const copied = document.execCommand('copy')
      textarea.remove()
      if (!copied) throw new Error('copy failed')
    }
    flash('需求单已复制')
  } catch {
    flash('复制失败，请长按需求单手动复制')
  }
}

function restart() {
  resetTestDraft()
  router.push('/profile')
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}
</script>

<template>
  <section v-if="plan" class="result-page">
    <div class="result-hero">
      <span class="eyebrow">YOUR PET STYLE PLAN</span>
      <p class="result-kicker">推荐方案已生成</p>
      <h1>{{ plan.title }}</h1>
      <p>创建于 {{ formatDate(plan.createdAt) }}</p>
      <div class="size-badge">
        <small>推荐尺码</small>
        <strong>{{ plan.recommendedSize }}</strong>
        <span>参考码</span>
      </div>
    </div>

    <div class="result-grid">
      <article class="result-card pet-summary">
        <span class="card-index">01</span>
        <h2>宠物信息</h2>
        <dl>
          <div><dt>名字</dt><dd>{{ plan.petProfile.name }}</dd></div>
          <div><dt>类型 / 品种</dt><dd>{{ plan.petProfile.type }} · {{ plan.petProfile.breed }}</dd></div>
          <div><dt>年龄 / 体重</dt><dd>{{ plan.petProfile.age }} 岁 · {{ plan.petProfile.weight }} kg</dd></div>
          <div><dt>毛量 / 体型</dt><dd>{{ plan.petProfile.furLength }} · {{ plan.petProfile.bodyShape }}</dd></div>
        </dl>
      </article>

      <article class="result-card measurement-summary">
        <span class="card-index">02</span>
        <h2>身体尺寸</h2>
        <div class="measurement-pills">
          <span><b>{{ plan.measurement.neck }}</b>颈围 cm</span>
          <span><b>{{ plan.measurement.chest }}</b>胸围 cm</span>
          <span><b>{{ plan.measurement.backLength }}</b>背长 cm</span>
          <span v-if="plan.measurement.belly"><b>{{ plan.measurement.belly }}</b>腹围 cm</span>
          <span v-if="plan.measurement.legLength"><b>{{ plan.measurement.legLength }}</b>腿长 cm</span>
        </div>
      </article>

      <article class="result-card result-card-wide">
        <span class="card-index">03</span>
        <h2>为什么推荐 {{ plan.recommendedSize }} 码？</h2>
        <p>{{ plan.fitReason }}</p>
      </article>

      <article class="result-card">
        <span class="card-index">04</span>
        <h2>款式建议</h2>
        <div class="preference-tags">
          <span>{{ plan.preference.scene }}</span>
          <span>{{ plan.preference.style }}</span>
          <span>{{ plan.preference.color }}</span>
          <span>{{ plan.preference.clothingType }}</span>
        </div>
        <p>{{ plan.clothingSuggestion }}</p>
      </article>

      <article class="result-card">
        <span class="card-index">05</span>
        <h2>面料建议</h2>
        <p>{{ plan.materialSuggestion }}</p>
      </article>

      <article class="result-card safety-card result-card-wide">
        <span class="card-index">06</span>
        <h2>安全提醒</h2>
        <ul>
          <li v-for="tip in plan.safetyTips" :key="tip">{{ tip }}</li>
        </ul>
      </article>

      <article class="result-card order-card result-card-wide">
        <div class="order-heading">
          <div>
            <span class="card-index">07</span>
            <h2>定制需求单</h2>
          </div>
          <button class="text-button" type="button" @click="copyOrder">复制需求单</button>
        </div>
        <pre>{{ plan.orderText }}</pre>
      </article>
    </div>

    <div class="result-actions">
      <button v-if="!isSavedDetail" class="button button-primary" type="button" @click="handleSave">保存方案</button>
      <button class="button button-secondary" type="button" @click="copyOrder">复制需求单</button>
      <button class="button button-secondary" type="button" @click="restart">重新测试</button>
      <RouterLink class="button button-dark" to="/plans">查看我的方案</RouterLink>
    </div>

    <Transition name="toast">
      <div v-if="message" class="toast" role="status">{{ message }}</div>
    </Transition>
  </section>

  <section v-else class="empty-state">
    <span class="empty-mark">?</span>
    <h1>{{ id ? '没有找到这份方案' : '还没有生成方案' }}</h1>
    <p>{{ id ? '它可能已经被删除，或链接中的方案 ID 不正确。' : '请先填写宠物档案和尺寸，生成一份推荐方案。' }}</p>
    <RouterLink class="button button-primary" to="/profile">开始测试</RouterLink>
  </section>
</template>
