<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface SystemInfo {
  os: string
  version: string
  uptime: string
  hostname: string
  architecture: string
  cpuUsage: number
  memoryUsage: number
  diskUsage: number
  network: {
    in: string
    out: string
  }
}

const systemInfo = ref<SystemInfo>({
  os: '',
  version: '',
  uptime: '',
  hostname: '',
  architecture: '',
  cpuUsage: 0,
  memoryUsage: 0,
  diskUsage: 0,
  network: {
    in: '',
    out: ''
  }
})

// 格式化运行时间
const formatUptime = (seconds: number): string => {
  const days = Math.floor(seconds / (24 * 3600))
  seconds %= (24 * 3600)
  const hours = Math.floor(seconds / 3600)
  seconds %= 3600
  const minutes = Math.floor(seconds / 60)
  
  if (days > 0) {
    return `${days}天${hours}小时${minutes}分钟`
  } else if (hours > 0) {
    return `${hours}小时${minutes}分钟`
  } else {
    return `${minutes}分钟`
  }
}

// 格式化网络流量
const formatNetwork = (bytes: number): string => {
  if (bytes > 1024 * 1024 * 1024) {
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB'
  } else if (bytes > 1024 * 1024) {
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  } else if (bytes > 1024) {
    return (bytes / 1024).toFixed(2) + ' KB'
  } else {
    return bytes + ' B'
  }
}

// 模拟获取系统信息数据
const fetchSystemInfo = () => {
  // 在实际应用中，这里会是API调用
  systemInfo.value = {
    os: 'Ubuntu',
    version: '22.04 LTS',
    uptime: formatUptime(Math.floor(Math.random() * 1000000)),
    hostname: 'server-01',
    architecture: 'x86_64',
    cpuUsage: Math.floor(Math.random() * 100),
    memoryUsage: Math.floor(Math.random() * 100),
    diskUsage: Math.floor(Math.random() * 100),
    network: {
      in: formatNetwork(Math.floor(Math.random() * 1000000000)),
      out: formatNetwork(Math.floor(Math.random() * 1000000000))
    }
  }
}

onMounted(() => {
  fetchSystemInfo()
  // 定时更新数据
  setInterval(fetchSystemInfo, 5000)
})
</script>

