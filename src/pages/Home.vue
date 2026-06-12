<script setup lang="ts">
const benefits = [
  { icon: '01', title: '建立宠物档案', text: '记录品种、体重、毛量与体型特点' },
  { icon: '02', title: '推荐合适尺码', text: '结合胸围、背长和颈围综合判断' },
  { icon: '03', title: '生成穿搭方案', text: '整理款式、面料、安全与定制需求' },
]
</script>

<template>
  <section class="home-page">
    <div class="hero-card">
      <div class="hero-copy">
        <span class="eyebrow">PET CLOTHING FIT</span>
        <h1>宠物衣服<br /><em>尺码助手</em></h1>
        <p class="hero-slogan">量一量，帮毛孩子选对衣服</p>
        <p class="hero-description">
          只需几分钟填写宠物信息和身体尺寸，即可获得一份清晰、实用的服装选购建议。
        </p>
        <RouterLink class="button button-primary hero-button" to="/profile">
          开始测试
          <span aria-hidden="true">→</span>
        </RouterLink>
      </div>

      <div class="hero-visual" aria-hidden="true">
        <div class="visual-sun"></div>
        <div class="pet-card">
          <span class="pet-ear pet-ear-left"></span>
          <span class="pet-ear pet-ear-right"></span>
          <div class="pet-face">
            <span class="pet-eye"></span>
            <span class="pet-eye"></span>
            <span class="pet-nose"></span>
          </div>
          <div class="pet-shirt">
            <span>FIT</span>
          </div>
        </div>
        <div class="measure-tag">胸围 42 cm</div>
        <div class="size-sticker">M</div>
      </div>
    </div>

    <div class="benefit-grid">
      <article v-for="item in benefits" :key="item.icon" class="benefit-card">
        <span class="benefit-number">{{ item.icon }}</span>
        <div>
          <h2>{{ item.title }}</h2>
          <p>{{ item.text }}</p>
        </div>
      </article>
    </div>

    <div class="home-note">
      <span class="note-dot"></span>
      无需注册，数据只保存在你的浏览器中
    </div>
  </section>
</template>
