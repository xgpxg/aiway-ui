<script setup lang="ts">
import {ref, reactive} from "vue"
import {ElMessage} from "element-plus"
import {R} from "../../utils/R"
import CopyText from "../../components/Copy/copy-text.vue"

const isShow = ref(false)
const show = () => {
  isShow.value = true
  loadCerts()
}
defineExpose({show})

// 签发证书表单
const genForm = reactive({
  domain: ''
})
const issuing = ref(false)

// 分页
const page = ref({
  page_num: 1,
  page_size: 5,
  total: 0
})

// 证书列表
const certList = ref<any[]>([])

const loading = ref(false)
const renewLoadingMap = reactive<Record<string, boolean>>({})
const loadCerts = () => {
  loading.value = true
  R.postJson('/api/cert/list', {
    page: page.value
  }).then(res => {
    if (res.code === 0 && res.data) {
      certList.value = res.data.list || []
      page.value.total = res.data.total || 0
    }
  }).finally(() => {
    loading.value = false
  })
}

const issueCert = () => {
  if (!genForm.domain.trim()) {
    ElMessage.warning('请输入域名')
    return
  }
  issuing.value = true
  R.postJson('/api/cert/issue', {
    domain: genForm.domain.trim()
  }).then(res => {
    if (res.code === 0) {
      ElMessage.success(`已为 ${genForm.domain} 签发证书`)
      genForm.domain = ''
      loadCerts()
    }
  }).finally(() => {
    issuing.value = false
  })
}

const deleteCert = (cert: any) => {
  R.postJson('/api/cert/delete', {ids: [cert.id]}).then(res => {
    if (res.code === 0) {
      ElMessage.success('证书已删除')
      loadCerts()
    }
  })
}

const renewCert = (cert: any) => {
  renewLoadingMap[cert.id] = true
  R.postJson('/api/cert/renew', {id: cert.id}).then(res => {
    if (res.code === 0) {
      ElMessage.success(`已为 ${cert.domain} 续期证书`)
      loadCerts()
    }
  }).finally(() => {
    renewLoadingMap[cert.id] = false
  })
}

const setAutoRenew = (cert: any) => {
  R.postJson('/api/cert/set_auto_renew', {
    id: cert.id,
    auto_renew: cert.auto_renew
  })
}

const statusMap: Record<string, { type: string; label: string }> = {
  Active: {type: 'success', label: '有效'},
  Expired: {type: 'danger', label: '已过期'},
  Revoked: {type: 'info', label: '已吊销'}
}

const providerMap: Record<string, string> = {
  cloudflare: 'Cloudflare',
  dnspod: 'DNSPod',
  ali: '阿里云'
}
</script>

<template>
  <el-dialog v-model="isShow" title="证书管理" width="950px" destroy-on-close>
    <!-- 签发证书 -->
    <div class="">
      <div class="section-title">签发证书</div>
      <div class="flex-v">
        <el-input v-model="genForm.domain" placeholder="输入域名，支持通配符，例如：example.com 或 *.example.com"
                  class="mr10"
                  clearable style="flex: 1"></el-input>
        <el-button type="primary" icon="plus" @click="issueCert" :loading="issuing">签发证书</el-button>
      </div>
    </div>
    <div class="mt10">
      <el-text v-if="issuing" size="small">正在签发证书，预计1分钟内完成，请稍候...</el-text>
    </div>
    <!-- 证书列表 -->
    <div class="mt20">
      <div class="section-title">证书列表</div>
      <el-table :data="certList" empty-text="暂无证书数据" max-height="400" v-loading="loading">
        <el-table-column label="域名" prop="domain" min-width="140" show-overflow-tooltip></el-table-column>
        <el-table-column label="签发时间" prop="issued_at" width="160">
          <template #default="{row}">
            <span class="">{{ row.issued_at }}</span>
          </template>
        </el-table-column>
        <el-table-column label="到期时间" prop="expires_at" width="160">
          <template #default="{row}">
            <span class="">{{ row.expires_at }}</span>
          </template>
        </el-table-column>
        <el-table-column label="自动续期" width="80">
          <template #default="{row}">
            <el-switch v-model="row.auto_renew" @change="setAutoRenew(row)"
                       :disabled="row.status === 'Revoked'"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="80">
          <template #default="{row}">
            <el-tag :type="(statusMap[row.status]?.type as any)" effect="plain">
              {{ statusMap[row.status]?.label || row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" fixed="right">
          <template #default="{row}">
            <el-button type="primary" link @click="renewCert(row)" :disabled="row.status === 'Revoked'"
                       :loading="renewLoadingMap[row.id]">续期
            </el-button>
            <el-popconfirm title="确定删除此证书吗？" @confirm="deleteCert(row)" width="180">
              <template #reference>
                <el-button type="danger" link>删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          background
          layout="prev, pager, next, total"
          :page-size="page.page_size"
          :current-page="page.page_num"
          :total="page.total"
          hide-on-single-page
          @current-change="(pageNum: number) => {page.page_num = pageNum; loadCerts()}"
          class="mt10 fr">
      </el-pagination>
    </div>

    <template #footer>
      <el-button @click="isShow = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.section-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 10px;
  padding-left: 8px;
  border-left: 3px solid var(--el-color-primary);
}

.text-sm {
  font-size: 12px;
  color: var(--el-text-color-regular);
}
</style>
