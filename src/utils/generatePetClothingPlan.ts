import { sizeRules } from '../mock/options'
import type {
  DesignPreference,
  PetClothingPlan,
  PetClothingPlanInput,
  PetMeasurement,
  PetProfile,
  SizeName,
} from '../types'

const DEFAULT_PROFILE: PetProfile = {
  id: '',
  name: '宠物',
  type: '狗',
  breed: '其他',
  age: 0,
  weight: 0,
  gender: '未知',
  furLength: '中毛',
  bodyShape: '标准',
}

const DEFAULT_MEASUREMENT: PetMeasurement = {
  neck: 20,
  chest: 30,
  backLength: 23,
}

const DEFAULT_PREFERENCE: DesignPreference = {
  scene: '日常遛狗',
  style: '简约高级风',
  color: '奶油白',
  clothingType: '背心款',
  features: [],
  extraNote: '',
}

const requiredSafetyTips = [
  '衣服不要过紧，胸颈位置应能自然呼吸并留有活动余量。',
  '不要影响前腿活动，行走、坐卧和转身都应保持自然。',
  '第一次穿衣建议短时间适应，并观察宠物的动作和情绪。',
  '如宠物明显抗拒，应及时脱下，不要强迫持续穿着。',
  '拉链、扣子、装饰件要避免被宠物啃咬，防止误吞或受伤。',
]

function safePositiveNumber(value: unknown, fallback: number): { value: number; fallbackUsed: boolean } {
  const number = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(number) && number > 0
    ? { value: number, fallbackUsed: false }
    : { value: fallback, fallbackUsed: true }
}

