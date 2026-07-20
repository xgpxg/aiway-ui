<script setup lang="ts">
import {onMounted, onBeforeUnmount, ref} from "vue";
import {R} from "@/utils/R";
import SvgIcon from "@/components/SvgIcon/index.vue";

const overview = ref({
  total_tokens: 0,
  total_call_count: 0,
  today_tokens: 0,
  today_call_count: 0,
  avg_elapsed: 0,
  active_models: 0,
})

const loadOverview = () => {
  R.postJson('/api/model/usage/overview', {}).then(res => {
    if (res.code === 0) {
      overview.value = res.data
    }
  })
}

const formatTokens = (val: number): string => {
  if (val >= 1e9) return (val / 1e9).toFixed(1) + 'B'
  if (val >= 1e6) return (val / 1e6).toFixed(1) + 'M'
  if (val >= 1e3) return (val / 1e3).toFixed(1) + 'K'
  return val.toLocaleString()
}

onMounted(() => {
  loadOverview()
})

const timer = setInterval(loadOverview, 10000)
onBeforeUnmount(() => {
  clearInterval(timer)
})
</script>

<template>
  <el-row :gutter="20">

    <el-col :span="6">
      <div class="stat-card">
        <div class="card-body">
          <div class="icon-wrapper icon-blue">
            <svg-icon icon-class="token" size="24"></svg-icon>
          </div>
          <div class="info">
            <div class="label">今日Token消耗</div>
            <div class="value">{{ formatTokens(overview.today_tokens) }}</div>
          </div>
        </div>
        <svg class="decoration" viewBox="0 0 120 60" preserveAspectRatio="none">
          <path d="M0,60 Q60,0 120,60 Z" fill="#e8f0fe" opacity="0.6"/>
        </svg>
      </div>
    </el-col>
    <el-col :span="6">
      <div class="stat-card">
        <div class="card-body">
          <div class="icon-wrapper icon-green">
            <svg-icon icon-class="request-count-2" size="24"></svg-icon>
          </div>
          <div class="info">
            <div class="label">今日请求数</div>
            <div class="value">{{ overview.today_call_count.toLocaleString() }}</div>
          </div>
        </div>
        <svg class="decoration" viewBox="0 0 120 60" preserveAspectRatio="none">
          <path d="M0,60 Q60,0 120,60 Z" fill="#e6f4ea" opacity="0.6"/>
        </svg>
      </div>
    </el-col>
    <el-col :span="6">
      <div class="stat-card">
        <div class="card-body">
          <div class="icon-wrapper icon-purple">
            <svg-icon icon-class="token2" size="24"></svg-icon>
          </div>
          <div class="info">
            <div class="label">Token消耗总量</div>
            <div class="value">{{ formatTokens(overview.total_tokens) }}</div>
          </div>
        </div>
        <svg class="decoration" viewBox="0 0 120 60" preserveAspectRatio="none">
          <path d="M0,60 Q60,0 120,60 Z" fill="#f3e8fd" opacity="0.6"/>
        </svg>
      </div>
    </el-col>
    <el-col :span="6">
      <div class="stat-card">
        <div class="card-body">
          <div class="icon-wrapper icon-orange">
            <svg-icon icon-class="total" size="24"></svg-icon>
          </div>
          <div class="info">
            <div class="label">累计请求数</div>
            <div class="value">{{ overview.total_call_count.toLocaleString() }}</div>
          </div>
        </div>
        <svg class="decoration" viewBox="0 0 120 60" preserveAspectRatio="none">
          <path d="M0,60 Q60,0 120,60 Z" fill="#fef3e0" opacity="0.6"/>
        </svg>
      </div>
    </el-col>
  </el-row>
</template>

<style scoped lang="scss">
.stat-card {
  position: relative;
  padding: 20px 24px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  min-height: 60px;

  .card-body {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .icon-wrapper {
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;

    &.icon-blue {
      background: #e8f0fe;
      color: #4285f4;
    }

    &.icon-green {
      background: #e6f4ea;
      color: #34a853;
    }

    &.icon-purple {
      background: #f3e8fd;
      color: #9c27b0;
    }

    &.icon-orange {
      background: #fef3e0;
      color: #f57c00;
    }
  }

  .info {
    flex: 1;
    min-width: 0;
  }

  .label {
    font-size: 13px;
    color: #8c8c8c;
    margin-bottom: 4px;
  }

  .value {
    font-size: 28px;
    font-weight: 700;
    color: #1a1a1a;
    line-height: 1.2;
  }

  .decoration {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 80px;
    height: 40px;
    pointer-events: none;
  }
}
</style>
