<template>
  <div>
    <el-button type="primary" v-if="hasBtnPermission(btn.Test111.add)"
      >保存</el-button
    >
    <el-button type="danger" v-if="hasBtnPermission(btn.Test111.delete)"
      >删除</el-button
    >
    <el-button type="woring" v-if="hasBtnPermission(btn.Test111.update)"
      >修改</el-button
    >
  </div>
</template>

<script>
import "@/utils/promise";
export default {
  name: "Button2",
};
</script>

<style>
</style>