<template>
  <div
    class="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
  >
    <!-- Card Header -->
    <header class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-5">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <span class="text-3xl font-bold opacity-90">#{{ symbol.cmc_rank }}</span>
          <div>
            <h2 class="text-xl font-bold">{{ symbol.name }}</h2>
            <p class="text-sm opacity-90 uppercase tracking-wider">{{ symbol.symbol }}</p>
          </div>
        </div>
      </div>
    </header>

    <!-- Card Body -->
    <div class="p-6 space-y-6">
      <!-- Current Price -->
      <div class="text-center">
        <p class="text-sm text-gray-500 uppercase tracking-wide">Price (USD)</p>
        <p class="text-4xl font-extrabold text-gray-900 mt-1">
          ${{ formatPrice(symbol.quote.USD.price) }}
        </p>
      </div>

      <!-- Price Changes -->
      <div class="grid grid-cols-2 gap-3 text-sm">
        <div
          class="text-center py-3 px-4 rounded-lg font-medium"
          :class="
            symbol.quote.USD.percent_change_1h >= 0
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
          "
        >
          <div>1h</div>
          <div class="text-lg font-bold">
            {{ formatChange(symbol.quote.USD.percent_change_1h) }}
          </div>
        </div>
        <div
          class="text-center py-3 px-4 rounded-lg font-medium"
          :class="
            symbol.quote.USD.percent_change_24h >= 0
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
          "
        >
          <div>24h</div>
          <div class="text-lg font-bold">
            {{ formatChange(symbol.quote.USD.percent_change_24h) }}
          </div>
        </div>
        <div
          class="text-center py-3 px-4 rounded-lg font-medium col-span-2"
          :class="
            symbol.quote.USD.percent_change_7d >= 0
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
          "
        >
          <div>7d</div>
          <div class="text-lg font-bold">
            {{ formatChange(symbol.quote.USD.percent_change_7d) }}
          </div>
        </div>
      </div>

      <!-- Market Stats -->
      <div class="space-y-3 text-sm border-t pt-4">
        <div class="flex justify-between">
          <span class="text-gray-600">Market Cap</span>
          <span class="font-semibold">
            {{ formatPrice(symbol.quote.USD.market_cap) }}
          </span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">24h Volume</span>
          <span class="font-semibold">
            {{ formatPrice(symbol.quote.USD.volume_24h) }}
          </span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Circulating Supply</span>
          <span class="font-mono font-semibold">
            {{ formatSupply(symbol.circulating_supply) }}
          </span>
        </div>
      </div>

      <div>
        <BarChart :chart-data="chartData" :chart-options="chartOptions" />
      </div>

      <!-- Last Updated -->
      <footer class="text-xs text-gray-400 text-center pt-3 border-t">
        Updated {{ formatTimeAgo(symbol.last_updated) }}
      </footer>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import BarChart from './BarChart.vue'

const props = defineProps({
  symbol: {
    type: Object,
    defaul: () => {},
  },
})

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: '#444' } },
  },
  scales: {
    x: {
      ticks: { color: '#666' },
      grid: { display: false },
    },
    y: {
      ticks: { color: '#666' },
      grid: { color: 'rgba(0,0,0,0.05)' },
    },
  },
  backgroundColor: 'transparent'
})

const chartData = computed(() => {
  const usd = props.symbol?.quote?.USD;
  return {
    labels: ['1h', '7h', '24h', '30d', '60d', '90d'],
    datasets: [
      {
        label: 'Prices',
        data: [
          usd?.percent_change_1h,
          usd?.percent_change_7d,
          usd?.percent_change_24h,
          usd?.percent_change_30d,
          usd?.percent_change_60d,
          usd?.percent_change_90d,
        ],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  }
})

// Formatters
const formatPrice = (num: number): string => {
  if (!num) return '0'
  const abs = Math.abs(num)
  if (abs >= 1e12) return `$${(num / 1e12).toFixed(2)}T`
  if (abs >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
  if (abs >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
  if (abs >= 1e3) return `$${(num / 1e3).toFixed(2)}K`
  return `$${num.toFixed(2)}`
}

const formatSupply = (num: number): string => {
  return num.toLocaleString('en-US', { maximumFractionDigits: 0 })
}

const formatChange = (val: number): string => {
  const sign = val >= 0 ? '+' : ''
  return `${sign}${val.toFixed(2)}%`
}

const formatTimeAgo = (dateString: string): string => {
  const now = new Date()
  const updated = new Date(dateString)
  const diffInSeconds = Math.floor((now.getTime() - updated.getTime()) / 1000)

  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  return `${Math.floor(diffInSeconds / 86400)}d ago`
}
</script>
