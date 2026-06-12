<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { clothingTypes, colors, featureOptions, scenes, styles } from '../mock/options'
import type { DesignPreference } from '../types'
import { generatePetClothingPlan } from '../utils/generatePetClothingPlan'
import { getDraft, saveCurrentPlan, saveDraft } from '../utils/storage'

const router = useRouter()
const draft = getDraft()

if (!draft.petProfile) router.replace('/profile')
else if (!draft.measurement) router.replace('/measure')

const saved = draft.preference
const form = reactive<DesignPreference>({
  scene: saved?.scene || '',
  style: saved?.style || '',
  color: saved?.color || '',
  clothingType: saved?.clothingType || '',
  features: saved?.features ? [...saved.features] : [],
  extraNote: saved?.extraNote || '',
})
const errors = reactive<Record<string, string>>({})

watch(form, () => saveDraft({ preference: { ...form, features: [...form.features] } }), { deep: true })

function validate(): boolean {
  Object.keys(errors).forEach((key) => delete errors[key])
  if (!form.scene) errors.scene = '请选择使用场景'
  if (!form.style) errors.style = '请选择喜欢的风格'
  if (!form.color) errors.color = '请选择主色'
  if (!form.clothingType) errors.clothingType = '请选择衣服类型'
  return Object.keys(errors).length === 0
}

function generate() {
  if (!validate()) return
  const latestDraft = getDraft()
  if (!latestDraft.petProfile || !latestDraft.measurement) {
    router.replace('/profile')
    return
  }

  const preference = { ...form, features: [...form.features], extraNote: form.extraNote.trim() }
  saveDraft({ preference })
  const plan = generatePetClothingPlan({
    petProfile: latestDraft.petProfile,
    measurement: latestDraft.measurement,
    preference,
  })
  saveCurrentPlan(plan)
  router.push('/result')
}
</script>

<template>
  <section class="flow-page">
    <div class="stepper" aria-label="填写进度">
      <span class="step done"><b>✓</b>宠物档案</span><i></i>
      <span class="step done"><b>✓</b>身体尺寸</span><i></i>
      <span class="step active"><b>3</b>穿搭偏好</span>
    </div>

    <div class="page-heading">
      <span class="eyebrow">STEP 03</span>
      <h1>想给它怎样的穿搭？</h1>
      <p>选择你在意的场景、风格和功能，我们来整理完整方案。</p>
    </div>

    <form class="designer-form" novalidate @submit.prevent="generate">
      <fieldset class="option-section">
        <legend>使用场景 <em>*</em></legend>
        <div class="option-grid">
          <label v-for="item in scenes" :key="item" class="option-card">
            <input v-model="form.scene" type="radio" :value="item" />
            <span>{{ item }}</span>
          </label>
        </div>
        <p v-if="form.scene === '术后防舔'" class="medical-note">
          仅作为服装使用场景，不提供医疗建议；实际术后护理请遵医嘱。
        </p>
        <span v-if="errors.scene" class="field-error">{{ errors.scene }}</span>
      </fieldset>

      <fieldset class="option-section">
        <legend>喜欢的风格 <em>*</em></legend>
        <div class="option-grid">
          <label v-for="item in styles" :key="item" class="option-card">
            <input v-model="form.style" type="radio" :value="item" />
            <span>{{ item }}</span>
          </label>
        </div>
        <span v-if="errors.style" class="field-error">{{ errors.style }}</span>
      </fieldset>

      <fieldset class="option-section">
        <legend>主色 <em>*</em></legend>
        <div class="color-grid">
          <label v-for="item in colors" :key="item" class="color-option" :class="`color-${item}`">
            <input v-model="form.color" type="radio" :value="item" />
            <span class="color-dot"></span>
            <b>{{ item }}</b>
          </label>
        </div>
        <span v-if="errors.color" class="field-error">{{ errors.color }}</span>
      </fieldset>

      <fieldset class="option-section">
        <legend>衣服类型 <em>*</em></legend>
        <div class="option-grid">
          <label v-for="item in clothingTypes" :key="item" class="option-card">
            <input v-model="form.clothingType" type="radio" :value="item" />
            <span>{{ item }}</span>
          </label>
        </div>
        <span v-if="errors.clothingType" class="field-error">{{ errors.clothingType }}</span>
      </fieldset>

      <fieldset class="option-section">
        <legend>功能细节 <small>可多选</small></legend>
        <div class="option-grid feature-grid">
          <label v-for="item in featureOptions" :key="item" class="option-card">
            <input v-model="form.features" type="checkbox" :value="item" />
            <span>{{ item }}</span>
          </label>
        </div>
      </fieldset>

      <div class="option-section">
        <label for="extra-note" class="section-label">补充描述 <small>可选</small></label>
        <textarea
          id="extra-note"
          v-model="form.extraNote"
          maxlength="300"
          rows="4"
          placeholder="例如：希望适合冬天遛狗，不要太厚，方便活动。"
        ></textarea>
        <span class="text-count">{{ form.extraNote.length }}/300</span>
      </div>

      <div class="form-actions">
        <RouterLink class="button button-secondary" to="/measure">← 上一步</RouterLink>
        <button class="button button-primary" type="submit">生成推荐方案 ✦</button>
      </div>
    </form>
  </section>
</template>
