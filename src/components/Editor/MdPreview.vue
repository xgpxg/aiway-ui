<template>
  <div class="md-preview" v-html="html"></div>
</template>

<script setup>
import {computed} from 'vue';
import MarkdownIt from 'markdown-it';

const props = defineProps({
  value: String
});

const md = new MarkdownIt({
  html: true,
  linkify: true,
  breaks: true
});

const html = computed(() => props.value ? md.render(props.value) : '');
</script>

<style scoped lang="scss">
.md-preview {
  overflow-y: auto;
  padding: 12px 16px;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  font-size: 14px;
  line-height: 1.6;
  word-break: break-word;

  :deep(h1), :deep(h2), :deep(h3), :deep(h4), :deep(h5), :deep(h6) {
    margin-top: 16px;
    margin-bottom: 8px;
    font-weight: 600;
  }

  :deep(h1) { font-size: 1.6em; }
  :deep(h2) { font-size: 1.4em; }
  :deep(h3) { font-size: 1.2em; }

  :deep(p) {
    margin: 8px 0;
  }

  :deep(code) {
    background: var(--el-fill-color);
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 0.9em;
  }

  :deep(pre) {
    background: var(--el-fill-color);
    padding: 12px;
    border-radius: 4px;
    overflow-x: auto;

    code {
      background: none;
      padding: 0;
    }
  }

  :deep(a) {
    color: var(--el-color-primary);
  }

  :deep(blockquote) {
    border-left: 4px solid var(--el-border-color);
    padding-left: 12px;
    margin: 8px 0;
    color: var(--el-text-color-secondary);
  }

  :deep(table) {
    border-collapse: collapse;
    width: 100%;
    margin: 8px 0;

    th, td {
      border: 1px solid var(--el-border-color);
      padding: 6px 12px;
      text-align: left;
    }

    th {
      background: var(--el-fill-color);
      font-weight: 600;
    }
  }

  :deep(ul), :deep(ol) {
    padding-left: 24px;
    margin: 8px 0;
  }

  :deep(img) {
    max-width: 100%;
  }
}
</style>
