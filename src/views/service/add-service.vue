<script setup lang="ts">
import {ref, watch} from "vue";
import {R} from "../../utils/R";
import HelpTip from "../../components/Tip/HelpTip.vue";

const value = defineModel('value')

const isShow = ref(false)
const show = () => {
  isShow.value = true
}
defineExpose({
  show
})

const defaultForm = {
  name: null,
  description: null,
  nodes: [null],
  lb: 'random',
}
const form = ref({
  ...defaultForm
})
const formRef = ref()
const rules = {
  name: [
    {required: true, message: '请输入名称', trigger: 'blur'},
  ],
  description: [
    {required: true, message: '请输入描述', trigger: 'blur'},
  ],
  service_group: [
    {required: true, message: '请选择关联服务', trigger: 'blur'}
  ],
  nodes: [
    {required: true, message: '请填写节点', trigger: 'blur'}
  ]
}

const save = () => {
  formRef.value.validate().then((ok: boolean) => {
    if (!ok) {
      return
    }
    let api: string;
    if (value.value) {
      api = '/api/service/update'
    } else {
      api = '/api/service/add'
    }
    R.postJson(api, form.value).then(res => {
      if (res.code === 0) {
        isShow.value = false
      }
    })
  })
}

watch(value, (newVal: any) => {
  if (!newVal) {
    form.value = defaultForm
    return
  }
  form.value = {...defaultForm, ...newVal}
})

const reset = () => {
  form.value = defaultForm
}
</script>

<template>
  <el-drawer title="添加服务" v-model="isShow" size="500" destroy-on-close @closed="reset">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top" require-asterisk-position="right">
      <el-form-item label="服务名称" prop="name">
        <el-input v-model="form.name" placeholder="填写服务名称，建议使用英文名称" maxlength="100"
                  show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="服务描述" prop="description">
        <el-input v-model="form.description" placeholder="填写服务描述" maxlength="500" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="节点地址" prop="nodes">
        <template #label>
          节点地址
          <div class="fr">
            <el-button @click="form.nodes.push(null)" link icon="plus"></el-button>
          </div>
        </template>
        <div v-for="(node,index) in form.nodes" class="fill-width mb10 flex">
          <el-form-item class="fill-width flex" :rules="{required:true,message:'请填写节点地址'}"
                        :prop="'nodes.'+index" inline-message>
            <el-input v-model="form.nodes[index]" placeholder="填写服务节点地址，点击右上角 + 按钮添加新节点">
              <template #suffix>
                <el-button @click="form.nodes.splice(index,1)" link icon="minus" class="ml10"
                           v-if="form.nodes.length>1"></el-button>
              </template>
            </el-input>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item label="负载策略" prop="lb">
        <el-radio-group v-model="form.lb">
          <el-radio label="random">随机</el-radio>
          <el-radio label="random_robin">轮询</el-radio>
        </el-radio-group>
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