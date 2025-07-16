<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { CDN_ESM_HTML_TO_IMAGE } from '@/common/const'
import { loadScript } from '@/common/utils'

interface Props {
  incomeDataList: any[]
  excludeFields?: string[]
  fieldTranslations?: Record<string, string>
}

const props = withDefaults(defineProps<Props>(), {
  excludeFields: () => [],
  fieldTranslations: () => ({}),
})

const headers = ref<string[]>([])
const rows = ref<Record<string, any>[]>([])
const isShowToast = ref(false)

// 解析 JSON 数据，获取表头和行数据
function parseJsonData() {
  if (!props.incomeDataList.length) return

  // 获取第一个数据项的所有字段，并过滤掉不需要的字段
  const allFields = Object.keys(props.incomeDataList[0]).filter(
    (field) => !props.excludeFields.includes(field),
  )

  // 使用翻译后的字段名作为表头
  headers.value = allFields.map(
    (field) => props.fieldTranslations[field] || field,
  )

  // 处理行数据
  rows.value = props.incomeDataList.map((item) => {
    return allFields.reduce(
      (res, field) => {
        res[field] = item[field] ?? '-'
        return res
      },
      {} as Record<string, any>,
    )
  })
}

// 导出表格为图片
async function exportImage() {
  const table = document.querySelector('table')

  if (!window.htmlToImage) await loadScript(CDN_ESM_HTML_TO_IMAGE)

  const dataUrl = await htmlToImage.toPng(table)

  const link = document.createElement('a')
  link.href = dataUrl
  link.download = `${props.incomeDataList[0].time}-${props.incomeDataList[props.incomeDataList.length - 1].time}.png`

  link.click()
}

// 导出表格为 Markdown
function exportMarkdown() {
  let markdown = `| ${headers.value.join(' | ')} |\n`
  markdown += `| ${headers.value.map(() => '---').join(' | ')} |\n`

  rows.value.forEach((row) => {
    const values = Object.values(row).map((value) => {
      if (typeof value === 'number') return value.toLocaleString()

      return value
    })
    markdown += `| ${values.join(' | ')} |\n`
  })
  // 复制
  navigator.clipboard.writeText(markdown)
  isShowToast.value = true
  setTimeout(() => {
    isShowToast.value = false
  }, 2000)
}

onMounted(() => {
  parseJsonData()
})
</script>

<template>
  <div class="flex justify-end">
    <button class="btn btn-sm mr-2" @click="exportMarkdown">
      复制md
    </button>
    <button class="btn btn-sm btn-primary mr-2" @click="exportImage">
      下载图片
    </button>
  </div>
  <div class="overflow-x-auto mb-4">
    <table class="table bg-base-100">
      <thead>
        <tr>
          <th v-for="(header, index) in headers" :key="index" class="border-solid border-slate-700">
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in rows" :key="index">
          <td v-for="(value, key) in row" :key="key" class="border-solid border-slate-700 px-2 text-center">
            {{ typeof value === 'number' ? value.toLocaleString() : value }}
          </td>
        </tr>
      </tbody>
      <!-- foot -->
      <tfoot>
        <tr>
          <th v-for="(header, index) in headers" :key="index" class="border-solid border-slate-700">
            {{ header }}
          </th>
        </tr>
      </tfoot>
    </table>
  </div>
  <div v-show="isShowToast" class="toast toast-center">
    <div class="alert alert-success">
      <span>✨ 复制成功</span>
    </div>
  </div>
</template>
