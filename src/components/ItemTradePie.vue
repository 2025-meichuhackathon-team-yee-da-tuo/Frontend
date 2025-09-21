<template>
  <div class="item-trade-pie">

    <div v-if="loading" class="state">讀取中…</div>
    <div v-else-if="error" class="state error">讀取失敗：{{ error }}</div>

    <div v-else class="chart-wrap">
        <svg
            :width="computedSize"
            :height="computedSize"
            viewBox="0 0 200 200"
            role="img"
            aria-label="交易圓餅圖"
            class="pie"
        >
            <g transform="translate(100,100)">
            <!-- 沒資料就不畫任何切片 -->
            <template v-for="(seg, i) in segments" :key="i">
                <!-- 只有一種：用 circle 畫滿 -->
                <circle
                v-if="seg.fullCircle"
                :r="95"
                cx="0"
                cy="0"
                :fill="seg.color"
                />
                <!-- 兩種以上：照舊用 path -->
                <path
                v-else
                class="slice"
                :d="seg.path"
                :data-label="seg.label"
                :data-value="seg.value"
                :style="{ fill: seg.color }"
                :tabindex="0"
                />
            </template>
            </g>
        </svg>

        <ul class="legend" aria-label="圖例">
            <li v-for="(seg, i) in segments" :key="'lg-'+i">
            <span class="dot" :style="{ background: seg.color }"></span>
            <span class="name">{{ seg.label }}</span>
            <span class="pct">{{ (seg.percent * 100).toFixed(1) }}%</span>
            <span class="count">（{{ seg.value }} trans）</span>
            </li>
        </ul>
        </div>

        <!-- 空狀態 -->
        <div v-if="!loading && !error && segments.length === 0" class="empty">
        尚無交易資料
        </div>
  </div>
</template>

<script setup>
import { onMounted, watch, ref, computed } from 'vue'

/**
 * Props
 * - item: 目標物品名稱（必填）
 * - apiBase: 後端 trade API base（依你的部署調整，預設 /api/trade）
 * - size: 圓餅圖大小（px）
 */
const props = defineProps({
  item: { type: String, required: true },
  apiBase: { type: String, default: '/api/trade' },
  size: { type: Number, default: 240 },
})

const emit = defineEmits(['loaded'])

const loading = ref(false)
const error = ref('')
const trades = ref([])

// 計算實際大小，支持 CSS 變量覆蓋
const computedSize = computed(() => {
  // 檢查是否有 CSS 變量定義的大小
  if (typeof document !== 'undefined') {
    const root = document.documentElement
    const cssVar = getComputedStyle(root).getPropertyValue('--pie-size')
    if (cssVar) {
      const parsedSize = parseInt(cssVar.replace('px', ''))
      if (!isNaN(parsedSize)) {
        return parsedSize
      }
    }
  }
  return props.size
})

/**
 * 取得含該物品的所有交易
 * 依據 trade.py 的 /trade-history（有 target 參數時會用以 item 為集合，資料中對手物品在 item_b）
 */
async function fetchTrades() {
  loading.value = true
  error.value = ''
  try {
    const url = `${props.apiBase}/trade-history?target=${encodeURIComponent(props.item)}`
    const resp = await fetch(url)
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
    const data = await resp.json()
    if (data.error) throw new Error(data.error)
    trades.value = data.trade_history || []
    emit('loaded', trades.value)
  } catch (e) {
    error.value = e?.message || 'Unknown error'
  } finally {
    loading.value = false
  }
}

/**
 * 聚合「與該物品交易的其它物品」之次數
 * 由於 target 集合中每筆都以該 item 為 item_a（原始或 swapped），
 * 「對手物品」即為 item_b。
 */
const counts = computed(() => {
  const m = new Map()
  for (const t of trades.value) {
    const other = t.item_b
    if (!other || other === props.item) continue
    m.set(other, (m.get(other) || 0) + 1)
  }
  return m
})

const topN = computed(() => {
  const arr = Array.from(counts.value.entries())
    .sort((a, b) => b[1] - a[1])
  const top4 = arr.slice(0, 4)
  const othersCount = arr.slice(4).reduce((s, [, c]) => s + c, 0)
  if (othersCount > 0) top4.push(['其他', othersCount])
  return top4
})


/**
 * 繪製圓餅圖（純 SVG，不依賴外部圖表套件）
 */
const colors = [
  '#5B8FF9', '#61DDAA', '#65789B', '#F6BD16', '#7262FD',
  '#78D3F8', '#F6903D', '#9661BC'
]

function polarToCartesian(r, angle) {
  const rad = (angle * Math.PI) / 180
  return [r * Math.cos(rad), r * Math.sin(rad)]
}

function arcPath(cx, cy, r, startAngle, endAngle) {
  const [sx, sy] = polarToCartesian(r, startAngle)
  const [ex, ey] = polarToCartesian(r, endAngle)
  const largeArc = endAngle - startAngle > 180 ? 1 : 0
  return [
    `M ${cx} ${cy}`,
    `L ${cx + sx} ${cy + sy}`,
    `A ${r} ${r} 0 ${largeArc} 1 ${cx + ex} ${cy + ey}`,
    'Z'
  ].join(' ')
}

const segments = computed(() => {
  const total = topN.value.reduce((s, [, c]) => s + c, 0)
  if (total === 0) return [] // 無資料，讓 template 顯示空狀態

  // 若只有一個切片：用 fullCircle 特判，template 會畫 <circle>
  if (topN.value.length === 1) {
    const [name, count] = topN.value[0]
    return [{
      label: name,
      value: count,
      percent: 1,
      color: colors[0],
      fullCircle: true,
      path: '', // 不用
    }]
  }

  // 一般情況（2～N 個切片）
  let acc = 0
  const r = 95
  return topN.value.map(([name, count], i) => {
    const pct = count / total
    const start = acc * 360
    const end = (acc + pct) * 360
    acc += pct
    return {
      label: name,
      value: count,
      percent: pct,
      color: colors[i % colors.length],
      fullCircle: false,
      path: arcPath(0, 0, r, start - 90, end - 90),
    }
  })
})


onMounted(fetchTrades)
watch(() => props.item, fetchTrades)
</script>

<style scoped>
.item-trade-pie {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title {
  font-size: 1.05rem;
  font-weight: 600;
  margin: 0;
}

.state {
  font-size: 0.95rem;
  color: #666;
}
.state.error { color: #c0392b; }

.chart-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.pie {
  max-width: 100%;
  height: auto;
}

.slice {
  fill: currentColor;
}
.slice:nth-child(1) { color: #5B8FF9; }
.slice:nth-child(2) { color: #61DDAA; }
.slice:nth-child(3) { color: #65789B; }
.slice:nth-child(4) { color: #F6BD16; }
.slice:nth-child(5) { color: #7262FD; }
.slice:focus { outline: 3px solid rgba(0,0,0,.25); outline-offset: 2px; }

.legend {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: flex-start;
  width: 100%;
  max-width: 300px;
}
.legend li {
  display: grid;
  grid-template-columns: 16px 1fr auto auto;
  gap: 0.5rem;
  align-items: center;
}
.legend .dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}
.legend .name { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.legend .pct { font-variant-numeric: tabular-nums; color: #555; }
.legend .count { color: #888; }

.empty {
  padding: 16px;
  color: #666;
  border: 1px dashed #ddd;
  border-radius: 12px;
  text-align: center;
}


@media (max-width: 640px) {
  .chart-wrap {
    flex-direction: column;
    align-items: center;
  }
  
  .legend {
    max-width: 250px;
    align-items: flex-start;
  }
}
</style>
