<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
          Live Cryptocurrency Prices
        </h1>
        <p class="text-lg text-gray-600">Real-time data powered by CoinMarketCap</p>
      </div>

      <!-- Loading State -->
      <div v-if="symbol.loading" class="text-center py-24">
        <div
          class="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"
        ></div>
        <p class="mt-4 text-gray-600 text-lg">Loading latest prices...</p>
      </div>

      <!-- Crypto Cards Grid -->
      <div
        v-else-if="symbol.list.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <article v-for="item in symbol.list" :key="item.id">
          <Symbol :symbol="item" />
        </article>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-24">
        <p class="text-xl text-gray-500">No data available at the moment.</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import $axios from '@/config/axios'
import { onMounted, onUnmounted, reactive } from 'vue'
import Symbol from '@/components/symbol.vue'

const symbol = reactive({
  loading: false,
  loadingMore: false,
  list: [] as any[],
  page: 1,
  limit: 12,
})

const fetchSymbols = async (isLoadMore = false) => {
  if (isLoadMore) symbol.loadingMore = true
  else symbol.loading = true

  try {
    const { data } = await $axios.get('/cryptocurrency/listings/latest', {
      params: {
        ...((symbol.page - 1) * symbol.limit > 0 && {
          start: (symbol.page - 1) * symbol.limit,
        }),
        limit: symbol.limit,
      },
    })

    if (isLoadMore) {
      symbol.list = [...symbol.list, ...data?.data]
    } else {
      symbol.list = data?.data || []
    }
  } catch (error) {
    console.error('Failed to fetch crypto data:', error)
  } finally {
    symbol.loading = false
    symbol.loadingMore = false
  }
}

const handleScroll = () => {
  const bottomOffset = 400

  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - bottomOffset &&
    !symbol.loadingMore
  ) {
    symbol.page++
    fetchSymbols(true)
  }
}

onMounted(() => {
  fetchSymbols()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
