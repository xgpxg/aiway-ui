<script setup lang="ts">
import {ref, onMounted, onUnmounted} from 'vue'
import {U} from "@/utils/util";

const props = defineProps(['attr', 'state'])

// 格式化运行时间
const formatUptime = (seconds: number): string => {
  const days = Math.floor(seconds / (24 * 3600))
  seconds %= (24 * 3600)
  const hours = Math.floor(seconds / 3600)
  seconds %= 3600
  const minutes = Math.floor(seconds / 60)

  if (days > 0) {
    return `${days} 天 ${hours} 小时 ${minutes} 分钟`
  } else if (hours > 0) {
    return `${hours} 小时 ${minutes} 分钟`
  } else {
    return `${minutes} 分钟`
  }
}


</script>

<template>
  <div>
    <el-descriptions title="基本信息" :column="2">
      <el-descriptions-item label="操作系统" width="50%">
        {{ attr.os }}
      </el-descriptions-item>
      <el-descriptions-item label="运行时间" width="50%">{{ formatUptime(attr.uptime) }}</el-descriptions-item>
      <el-descriptions-item label="主机名" width="50%">{{ attr.host_name }}</el-descriptions-item>
      <el-descriptions-item label="CPU 架构" width="50%">{{ attr.arch }}</el-descriptions-item>
    </el-descriptions>
    <el-descriptions title="资源使用情况" :column="2">
      <el-descriptions-item label="CPU 使用率" width="50%">{{ state.cpu_usage.toFixed(2) }}%</el-descriptions-item>
      <el-descriptions-item label="内存用量" width="50%">
        {{ U.renderSize(state.mem_free) }} 可用 / 共 {{ U.renderSize(state.mem_total) }}
      </el-descriptions-item>
      <el-descriptions-item label="磁盘用量" width="50%">
        {{ U.renderSize(state.disk_free) }} 可用 / 共 {{ U.renderSize(state.disk_total) }}
      </el-descriptions-item>
      <el-descriptions-item label="网络流量" width="50%">
        {{ U.renderSize(state.net_rx) }} / {{ U.renderSize(state.net_tx) }}
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<style scoped lang="scss">
.system-info-dashboard {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #ffffff;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .dashboard-header {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid #f0f0f0;
    background: #fafafa;

    .header-icon {
      width: 32px;
      height: 32px;
      background: #43cea2;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 10px;

      svg {
        color: white;
      }
    }

    h2 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }
  }

  .dashboard-content {
    flex: 1;
    padding: 16px;
    overflow-y: auto;

    .info-section {
      margin-bottom: 20px;

      h3 {
        font-size: 15px;
        font-weight: 600;
        color: #333;
        margin: 0 0 10px 0;
        padding-bottom: 6px;
        border-bottom: 1px solid #f0f0f0;
      }

      .info-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;

        .info-item {
          display: flex;
          flex-direction: column;
          padding: 10px 12px;
          border: 1px solid #f0f0f0;
          border-radius: 6px;
          background: #ffffff;

          .label {
            font-size: 12px;
            color: #666;
            margin-bottom: 4px;
          }

          .value {
            font-size: 13px;
            font-weight: 500;
            color: #333;
          }
        }
      }
    }

    .usage-section {
      h3 {
        font-size: 15px;
        font-weight: 600;
        color: #333;
        margin: 0 0 10px 0;
        padding-bottom: 6px;
        border-bottom: 1px solid #f0f0f0;
      }

      .usage-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;

        .usage-card {
          padding: 12px;
          border: 1px solid #f0f0f0;
          border-radius: 6px;
          background: #ffffff;

          .usage-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;

            .usage-label {
              font-size: 13px;
              font-weight: 500;
              color: #666;
            }

            .usage-value {
              font-size: 14px;
              font-weight: 600;
              color: #333;
            }
          }

          .progress-bar {
            height: 6px;
            background: #f0f0f0;
            border-radius: 3px;
            overflow: hidden;

            .progress-fill {
              height: 100%;
              background: linear-gradient(90deg, #43cea2, #185a9d);
              border-radius: 3px;
              transition: width 0.3s ease;
            }
          }
        }

        .network-card {
          display: flex;
          flex-direction: column;
          justify-content: center;

          .network-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 6px;

            &:last-child {
              margin-bottom: 0;
            }

            .network-label {
              font-size: 13px;
              color: #666;
            }

            .network-value {
              font-size: 13px;
              font-weight: 500;
              color: #333;
            }
          }
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .system-info-dashboard {
    height: 380px;

    .dashboard-header {
      padding: 10px 14px;

      .header-icon {
        width: 28px;
        height: 28px;
      }

      h2 {
        font-size: 15px;
      }
    }

    .dashboard-content {
      padding: 14px;

      .info-section {
        margin-bottom: 16px;

        h3 {
          font-size: 14px;
        }

        .info-grid {
          gap: 10px;

          .info-item {
            padding: 8px 10px;

            .label {
              font-size: 11px;
            }

            .value {
              font-size: 12px;
            }
          }
        }
      }

      .usage-section {
        h3 {
          font-size: 14px;
        }

        .usage-grid {
          gap: 10px;

          .usage-card {
            padding: 10px;

            .usage-header {
              margin-bottom: 6px;

              .usage-label {
                font-size: 12px;
              }

              .usage-value {
                font-size: 13px;
              }
            }

            .progress-bar {
              height: 5px;
            }
          }

          .network-card {
            .network-item {
              .network-label, .network-value {
                font-size: 12px;
              }
            }
          }
        }
      }
    }
  }
}
</style>