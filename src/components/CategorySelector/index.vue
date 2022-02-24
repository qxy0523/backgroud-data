<template>
  <div>
    <el-form :inline="true">
      <el-form-item label="一级分类">
        <el-select
          placeholder="请选择"
          v-model="cFrom.getCategory1Id"
          @change="handerCategory1Id"
        >
          <el-option
            :label="item.name"
            :value="item.id"
            v-for="item in getCategory1List"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          placeholder="请选择"
          v-model="cFrom.getCategory2Id"
          @change="handerCategory2Id"
        >
          <el-option
            :label="item.name"
            :value="item.id"
            v-for="item in getCategory2List"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          placeholder="请选择"
          v-model="cFrom.getCategory3Id"
          @change="handerCategory3Id"
        >
          <el-option
            :label="item.name"
            :value="item.id"
            v-for="item in getCategory3List"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "CategorySelector",
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
  mounted() {
    this.getCategory1();
  },
  methods: {
    async getCategory1() {
      try {
        const re = await this.$api.categorylist.getCategory1();
        if ((re.code = 20000 || re.code === 200)) {
          this.getCategory1List = re.data;
        } else {
          this.$message.error("选择列表属性失败");
        }
      } catch (error) {
        this.$message.error("请求列表数据失败");
      }
    },
    async handerCategory1Id(getCategory1Id) {
      // 选中1级分类的时候触发的事件回调，内部我们可以请求2级分类数据
      //在二次选择的时候清空后面两个选择框的数据和id，第一个id不要清除
      this.getCategory2List = [];
      this.getCategory3List = [];

      this.cFrom.getCategory2Id = "";
      this.cFrom.getCategory3Id = "";
      try {
        const re = await this.$api.categorylist.getCategory2(getCategory1Id);
        if ((re.code = 20000 || re.code === 200)) {
          this.getCategory2List = re.data;
        } else {
          this.$message.error("选择列表二属性失败");
        }
      } catch (error) {
        this.$message.error("请求列表数据失败");
      }
    },
    async handerCategory2Id(getCategory2Id) {
      //点击第二个列表清除后一个数据列表和id
      this.getCategory3List = [];
      this.cFrom.getCategory3Id = "";
      try {
        const re = await this.$api.categorylist.getCategory3(getCategory2Id);
        if ((re.code = 20000 || re.code === 200)) {
          this.getCategory3List = re.data;
        } else {
          this.$message.error("选择列表三属性失败");
        }
      } catch (error) {
        this.$message.error("请求列表数据失败");
      }
    },
    handerCategory3Id() {},
  },
};
</script>

<style lang="less" scoped>
</style>