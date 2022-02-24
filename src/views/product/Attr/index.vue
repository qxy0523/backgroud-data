<template>
  <div>
    <el-card>
      <template>
        <CategorySelector></CategorySelector>
      </template>
    </el-card>
    <el-card style="margin-top: 20px">
      <template>
        <div>
          <el-button type="primary" icon="el-icon-plus">添加属性</el-button>
          <el-table style="width: 100%" border>
            <el-table-column prop="" label="序号" width="80" type="index" align="center">
            </el-table-column>
            <el-table-column prop="" label="属性名称" width="100">
            </el-table-column>
            <el-table-column prop="" label="属性值列表" width="width">
            </el-table-column>
            <el-table-column prop="" label="操作" width="100">
            </el-table-column>
          </el-table>
        </div>
      </template>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Attr",
  data() {
    return {
      //获取一级列表数据
      getCategory1List: [],
      getCategory2List: [],
      getCategory3List: [],
      cFrom: {
        //获取选择好的id
        getCategory1Id: "",
        getCategory2Id: "",
        getCategory3Id: "",
      },
    };
  },
};
</script>

<style lang="less" scoped>
</style>