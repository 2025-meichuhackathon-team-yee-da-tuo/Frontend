<template>
    <ItemTradePie :item="itemName" api-base="/api/trade" />
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ItemTradePie from '@/components/ItemTradePie.vue' // 放在 components/ 下

const route = useRoute()
const itemName = computed(() => route.params.name?.toString() ?? '')
</script>
