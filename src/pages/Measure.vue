<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { PetMeasurement } from '../types'
import { getDraft, saveDraft } from '../utils/storage'

const router = useRouter()
const draft = getDraft()

if (!draft.petProfile) router.replace('/profile')

const saved = draft.measurement
const form = reactive<PetMeasurement>({
  neck: saved?.neck ?? 0,
  chest: saved?.chest ?? 0,
  backLength: saved?.backLength ?? 0,
  belly: saved?.belly,
  legLength: saved?.legLength,
})

const errors = reactive<Record<string, string>>({})
const guides = [
  { key: '颈围', text: '测量脖子最粗的位置，建议预留 1–2 指空间' },
  { key: '胸围', text: '测量前腿后方身体最宽的位置' },
  { key: '背长', text: '从脖子根部量到尾巴根部' },
  { key: '腹围', text: '测量腹部较宽的位置' },
]

watch(form, () => saveDraft({ measurement: { ...form } }), { deep: true })

function validRequired(value: number | undefined): boolean {
  return Number.isFinite(Number(value)) && Number(value) > 0 && Number(value) <= 200
}

function validOptional(value: number | undefined): boolean {
  return value === undefined || value === null || value === 0 || validRequired(value)
}

function validate(): boolean {
  Object.keys(errors).forEach((key) => delete errors[key])
  if (!validRequired(form.neck)) errors.neck = '请输入 0–200 cm 之间的有效颈围'
  if (!validRequired(form.chest)) errors.chest = '请输入 0–200 cm 之间的有效胸围'
  if (!validRequired(form.backLength)) errors.backLength = '请输入 0–200 cm 之间的有效背长'
  if (!validOptional(form.belly)) errors.belly = '请输入有效腹围，或留空'
  if (!validOptional(form.legLength)) errors.legLength = '请输入有效腿长，或留空'
  return Object.keys(errors).length === 0
}

function nextStep() {
  if (!validate()) return
  saveDraft({
    measurement: {
      neck: Number(form.neck),
      chest: Number(form.chest),
      backLength: Number(form.backLength),
      ...(form.belly ? { belly: Number(form.belly) } : {}),
      ...(form.legLength ? { legLength: Number(form.legLength) } : {}),
    },
  })
  router.push('/designer')
}
</script>

<template>
  <section class="flow-page">
    <div class="stepper" aria-label="填写进度">
      <span class="step done"><b>✓</b>宠物档案</span><i></i>
      <span class="step active"><b>2</b>身体尺寸</span><i></i>
      <span class="step"><b>3</b>穿搭偏好</span>
    </div>

    <div class="page-heading">
      <span class="eyebrow">STEP 02</span>
      <h1>给毛孩子量个尺寸</h1>
      <p>请让宠物自然站立，用软尺贴合身体测量，不要勒紧。</p>
    </div>

    <div class="measure-layout">
      <form class="form-card measure-form" novalidate @submit.prevent="nextStep">
        <div class="field">
          <label for="neck">颈围（cm）<em>*</em></label>
          <input id="neck" v-model.number="form.neck" type="number" min="1" max="200" step="0.1" placeholder="例如：25" />
          <span v-if="errors.neck" class="field-error">{{ errors.neck }}</span>
        </div>
        <div class="field">
          <label for="chest">胸围（cm）<em>*</em></label>
          <input id="chest" v-model.number="form.chest" type="number" min="1" max="200" step="0.1" placeholder="例如：40" />
          <span v-if="errors.chest" class="field-error">{{ errors.chest }}</span>
        </div>
        <div class="field">
          <label for="back">背长（cm）<em>*</em></label>
          <input id="back" v-model.number="form.backLength" type="number" min="1" max="200" step="0.1" placeholder="例如：32" />
          <span v-if="errors.backLength" class="field-error">{{ errors.backLength }}</span>
        </div>
        <div class="field">
          <label for="belly">腹围（cm）<small>可选</small></label>
          <input id="belly" v-model.number="form.belly" type="number" min="1" max="200" step="0.1" placeholder="例如：36" />
          <span v-if="errors.belly" class="field-error">{{ errors.belly }}</span>
        </div>
        <div class="field">
          <label for="leg">腿长（cm）<small>可选</small></label>
          <input id="leg" v-model.number="form.legLength" type="number" min="1" max="200" step="0.1" placeholder="四脚衣建议填写" />
          <span v-if="errors.legLength" class="field-error">{{ errors.legLength }}</span>
        </div>

        <div class="form-actions field-wide">
          <RouterLink class="button button-secondary" to="/profile">← 上一步</RouterLink>
          <button class="button button-primary" type="submit">下一步：穿搭偏好 →</button>
        </div>
      </form>

      <aside class="guide-card">
        <div class="guide-illustration" aria-hidden="true">
          <div class="guide-pet">PET</div>
          <span class="guide-line line-neck">颈围</span>
          <span class="guide-line line-chest">胸围</span>
          <span class="guide-line line-back">背长</span>
        </div>
        <h2>测量小贴士</h2>
        <ul class="guide-list">
          <li v-for="item in guides" :key="item.key">
            <strong>{{ item.key }}</strong>
            <span>{{ item.text }}</span>
          </li>
        </ul>
      </aside>
    </div>
  </section>
</template>
