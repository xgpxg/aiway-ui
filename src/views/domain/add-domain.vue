<script setup lang="ts">
import {ref, watch} from "vue";
import {R} from "../../utils/R";

const value = defineModel('value')

const isShow = ref(false)
const show = () => {
  isShow.value = true
}
defineExpose({
  show
})

const defaultForm = {
  id: null,
  domain: null,
  protocol: 'HTTP',
  cert: null,
  key: null,
}
const form = ref(structuredClone(defaultForm))
const formRef = ref()
const rules = {
  domain: [
    {required: true, message: '请输入域名', trigger: 'blur'},
  ],
  protocol: [
    {required: true, message: '请选择协议', trigger: 'change'},
  ],
}

const save = () => {
  formRef.value.validate().then((ok: boolean) => {
    if (!ok) {
      return
    }
    let api: string;
    if (value.value) {
      api = '/api/domain/update'
    } else {
      api = '/api/domain/add'
    }
    R.postJson(api, {
      id: value.value?.id,
      domain: form.value.domain,
      protocol: form.value.protocol,
      cert: form.value.cert,
      key: form.value.key,
      remark: form.value.remark,
    }).then(res => {
      if (res.code === 0) {
        isShow.value = false
      }
    })
  })
}

watch(value, (newVal: any) => {
  if (!newVal) {
    form.value = structuredClone(defaultForm)
    return
  }
  form.value = {...defaultForm, ...newVal}
  if (newVal.cert_key) {
    form.value.key = newVal.cert_key
  }
})

const reset = () => {
  form.value = structuredClone(defaultForm)
  value.value = null
}
</script>

<template>
  <el-drawer v-model="isShow" :title="value ? '修改域名' : '添加域名'" size="500" destroy-on-close @closed="reset">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top" require-asterisk-position="right">
      <el-form-item label="域名" prop="domain">
        <el-input v-model="form.domain" placeholder="填写域名，例如：example.com" maxlength="200"
                  show-word-limit :disabled="!!value"></el-input>
      </el-form-item>
      <el-form-item label="协议" prop="protocol">
        <el-radio-group v-model="form.protocol">
          <el-radio label="HTTP">HTTP</el-radio>
          <el-radio label="HTTPS">HTTPS</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="TLS证书" prop="cert" v-if="form.protocol === 'HTTPS'">
        <el-input v-model="form.cert" type="textarea" :rows="6"
                  placeholder="填写PEM格式的证书内容"></el-input>
      </el-form-item>
      <el-form-item label="TLS私钥" prop="key" v-if="form.protocol === 'HTTPS'">
        <el-input v-model="form.key" type="textarea" :rows="6"
                  placeholder="填写PEM格式的私钥内容"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="isShow = false">取消</el-button>
      <el-button type="primary" @click="save">保存</el-button>
    </template>
  </el-drawer>
</template>

<style scoped lang="scss">
:deep(.el-form-item__label) {
  width: 100%;
  padding-right: 0;
}

:deep(.el-form-item__error--inline) {
  margin-left: 0;
}
</style>
