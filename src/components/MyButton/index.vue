<template>
<a href="javascript:;" :title="title">
    <el-button v-on="$listeners" v-bind="$attrs"></el-button>
</a>
</template>

<script>
export default {
    name:"MyButton",
    props:["title"]
}
</script>

<style lang="less" scoped>

</style>