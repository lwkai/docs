
## 覆盖饿了么组件的样式

如果在某个位置要覆盖框架中的样式，如果 deep 都不能生效时，可以用样式模块的方式处理

比如，下面要覆盖 dialog 弹出对话框中的样式: el-dialog__body 需要进行局部覆盖。



```html
<template>
  <el-dialog
      class="el-dialog-full"
      :class="$style.test0001"  <!-- 主要这里引用 test0001 -->
      title="选择模板"
      v-model="dialogVisible"
      top="10px"
      width="90%"
      destroy-on-close
      @closed="isEmpty = false"
    > 
    ...
</template>
<style module lang="scss">
.test0001 { // 在这里定义这个样式
  :global { // 注意必须加上这个
    .el-dialog__body { // 下级需要覆盖的样式名称
      overflow: hidden !important;
    }
  }
}
</style>
```