<template>
  <div class="system-info-dashboard">
    <div class="dashboard-header">
      <div class="header-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="8" y1="21" x2="16" y2="21"></line>
          <line x1="12" y1="17" x2="12" y2="21"></line>
        </svg>
      </div>
      <h2>节点信息</h2>
    </div>
    
    <div class="dashboard-content">
      <!-- 基本信息区域 -->
      <div class="info-section">
        <h3>基本信息</h3>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">操作系统</span>
            <span class="value">{{ systemInfo.os }} {{ systemInfo.version }}</span>
          </div>
          <div class="info-item">
            <span class="label">运行时间</span>
            <span class="value">{{ systemInfo.uptime }}</span>
          </div>
          <div class="info-item">
            <span class="label">主机名</span>
            <span class="value">{{ systemInfo.hostname }}</span>
          </div>
          <div class="info-item">
            <span class="label">架构</span>
            <span class="value">{{ systemInfo.architecture }}</span>
          </div>
        </div>
      </div>
      
      <!-- 资源使用情况区域 -->
      <div class="usage-section">
        <h3>资源使用情况</h3>
        <div class="usage-grid">
          <!-- CPU使用率 -->
          <div class="usage-card">
            <div class="usage-header">
              <span class="usage-label">CPU</span>
              <span class="usage-value">{{ systemInfo.cpuUsage }}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: systemInfo.cpuUsage + '%' }"></div>
            </div>
          </div>
          
          <!-- 内存使用率 -->
          <div class="usage-card">
            <div class="usage-header">
              <span class="usage-label">内存</span>
              <span class="usage-value">{{ systemInfo.memoryUsage }}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: systemInfo.memoryUsage + '%' }"></div>
            </div>
          </div>
          
          <!-- 磁盘使用率 -->
          <div class="usage-card">
            <div class="usage-header">
              <span class="usage-label">磁盘</span>
              <span class="usage-value">{{ systemInfo.diskUsage }}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: systemInfo.diskUsage + '%' }"></div>
            </div>
          </div>
          
          <!-- 网络流量 -->
          <div class="usage-card network-card">
            <div class="network-item">
              <span class="network-label">入站</span>
              <span class="network-value">{{ systemInfo.network.in }}</span>
            </div>
            <div class="network-item">
              <span class="network-label">出站</span>
              <span class="network-value">{{ systemInfo.network.out }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.system-info-dashboard {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #ffffff;
  height: 400px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  
  .dashboard-header {
    display: flex;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid #f0f0f0;
    background: #fafafa;
    
    .header-icon {
      width: 36px;
      height: 36px;
      background: #43cea2;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
      
      svg {
        color: white;
      }
    }
    
    h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }
  }
  
  .dashboard-content {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    
    .info-section {
      margin-bottom: 24px;
      
      h3 {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        margin: 0 0 12px 0;
        padding-bottom: 8px;
        border-bottom: 1px solid #f0f0f0;
      }
      
      .info-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
        
        .info-item {
          display: flex;
          flex-direction: column;
          padding: 12px 16px;
          border: 1px solid #f0f0f0;
          border-radius: 6px;
          background: #ffffff;
          
          .label {
            font-size: 13px;
            color: #666;
            margin-bottom: 6px;
          }
          
          .value {
            font-size: 14px;
            font-weight: 500;
            color: #333;
          }
        }
      }
    }
    
    .usage-section {
      h3 {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        margin: 0 0 12px 0;
        padding-bottom: 8px;
        border-bottom: 1px solid #f0f0f0;
      }
      
      .usage-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
        
        .usage-card {
          padding: 16px;
          border: 1px solid #f0f0f0;
          border-radius: 6px;
          background: #ffffff;
          
          .usage-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            
            .usage-label {
              font-size: 14px;
              font-weight: 500;
              color: #666;
            }
            
            .usage-value {
              font-size: 16px;
              font-weight: 600;
              color: #333;
            }
          }
          
          .progress-bar {
            height: 8px;
            background: #f0f0f0;
            border-radius: 4px;
            overflow: hidden;
            
            .progress-fill {
              height: 100%;
              background: #43cea2;
              border-radius: 4px;
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
            margin-bottom: 8px;
            
            &:last-child {
              margin-bottom: 0;
            }
            
            .network-label {
              font-size: 14px;
              color: #666;
            }
            
            .network-value {
              font-size: 14px;
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
    height: 400px;
    
    .dashboard-header {
      padding: 12px 16px;
      
      .header-icon {
        width: 32px;
        height: 32px;
      }
      
      h2 {
        font-size: 16px;
      }
    }
    
    .dashboard-content {
      padding: 16px;
      
      .info-section {
        margin-bottom: 20px;
        
        h3 {
          font-size: 15px;
        }
        
        .info-grid {
          gap: 12px;
          
          .info-item {
            padding: 10px 14px;
            
            .label {
              font-size: 12px;
            }
            
            .value {
              font-size: 13px;
            }
          }
        }
      }
      
      .usage-section {
        h3 {
          font-size: 15px;
        }
        
        .usage-grid {
          gap: 12px;
          
          .usage-card {
            padding: 14px;
            
            .usage-header {
              margin-bottom: 10px;
              
              .usage-label {
                font-size: 13px;
              }
              
              .usage-value {
                font-size: 15px;
              }
            }
            
            .progress-bar {
              height: 7px;
            }
          }
          
          .network-card {
            .network-item {
              .network-label, .network-value {
                font-size: 13px;
              }
            }
          }
        }
      }
    }
  }
}
</style>