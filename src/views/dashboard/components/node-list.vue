<script setup lang="ts">
import {Timer} from '@element-plus/icons-vue'
import {ref, onMounted, onUnmounted} from 'vue'
import {R} from "@/utils/R";
import {U} from "@/utils/util";
import SvgIcon from "../../../components/SvgIcon/index.vue";
import NodeMonitor from "./node-monitor.vue";

interface NodeInfo {
  id: string;
  node_id: string;
  ip: string;
  port: number;
  address: string;
  status: 'online' | 'offline' | 'error';
  online_time: string;
  state: {
    os: string;
    cpu_usage: number;
    mem_total: number;
    mem_used: number;
    http_connect_count: number;
    sse_connect_count: number;
    avg_qps: number;
  }
}

const nodeList = ref<NodeInfo[]>([]);
const isShowNodeDetail = ref(false)
const currNode = ref()

onMounted(() => {
  loadData()
})

// 每5秒钟刷新
const timer = setInterval(() => {
  loadData()
}, 5000)

onUnmounted(() => {
  clearInterval(timer)
})

const loadData = () => {
  R.postJson('/api/node/list', {
    page: {
      page_num: 1,
      page_size: 10
    }
  }).then((res: any) => {
    nodeList.value = res.data.list
    nodeList.value.forEach(node => {
      if (node.node_id === currNode.value?.node_id) {
        currNode.value = node
      }
    })
  })
}


const getStatusText = (status: string) => {
  switch (status) {
    case 'Online':
      return '在线';
    case 'Offline':
      return '离线';
    case 'Error':
      return '异常';
    default:
      return '未知';
  }
};

const getStatusType = (status: string) => {
  switch (status) {
    case 'Online':
      return 'success';
    case 'Offline':
      return 'info';
    case 'Error':
      return 'danger';
    default:
      return 'info';
  }
};
</script>

<template>
  <div class="node-dashboard" v-if="nodeList.length>0">
    <div class="nodes-section">
      <el-row :gutter="16">
        <el-col
            v-for="node in nodeList"
            :key="node.id"
            :span="8"
            @click="currNode=node;isShowNodeDetail=true"
        >
          <div class="node-card">
            <div class="node-header">
              <div class="node-title">
                <div class="flex-v">
                  <el-icon class="mr5">
                    <svg-icon icon-class="server"></svg-icon>
                  </el-icon>
                  <h3>{{ node.ip }}:{{ node.port }}</h3>
                </div>
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
                  <div class="metric-value connections">
                    {{ (node.state?.http_connect_count + node.state?.sse_connect_count).toLocaleString() }}
                  </div>
                </div>

                <div class="metric-item">
                  <div class="metric-label">QPS</div>
                  <div class="metric-value">
                    {{ node.state.avg_qps }}
                  </div>
                </div>

                <div class="metric-item">
                  <div class="metric-label">CPU使用率</div>
                  <div class="metric-value cpu">{{ node.state.cpu_usage?.toFixed(2) }}%</div>
                </div>

                <div class="metric-item">
                  <div class="metric-label">内存使用率</div>
                  <div class="metric-value memory">{{ (node.state.mem_used / node.state.mem_total)?.toFixed(2) }}%</div>
                </div>
              </div>

              <div class="node-footer">

              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
  <el-drawer v-if="U.isDev()" :title="`节点详情（${currNode.ip}:${currNode.port}）`" v-model="isShowNodeDetail"
             size="50vw" destroy-on-close append-to-body>
    <node-monitor :node-id="currNode.node_id" :attr="currNode.attr" :state="currNode.state"></node-monitor>
  </el-drawer>
</template>

<style scoped lang="scss">
.node-dashboard {
  padding: 10px;

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
      //box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      border: 1px solid var(--el-border-color-lighter);
      padding: 8px;

      &:hover {
        //transform: translateY(-2px);
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
      }

      .node-header {
        padding: 6px 6px 0;

        .node-title {
          display: flex;
          justify-content: space-between;
          align-items: center;

          h3 {
            margin: 0;
            font-size: 14px;
            font-weight: 600;
            color: var(--el-text-color-primary);
          }
        }
      }

      .node-body {
        padding: 8px;

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          margin-bottom: 8px;

          .metric-item {
            .metric-label {
              font-size: 12px;
              color: var(--el-text-color-secondary);
              margin-bottom: 2px;
            }

            .metric-value {
              font-size: 16px;
              font-weight: 600;
              color: var(--el-text-color-primary);

              &.connections {
                //color: #409eff;
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
              margin-right: 2px;
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