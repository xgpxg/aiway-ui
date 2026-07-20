<script setup lang="ts">
import {onMounted, onBeforeUnmount, ref} from "vue"
import {R} from "@/utils/R"

interface RankItem {
  name: string
  value: number
  change?: number
}

const callRank = ref<RankItem[]>([])
const tokenRank = ref<RankItem[]>([])

const loadData = () => {
  R.postJson('/api/model/usage/model_rank', {type: 'calls'}).then(res => {
    if (res.code === 0) callRank.value = res.data || []
  })
  R.postJson('/api/model/usage/model_rank', {type: 'tokens'}).then(res => {
    if (res.code === 0) tokenRank.value = res.data || []
  })
}

const formatValue = (val: number): string => {
  if (val >= 10000) return (val / 10000).toFixed(1) + 'w'
  if (val >= 1000) return (val / 1000).toFixed(1) + 'k'
  return val.toString()
}

const getBarWidth = (val: number, list: RankItem[]): number => {
  if (!list || list.length === 0) return 0
  const max = Math.max(...list.map(i => i.value))
  if (max === 0) return 0
  return Math.round((val / max) * 100)
}

onMounted(() => {
  loadData()
})

const timer = setInterval(loadData, 10000)
onBeforeUnmount(() => {
  clearInterval(timer)
})
</script>

<template>
  <div class="rank-card">
    <div class="rank-header">
      <div class="rank-section-title">
        <span class="title-dot dot-blue"></span>
        模型调用次数 TOP10
      </div>
      <div class="rank-section-title">
        <span class="title-dot dot-purple"></span>
        Token消耗 TOP10
      </div>
    </div>
    <div class="rank-body">
      <div class="rank-column">
        <div v-for="(item, index) in callRank.slice(0, 10)" :key="item.name" class="rank-item">
          <span class="rank-num" :class="'num-' + (index + 1)">{{ index + 1 }}</span>
          <span class="rank-name ellipsis">{{ item.name }}</span>
          <div class="rank-bar-wrap">
            <div class="rank-bar bar-blue" :style="{width: getBarWidth(item.value, callRank) + '%'}"></div>
          </div>
          <span class="rank-value">{{ formatValue(item.value) }}</span>
        </div>
        <el-empty v-if="callRank.length === 0" description="暂无数据" :image-size="50"></el-empty>
      </div>
      <div class="rank-column">
        <div v-for="(item, index) in tokenRank.slice(0, 10)" :key="item.name" class="rank-item">
          <span class="rank-num" :class="'num-' + (index + 1)">{{ index + 1 }}</span>
          <span class="rank-name ellipsis">{{ item.name }}</span>
          <div class="rank-bar-wrap">
            <div class="rank-bar bar-purple" :style="{width: getBarWidth(item.value, tokenRank) + '%'}"></div>
          </div>
          <span class="rank-value">{{ formatValue(item.value) }}</span>
        </div>
        <el-empty v-if="tokenRank.length === 0" description="暂无数据" :image-size="50"></el-empty>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.rank-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  padding: 20px 24px;

  .rank-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;

    .rank-section-title {
      font-size: 14px;
      font-weight: 600;
      color: #1a1a1a;
      display: flex;
      align-items: center;
      gap: 8px;

      .title-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;

        &.dot-blue { background: #409eff; }
        &.dot-purple { background: #9c27b0; }
      }
    }
  }

  .rank-body {
    display: flex;
    gap: 24px;

    .rank-column {
      flex: 1;
      min-width: 0;
    }

    .rank-item {
      display: flex;
      align-items: center;
      padding: 8px 0;
      gap: 10px;

      .rank-num {
        flex-shrink: 0;
        width: 22px;
        height: 22px;
        border-radius: 6px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 700;
        color: #fff;

        &.num-1 { background: linear-gradient(135deg, #fd7348, #f8906f); }
        &.num-2 { background: linear-gradient(135deg, #67c23a, #85ce61); }
        &.num-3 { background: linear-gradient(135deg, #e6a23c, #ebb563); }
        &.num-4, &.num-5, &.num-6, &.num-7, &.num-8, &.num-9, &.num-10 {
          background: #f0f0f0;
          color: #909399;
        }
      }

      .rank-name {
        flex-shrink: 0;
        width: 110px;
        font-size: 13px;
        color: #303133;
      }

      .rank-bar-wrap {
        flex: 1;
        height: 6px;
        background: #f5f5f5;
        border-radius: 3px;
        overflow: hidden;

        .rank-bar {
          height: 100%;
          border-radius: 3px;
          transition: width 0.4s ease;

          &.bar-blue { background: linear-gradient(90deg, #409eff, #a0cfff); }
          &.bar-purple { background: linear-gradient(90deg, #9c27b0, #ce93d8); }
        }
      }

      .rank-value {
        flex-shrink: 0;
        width: 48px;
        text-align: right;
        font-size: 13px;
        font-weight: 600;
        color: #606266;
      }
    }
  }
}

.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
