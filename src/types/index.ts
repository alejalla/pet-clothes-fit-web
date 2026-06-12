export type PetType = '狗' | '猫'
export type FurLength = '短毛' | '中毛' | '长毛'
export type BodyShape = '偏瘦' | '标准' | '偏胖'
export type SizeName = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL'

export interface PetProfile {
  id: string
  name: string
  type: PetType
  breed: string
  age: number
  weight: number
  gender: string
  furLength: FurLength
  bodyShape: BodyShape
}

export interface PetMeasurement {
  neck: number
  chest: number
  backLength: number
  belly?: number
  legLength?: number
}

export interface DesignPreference {
  scene: string
  style: string
  color: string
  clothingType: string
  features: string[]
  extraNote: string
}

export interface PetClothingPlan {
  id: string
  title: string
  petProfile: PetProfile
  measurement: PetMeasurement
  preference: DesignPreference
  recommendedSize: SizeName
  fitReason: string
  clothingSuggestion: string
  materialSuggestion: string
  safetyTips: string[]
  orderText: string
  createdAt: string
}

export interface SizeRule {
  size: SizeName
  chestMin: number
  chestMax: number
  backMin: number
  backMax: number
  neckMin: number
  neckMax: number
}

export interface PetClothingPlanInput {
  petProfile: PetProfile
  measurement: PetMeasurement
  preference: DesignPreference
}

export interface FormDraft {
  petProfile?: PetProfile
  measurement?: PetMeasurement
  preference?: DesignPreference
}
