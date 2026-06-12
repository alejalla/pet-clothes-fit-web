import type { SizeRule } from '../types'

export const petTypes = ['狗', '猫'] as const
export const breeds = ['泰迪', '比熊', '博美', '柯基', '法斗', '吉娃娃', '雪纳瑞', '约克夏', '其他']
export const genders = ['妹妹', '弟弟', '未知']
export const furLengths = ['短毛', '中毛', '长毛'] as const
export const bodyShapes = ['偏瘦', '标准', '偏胖'] as const

export const scenes = ['日常遛狗', '冬季保暖', '雨天出门', '节日拍照', '居家睡觉', '术后防舔']
export const styles = ['可爱风', '运动风', '户外机能风', '学院风', '简约高级风', '新年喜庆风']
export const colors = ['奶油白', '焦糖棕', '粉色', '蓝色', '红色', '黑色', '灰色', '绿色']
export const clothingTypes = ['背心款', '卫衣款', '四脚衣', '雨衣', '棉服', '家居睡衣', '术后恢复服']
export const featureOptions = ['牵引绳开孔', '防水面料', '加绒保暖', '反光条', '魔术贴', '拉链', '不包腿', '易清洗']

export const sizeRules: SizeRule[] = [
  { size: 'XS', chestMin: 24, chestMax: 30, backMin: 18, backMax: 23, neckMin: 16, neckMax: 22 },
  { size: 'S', chestMin: 30, chestMax: 36, backMin: 23, backMax: 28, neckMin: 20, neckMax: 26 },
  { size: 'M', chestMin: 36, chestMax: 44, backMin: 28, backMax: 34, neckMin: 24, neckMax: 30 },
  { size: 'L', chestMin: 44, chestMax: 52, backMin: 34, backMax: 40, neckMin: 28, neckMax: 36 },
  { size: 'XL', chestMin: 52, chestMax: 60, backMin: 40, backMax: 46, neckMin: 34, neckMax: 42 },
  { size: 'XXL', chestMin: 60, chestMax: 70, backMin: 46, backMax: 55, neckMin: 40, neckMax: 50 },
]
