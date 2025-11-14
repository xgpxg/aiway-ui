<script setup lang="ts">
import {ref} from 'vue'

interface ServiceRankItem {
  id: number
  name: string
  address: string
  description: string
  value: number
  change?: number
}

interface ApiRankItem {
  id: number
  path: string
  service: string
  value: number
  change?: number
}

// Tab 页选中项
const activeTab = ref('hot-services')

// 热点服务榜数据
const hotServices = ref<ServiceRankItem[]>([
  {
    id: 1,
    name: '用户服务',
    address: '192.168.1.10:8080',
    description: '负责用户注册、登录、信息管理等功能',
    value: 12850,
    change: 2
  },
  {
    id: 2,
    name: '订单服务',
    address: '192.168.1.11:8080',
    description: '处理订单创建、查询、修改等操作',
    value: 9870,
    change: -1
  },
  {
    id: 3,
    name: '支付服务',
    address: '192.168.1.12:8080',
    description: '对接第三方支付平台，处理支付流程',
    value: 8760,
    change: 5
  },
  {
    id: 4,
    name: '商品服务',
    address: '192.168.1.13:8080',
    description: '商品信息管理，包括价格、库存等',
    value: 7650,
    change: 0
  },
  {
    id: 5,
    name: '库存服务',
    address: '192.168.1.14:8080',
    description: '管理商品库存，处理出入库操作',
    value: 6540,
    change: -3
  }
])

// 热门接口榜数据
const hotApis = ref<ApiRankItem[]>([
  {id: 1, path: 'GET /api/users/profile', service: '用户服务', value: 8650, change: 3},
  {id: 2, path: 'POST /api/orders/create', service: '订单服务', value: 7650, change: 1},
  {id: 3, path: 'PUT /api/payments/process', service: '支付服务', value: 6540, change: -2},
  {id: 4, path: 'GET /api/products/list', service: '商品服务', value: 5430, change: 0},
  {id: 5, path: 'DELETE /api/cart/remove', service: '购物车服务', value: 4320, change: -1}
])

// 格式化数字显示
const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}
</script>

<template>
  <div class="rank-container">
    <div class="card">
      <el-tabs v-model="activeTab" class="rank-tabs">
        <el-tab-pane label="热点服务" name="hot-services">
          <div class="rank-list">
            <div
                v-for="(item, index) in hotServices"
                :key="item.id"
                class="rank-item"
            >
              <div class="rank-index">
                <span
                    v-if="index < 3"
                    class="top-index"
                    :class="'index-' + (index + 1)"
                >
                  {{ index + 1 }}
                </span>
                <span v-else class="normal-index">{{ index + 1 }}</span>
              </div>

              <div class="rank-info">
                <div class="main-info">
                  <div class="service-name ellipsis">{{ item.name }}</div>
                  <div class="rank-value">{{ formatNumber(item.value) }}</div>
                </div>

                <div class="sub-info">
                  <!--                  <div class="address ellipsis">{{ item.address }}</div>-->
                  <div class="description ellipsis">{{ item.description }}</div>
                </div>
              </div>

              <div class="rank-change"
                   :class="item.change && item.change > 0 ? 'up' : item.change && item.change < 0 ? 'down' : ''">
                <span v-if="item.change && item.change > 0">↑ {{ item.change }}</span>
                <span v-else-if="item.change && item.change < 0">↓ {{ Math.abs(item.change) }}</span>
                <span v-else>-</span>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="热门接口" name="hot-apis">
          <div class="rank-list">
            <div
                v-for="(item, index) in hotApis"
                :key="item.id"
                class="rank-item"
            >
              <div class="rank-index">
                <span
                    v-if="index < 3"
                    class="top-index"
                    :class="'index-' + (index + 1)"
                >
                  {{ index + 1 }}
                </span>
                <span v-else class="normal-index">{{ index + 1 }}</span>
              </div>

              <div class="rank-info">
                <div class="main-info">
                  <div class="api-path ellipsis">{{ item.path }}</div>
                  <div class="rank-value">{{ formatNumber(item.value) }}</div>
                </div>

                <div class="sub-info">
                  <div class="service ellipsis">所属服务: {{ item.service }}</div>
                </div>
              </div>

              <div class="rank-change"
                   :class="item.change && item.change > 0 ? 'up' : item.change && item.change < 0 ? 'down' : ''">
                <span v-if="item.change && item.change > 0">↑ {{ item.change }}</span>
                <span v-else-if="item.change && item.change < 0">↓ {{ Math.abs(item.change) }}</span>
                <span v-else>-</span>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style scoped lang="scss">

.rank-container {
}

.card {
  border: 1px solid #f0f0f0;
  background: #ffffff;
  border-radius: 6px;
  padding: 10px 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

  .title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 15px;
    color: #303133;
  }
}

.rank-tabs {
  :deep(.el-tabs__header) {
    margin-bottom: 10px;

    .el-tabs__nav-wrap::after {
      height: 1px;
    }

    .el-tabs__item {
      font-size: 14px;
      font-weight: 500;
      padding: 0 10px;
    }
  }

  .rank-list {
    .rank-item {
      display: flex;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px dashed #f0f0f0;

      &:last-child {
        border-bottom: none;
      }

      .rank-index {
        width: 24px;
        text-align: center;
        font-weight: bold;
        font-size: 12px;

        .top-index {
          display: inline-block;
          width: 18px;
          height: 18px;
          line-height: 18px;
          border-radius: 50%;
          color: #ffffff;

          &.index-1 {
            background-color: #409eff;
          }

          &.index-2 {
            background-color: #67c23a;
          }

          &.index-3 {
            background-color: #e6a23c;
          }
        }

        .normal-index {
          color: #909399;
        }
      }

      .rank-info {
        flex: 1;
        margin: 0 10px;

        .main-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 3px;

          .service-name, .api-path {
            font-size: 14px;
            color: #606266;
            max-width: 200px;
          }

          .rank-value {
            font-size: 13px;
            color: #909399;
            font-weight: 500;
          }
        }

        .sub-info {
          .address, .description, .service {
            font-size: 12px;
            color: #909399;
            max-width: 300px;
          }

          .address {
            margin-bottom: 2px;
          }
        }
      }

      .rank-change {
        width: 40px;
        text-align: right;
        font-size: 12px;

        &.up {
          color: #67c23a;
        }

        &.down {
          color: #f56c6c;
        }
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