function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `plan-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function findSizeIndex(chest: number): { index: number; outsideRange: boolean } {
  if (chest < sizeRules[0].chestMin) return { index: 0, outsideRange: true }
  if (chest > sizeRules[sizeRules.length - 1].chestMax) {
    return { index: sizeRules.length - 1, outsideRange: true }
  }

  // Overlapping boundaries belong to the larger size to preserve movement room.
  let matchedIndex = 0
  sizeRules.forEach((rule, index) => {
    if (chest >= rule.chestMin && chest <= rule.chestMax) matchedIndex = index
  })
  return { index: matchedIndex, outsideRange: false }
}

function copyProfile(profile?: PetProfile): PetProfile {
  return {
    ...DEFAULT_PROFILE,
    ...profile,
    name: profile?.name?.trim() || DEFAULT_PROFILE.name,
    id: profile?.id || createId(),
  }
}

function copyPreference(preference?: DesignPreference): DesignPreference {
  return {
    ...DEFAULT_PREFERENCE,
    ...preference,
    features: Array.isArray(preference?.features) ? [...preference.features] : [],
    extraNote: preference?.extraNote?.trim() || '',
  }
}

export function generatePetClothingPlan(input: PetClothingPlanInput): PetClothingPlan {
  const profile = copyProfile(input?.petProfile)
  const preference = copyPreference(input?.preference)
  const neck = safePositiveNumber(input?.measurement?.neck, DEFAULT_MEASUREMENT.neck)
  const chest = safePositiveNumber(input?.measurement?.chest, DEFAULT_MEASUREMENT.chest)
  const backLength = safePositiveNumber(input?.measurement?.backLength, DEFAULT_MEASUREMENT.backLength)
  const belly = safePositiveNumber(input?.measurement?.belly, 0)
  const legLength = safePositiveNumber(input?.measurement?.legLength, 0)

  const measurement: PetMeasurement = {
    neck: neck.value,
    chest: chest.value,
    backLength: backLength.value,
    ...(belly.value > 0 ? { belly: belly.value } : {}),
    ...(legLength.value > 0 ? { legLength: legLength.value } : {}),
  }

  const reasons: string[] = []
  const warnings: string[] = []
  const chestMatch = findSizeIndex(chest.value)
  let sizeIndex = chestMatch.index
  const baseSize = sizeRules[sizeIndex]

  reasons.push(`以胸围 ${chest.value} cm 为首要依据，基础匹配 ${baseSize.size} 码。`)

  if (chestMatch.outsideRange) {
    warnings.push('胸围超出标准尺码表范围，当前尺码仅作兜底参考，建议向商家确认或定制。')
  }

  while (
    sizeIndex < sizeRules.length - 1 &&
    (backLength.value > sizeRules[sizeIndex].backMax || neck.value > sizeRules[sizeIndex].neckMax)
  ) {
    sizeIndex += 1
  }

  if (sizeIndex > chestMatch.index) {
    reasons.push(`结合背长 ${backLength.value} cm 和颈围 ${neck.value} cm，为避免过短或过紧，上调至 ${sizeRules[sizeIndex].size} 码。`)
  } else {
    reasons.push(`背长 ${backLength.value} cm、颈围 ${neck.value} cm 与该尺码整体协调。`)
  }

  if (profile.furLength === '长毛' || profile.bodyShape === '偏胖') {
    const wideReasons = [
      profile.furLength === '长毛' ? '长毛需要为毛量预留空间' : '',
      profile.bodyShape === '偏胖' ? '偏胖体型需要减少束缚感' : '',
    ].filter(Boolean)

    if (sizeIndex < sizeRules.length - 1) {
      sizeIndex += 1
      reasons.push(`考虑${wideReasons.join('，')}，建议偏宽松并上调一档。`)
    } else {
      reasons.push(`考虑${wideReasons.join('，')}，XXL 仍需选择宽松版型或定制。`)
    }
  }

  const recommendedSize: SizeName = sizeRules[sizeIndex].size
  const clothingNotes = [
    `推荐选择${preference.clothingType}，整体采用${preference.style}，主色为${preference.color}。`,
    preference.features.length ? `功能细节建议包含：${preference.features.join('、')}。` : '优先选择结构简单、穿脱方便的款式。',
  ]

  if (preference.clothingType === '四脚衣') {
    clothingNotes.push(
      legLength.value > 0
        ? `已记录腿长 ${legLength.value} cm，制作时需核对袖长并为关节活动预留空间。`
        : '四脚衣需补充核对腿长，并重点确认前腿和关节活动空间。',
    )
  }

  if (preference.scene === '术后防舔' || preference.clothingType === '术后恢复服') {
    clothingNotes.push('本建议仅作为服装场景参考，不替代兽医诊断、治疗或专业术后护理意见。')
  }

  let materialSuggestion = '建议选择柔软、透气、亲肤且易清洗的面料，接缝处避免粗糙摩擦。'
  if (preference.scene === '雨天出门' || preference.features.includes('防水面料')) {
    materialSuggestion = '建议使用轻量防水、易擦洗且内层透气的复合面料，避免闷热和长时间潮湿。'
  } else if (preference.scene === '冬季保暖' || preference.features.includes('加绒保暖')) {
    materialSuggestion = '建议使用轻量摇粒绒、保暖棉或柔软夹棉面料，兼顾保暖、透气与活动灵活性，避免过厚。'
  } else if (preference.scene === '居家睡觉') {
    materialSuggestion = '建议使用柔软透气的棉质或弹力针织面料，减少硬质装饰和突出接缝。'
  }

  const safetyTips = [...requiredSafetyTips]
  if (preference.clothingType === '四脚衣') {
    safetyTips.push('四脚衣需额外检查袖口松紧与腿部长度，避免绊脚或摩擦腋下。')
  }
  if (warnings.length) safetyTips.push(...warnings)
  if ([neck, chest, backLength].some((item) => item.fallbackUsed)) {
    safetyTips.push('部分尺寸输入异常，已使用兜底值生成方案；下单前必须重新测量并人工核对。')
  }

  const title = `${profile.name}的${preference.scene}穿搭方案`
  const createdAt = new Date().toISOString()
  const featureText = preference.features.length ? preference.features.join('、') : '无特殊要求'
  const extraText = preference.extraNote || '无'

  const orderText = [
    '【宠物服装定制需求单】',
    `方案名称：${title}`,
    `宠物：${profile.name}（${profile.type} / ${profile.breed} / ${profile.gender}）`,
    `年龄：${profile.age || '未填写'} 岁`,
    `体重：${profile.weight || '未填写'} kg`,
    `毛量与体型：${profile.furLength} / ${profile.bodyShape}`,
    '',
    '【身体尺寸】',
    `颈围：${neck.value} cm`,
    `胸围：${chest.value} cm`,
    `背长：${backLength.value} cm`,
    `腹围：${measurement.belly ? `${measurement.belly} cm` : '未填写'}`,
    `腿长：${measurement.legLength ? `${measurement.legLength} cm` : '未填写'}`,
    '',
    '【穿搭偏好】',
    `使用场景：${preference.scene}`,
    `风格：${preference.style}`,
    `主色：${preference.color}`,
    `衣服类型：${preference.clothingType}`,
    `功能细节：${featureText}`,
    `补充描述：${extraText}`,
    '',
    '【推荐结果】',
    `参考尺码：${recommendedSize}`,
    `适配理由：${reasons.join('')}`,
    `款式建议：${clothingNotes.join('')}`,
    `面料建议：${materialSuggestion}`,
    '',
    '请商家根据实际版型、面料弹性和宠物试穿状态再次核对尺码。',
  ].join('\n')

  return {
    id: createId(),
    title,
    petProfile: profile,
    measurement,
    preference,
    recommendedSize,
    fitReason: reasons.join(''),
    clothingSuggestion: clothingNotes.join(''),
    materialSuggestion,
    safetyTips,
    orderText,
    createdAt,
  }
}
