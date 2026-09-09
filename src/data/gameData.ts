import type { DayConfig } from '../types';

export const days: DayConfig[] = [
  { id: 1, title: '첫 주문', concept: '진분수의 덧셈', mechanic: 'proper-addition', accent: '#ffd25a', short: '두 재료를 딱 맞게 합쳐요' },
  { id: 2, title: '단체 주문', concept: '대분수의 덧셈', mechanic: 'mixed-addition', accent: '#75d99b', short: '한 잔을 넘는 큰 주문이에요' },
  { id: 3, title: '재고 체크', concept: '진분수의 뺄셈', mechanic: 'proper-subtraction', accent: '#65b8ee', short: '쓰고 남은 재고를 확인해요' },
  { id: 4, title: '주문 폭주!', concept: '대분수의 뺄셈 ①', mechanic: 'mixed-subtraction', accent: '#ff9a64', short: '받아내림 없이 빠르게 계산해요' },
  { id: 5, title: '마감 정산', concept: '자연수 - 분수', mechanic: 'whole-subtraction', accent: '#64cbd0', short: '새 병 하나를 나누어 사용해요' },
  { id: 6, title: '재료 부족 대소동!', concept: '대분수의 뺄셈 ②', mechanic: 'regroup-subtraction', accent: '#b993e8', short: '온전한 하나를 바꾸어 계산해요' }
];

export const staff = [
  { name: '햇살', file: 'B01_STAFF_A_YELLOW.png', color: '#f7b733' },
  { name: '봄이', file: 'B02_STAFF_B_MINT.png', color: '#48c99a' },
  { name: '하늘', file: 'B03_STAFF_C_BLUE.png', color: '#56a8df' },
  { name: '보라', file: 'B04_STAFF_D_LAVENDER.png', color: '#a97ed4' }
];

export const customers = [1,2,3,4,5].map((id) => ({
  id,
  normal: `C0${id}_CUSTOMER_NORMAL.png`, impatient: `C0${id}_CUSTOMER_IMPATIENT.png`, happy: `C0${id}_CUSTOMER_HAPPY.png`
}));

export const drinks = [
  { name: '레몬에이드', file: 'D01_LEMON_ADE.png', ingredients: [0,1], liquid: '#ffe562' },
  { name: '매실에이드', file: 'D02_MAESIL_ADE.png', ingredients: [0,2], liquid: '#b7d94b' },
  { name: '딸기라떼', file: 'D03_STRAWBERRY_LATTE.png', ingredients: [3,4], liquid: '#f39da8' },
  { name: '초코라떼', file: 'D04_CHOCOLATE_LATTE.png', ingredients: [3,5], liquid: '#9b6246' }
];

// scale corrects for source PNGs whose bottle silhouette doesn't fill its canvas the same way as the others
// (e.g. the milk carton is a wider/shorter shape than the tall syrup bottles), so every ingredient reads as the same visual weight.
export const ingredients = [
  { name: '탄산수', file: 'E01_SODA_WATER.png', color: '#62bce8', scale: 1 }, { name: '레몬 베이스', file: 'E02_LEMON_BASE.png', color: '#f8ca3d', scale: 1 },
  { name: '매실 베이스', file: 'E03_MAESIL_BASE.png', color: '#9ec04b', scale: 1 }, { name: '우유', file: 'E04_MILK.png', color: '#f6efe3', scale: 0.94 },
  { name: '딸기 베이스', file: 'E05_STRAWBERRY_BASE.png', color: '#eb7183', scale: 1 }, { name: '초코 베이스', file: 'E06_CHOCOLATE_BASE.png', color: '#8a563f', scale: 1 }
];
