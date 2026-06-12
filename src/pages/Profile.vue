<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { bodyShapes, breeds, furLengths, genders, petTypes } from '../mock/options'
import type { PetProfile } from '../types'
import { getDraft, saveDraft } from '../utils/storage'

const router = useRouter()
const saved = getDraft().petProfile
const createId = () => `pet-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

const form = reactive<PetProfile>({
  id: saved?.id || createId(),
  name: saved?.name || '',
  type: saved?.type || '狗',
  breed: saved?.breed || '',
  age: saved?.age ?? 0,
  weight: saved?.weight ?? 0,
  gender: saved?.gender || '',
  furLength: saved?.furLength || '中毛',
  bodyShape: saved?.bodyShape || '标准',
})

const errors = reactive<Record<string, string>>({})

watch(form, () => saveDraft({ petProfile: { ...form } }), { deep: true })

function validate(): boolean {
  Object.keys(errors).forEach((key) => delete errors[key])
  if (!form.name.trim()) errors.name = '请填写宠物名字'
  if (!form.breed) errors.breed = '请选择品种'
  if (!Number.isFinite(Number(form.age)) || Number(form.age) <= 0 || Number(form.age) > 40) {
    errors.age = '请输入 0–40 岁之间的有效年龄'
  }
  if (!Number.isFinite(Number(form.weight)) || Number(form.weight) <= 0 || Number(form.weight) > 150) {
    errors.weight = '请输入 0–150 kg 之间的有效体重'
  }
  if (!form.gender) errors.gender = '请选择性别'
  return Object.keys(errors).length === 0
}

function nextStep() {
  if (!validate()) return
  saveDraft({
    petProfile: {
      ...form,
      name: form.name.trim(),
      age: Number(form.age),
      weight: Number(form.weight),
    },
  })
  router.push('/measure')
}
</script>

<template>
  <section class="flow-page">
    <div class="stepper" aria-label="填写进度">
      <span class="step active"><b>1</b>宠物档案</span>
      <i></i>
      <span class="step"><b>2</b>身体尺寸</span>
      <i></i>
      <span class="step"><b>3</b>穿搭偏好</span>
    </div>

    <div class="page-heading">
      <span class="eyebrow">STEP 01</span>
      <h1>先认识一下你的毛孩子</h1>
      <p>这些信息会帮助我们判断合适的版型和穿着余量。</p>
    </div>

    <form class="form-card" novalidate @submit.prevent="nextStep">
      <div class="field field-wide">
        <label for="pet-name">宠物名字 <em>*</em></label>
        <input id="pet-name" v-model="form.name" type="text" maxlength="20" placeholder="例如：年糕" />
        <span v-if="errors.name" class="field-error">{{ errors.name }}</span>
      </div>

      <div class="field">
        <span class="field-label">宠物类型 <em>*</em></span>
        <div class="segmented">
          <label v-for="item in petTypes" :key="item">
            <input v-model="form.type" type="radio" :value="item" />
            <span>{{ item }}</span>
          </label>
        </div>
      </div>

      <div class="field">
        <label for="breed">品种 <em>*</em></label>
        <select id="breed" v-model="form.breed">
          <option value="" disabled>请选择品种</option>
          <option v-for="item in breeds" :key="item" :value="item">{{ item }}</option>
        </select>
        <span v-if="errors.breed" class="field-error">{{ errors.breed }}</span>
      </div>

      <div class="field">
        <label for="age">年龄（岁）<em>*</em></label>
        <input id="age" v-model.number="form.age" type="number" min="0.1" max="40" step="0.1" placeholder="例如：3" />
        <span v-if="errors.age" class="field-error">{{ errors.age }}</span>
      </div>

      <div class="field">
        <label for="weight">体重（kg）<em>*</em></label>
        <input id="weight" v-model.number="form.weight" type="number" min="0.1" max="150" step="0.1" placeholder="例如：6.5" />
        <span v-if="errors.weight" class="field-error">{{ errors.weight }}</span>
      </div>

      <div class="field field-wide">
        <span class="field-label">性别 <em>*</em></span>
        <div class="choice-row">
          <label v-for="item in genders" :key="item" class="choice-chip">
            <input v-model="form.gender" type="radio" :value="item" />
            <span>{{ item }}</span>
          </label>
        </div>
        <span v-if="errors.gender" class="field-error">{{ errors.gender }}</span>
      </div>

      <div class="field field-wide">
        <span class="field-label">毛量</span>
        <div class="choice-row choice-row-three">
          <label v-for="item in furLengths" :key="item" class="choice-chip">
            <input v-model="form.furLength" type="radio" :value="item" />
            <span>{{ item }}</span>
          </label>
        </div>
      </div>

      <div class="field field-wide">
        <span class="field-label">体型</span>
        <div class="choice-row choice-row-three">
          <label v-for="item in bodyShapes" :key="item" class="choice-chip">
            <input v-model="form.bodyShape" type="radio" :value="item" />
            <span>{{ item }}</span>
          </label>
        </div>
      </div>

      <div class="form-actions field-wide">
        <RouterLink class="button button-secondary" to="/">返回首页</RouterLink>
        <button class="button button-primary" type="submit">下一步：测量尺寸 →</button>
      </div>
    </form>
  </section>
</template>
