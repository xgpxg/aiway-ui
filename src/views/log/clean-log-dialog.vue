<script setup lang="ts">
import {ref, watch} from "vue";
import {R} from "../../utils/R";
import {ElMessage} from "element-plus";
import InfoTip from "../../components/Tip/InfoTip.vue";
import TextTip from "../../components/Tip/TextTip.vue";

const value = defineModel()
const props = defineProps({
  index: {
    type: String,
    required: true
  }
});

const cleanForm = ref({
  start_time: null,
  end_time: null
});

const clean = () => {
  R.postJson('/api/log/delete/' + props.index, {
    start_time: cleanForm.value.start_time,
    end_time: cleanForm.value.end_time,
    index: props.index
  }).then(res => {
    if (res.code === 0) {
      ElMessage.success('清理成功')
      emit('success')
    }
  });
};

const emit = defineEmits(['success'])

</script>

<template>
  <el-dialog v-model="value" title="清理日志" destroy-on-close width="500px">
    <el-form :model="cleanForm" label-width="100px">
      <el-form-item label="开始时间">
        <el-date-picker
            v-model="cleanForm.start_time"
            type="datetime"
            placeholder="选择开始时间"
            value-format="YYYY-MM-DDTHH:mm:ss.SSS"
            style="width: 100%">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间">
        <el-date-picker
            v-model="cleanForm.end_time"
            type="datetime"
            placeholder="选择结束时间"
            value-format="YYYY-MM-DDTHH:mm:ss.SSS"
            style="width: 100%">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-text type="info" size="small">
          当日志量较大时，清理非实时生效，会有1~3秒的延迟。
        </el-text>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="value = false">取消</el-button>
      <el-button type="primary" @click="clean">确认清理</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">

</style>
