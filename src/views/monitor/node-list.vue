<script setup lang="ts">
import {Timer, Search} from '@element-plus/icons-vue'
import {ref, computed} from 'vue'

interface NodeInfo {
  id: string;
  address: string;
  status: 'online' | 'offline' | 'error';
  connections: number;
  exceptions: number;
  cpuUsage: number;
  memoryUsage: number;
  uptime: string;
}

const nodeList: NodeInfo[] = [
  {
    id: 'node-001',
    address: '192.168.1.101:8080',
    status: 'online',
    connections: 1243,
    exceptions: 0,
    cpuUsage: 42,
    memoryUsage: 65,
    uptime: '12天 5小时'
  },
  {
    id: 'node-002',
    address: '192.168.1.102:8080',
    status: 'online',
    connections: 986,
    exceptions: 2,
    cpuUsage: 38,
    memoryUsage: 57,
    uptime: '8天 12小时'
  },
  {
    id: 'node-003',
    address: '192.168.1.103:8080',
    status: 'error',
    connections: 0,
    exceptions: 15,
    cpuUsage: 0,
    memoryUsage: 0,
    uptime: '0天 0小时'
  },
  {
    id: 'node-004',
    address: '192.168.1.104:8080',
    status: 'offline',
    connections: 0,
    exceptions: 0,
    cpuUsage: 0,
    memoryUsage: 0,
    uptime: '0天 0小时'
  },
  {
    id: 'node-005',
    address: '192.168.1.105:8080',
    status: 'online',
    connections: 2105,
    exceptions: 1,
    cpuUsage: 67,
    memoryUsage: 78,
    uptime: '15天 3小时'
  },
  {
    id: 'node-006',
    address: '192.168.1.106:8080',
    status: 'online',
    connections: 765,
    exceptions: 0,
    cpuUsage: 29,
    memoryUsage: 42,
    uptime: '5天 18小时'
  }
];

// 筛选条件
const filterStatus = ref<string>('')
const filterAddress = ref<string>('')

// 计算过滤后的节点列表
const filteredNodeList = computed(() => {
  return nodeList.filter(node => {
    const statusMatch = filterStatus.value ? node.status === filterStatus.value : true
    const addressMatch = filterAddress.value ? node.address.includes(filterAddress.value) : true
    return statusMatch && addressMatch
  })
})

const getStatusText = (status: string) => {
  switch (status) {
    case 'online':
      return '在线';
    case 'offline':
      return '离线';
    case 'error':
      return '异常';
    default:
      return '未知';
  }
};

const getStatusType = (status: string) => {
  switch (status) {
    case 'online':
      return 'success';
    case 'offline':
      return 'info';
    case 'error':
      return 'danger';
    default:
      return 'info';
  }
};

const statusOptions = [
  {value: '', label: '全部状态'},
  {value: 'online', label: '在线'},
  {value: 'offline', label: '离线'},
  {value: 'error', label: '异常'}
]
</script>

<template>
  <div class="node-dashboard">
    <!-- 筛选区域 -->
    <div class="filter-section">
      <el-select
          v-model="filterStatus"
          placeholder="选择节点状态"
          clearable
          style="width: 200px"
      >
        <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        />
      </el-select>
      <el-input
          v-model="filterAddress"
          placeholder="搜索节点地址..."
          clearable
          prefix-icon="Search"
      >
        <template #append>
          <el-button :icon="Search"/>
        </template>
      </el-input>
    </div>

    <!-- 节点列表 -->
    <div class="nodes-section">
      <el-row :gutter="16">
        <el-col
            v-for="node in filteredNodeList"
            :key="node.id"
            :span="6"
        >
          <div class="node-card">
            <div class="node-header">
              <div class="node-title">
                <h3>{{ node.address }}</h3>
                <el-tag
                    :type="getStatusType(node.status)"
                    size="small"
                >
                  {{ getStatusText(node.status) }}
                </el-tag>
              </div>
            </div>

            <div class="node-body">
              <div class="metrics-grid">
                <div class="metric-item">
                  <div class="metric-label">连接数</div>
                  <div class="metric-value connections">{{ node.connections.toLocaleString() }}</div>
                </div>

                <div class="metric-item">
                  <div class="metric-label">异常数</div>
                  <div class="metric-value exceptions" :class="{ 'has-exceptions': node.exceptions > 0 }">
                    {{ node.exceptions }}
                  </div>
                </div>

                <div class="metric-item">
                  <div class="metric-label">CPU使用率</div>
                  <div class="metric-value cpu">{{ node.cpuUsage }}%</div>
                </div>

                <div class="metric-item">
                  <div class="metric-label">内存使用率</div>
                  <div class="metric-value memory">{{ node.memoryUsage }}%</div>
                </div>
              </div>

              <div class="node-footer">
                <div class="uptime">
                  <el-icon>
                    <Timer/>
                  </el-icon>
                  <span>{{ node.uptime }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>

      <!-- 无数据提示 -->
      <div v-if="filteredNodeList.length === 0" class="no-data">
        <el-empty description="未找到匹配的节点"/>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.node-dashboard {

  .filter-section {
    margin-bottom: 16px;
    //padding: 12px;
    //background: var(--el-bg-color-overlay);
    border-radius: 8px;
    //box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    display: flex;
    gap: 10px;
  }

  .nodes-section {
    .node-card {
      margin-bottom: 12px;
      border-radius: 8px;
      background: var(--el-bg-color-overlay);
      box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      border: 1px solid var(--el-border-color-lighter);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
      }

      .node-header {
        padding: 12px 12px 0;

        .node-title {
          display: flex;
          justify-content: space-between;
          align-items: center;

          h3 {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
            color: var(--el-text-color-primary);
          }
        }
      }

      .node-body {
        padding: 12px;

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 12px;

          .metric-item {
            .metric-label {
              font-size: 12px;
              color: var(--el-text-color-secondary);
              margin-bottom: 4px;
            }

            .metric-value {
              font-size: 18px;
              font-weight: 600;

              &.connections {
                color: #409eff;
              }

              &.exceptions {
                color: #67c23a;

                &.has-exceptions {
                  color: #f56c6c;
                }
              }

              &.cpu {
                color: #e6a23c;
              }

              &.memory {
                color: #f56c6c;
              }
            }
          }
        }

        .node-footer {
          .uptime {
            display: flex;
            align-items: center;
            color: var(--el-text-color-secondary);
            font-size: 12px;

            .el-icon {
              margin-right: 4px;
            }
          }
        }
      }
    }

    .no-data {
      padding: 30px 0;
      text-align: center;
    }
  }
}
</style>