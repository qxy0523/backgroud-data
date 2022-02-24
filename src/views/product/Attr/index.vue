<template>
  <div>
    <el-card>
      <template>
        <CategorySelector @getCategoryList="getCategoryList"></CategorySelector>
      </template>
    </el-card>
    <el-card style="margin-top: 20px">
      <template v-show="isShowList">
        <div v-show="isShowList">
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="isShowList = !isShowList"
            :disabled="!getCategory3Id"
            >添加属性</el-button
          >
          <el-table style="width: 100%" border :data="attrList">
            <el-table-column
              label="序号"
              width="80"
              type="index"
              align="center"
            >
            </el-table-column>
            <el-table-column prop="attrName" label="属性名称" width="150">
            </el-table-column>
            <el-table-column label="属性值列表" width="width">
              <template v-slot="{ row, $index }">
                <el-tag
                  type="success"
                  v-for="item in row.attrValueList"
                  :key="item.id"
                  style="margin-right: 5px"
                  >{{ item.valueName }}</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column prop="" label="操作" width="150">
              <template v-slot="{ row, $index }">
                <MyButton
                  type="warning"
                  title="修改"
                  icon="el-icon-edit"
                  size="mini"
                  style="margin-right: 10px"
                  @click="changeAttrForm(row)"
                ></MyButton>
                <MyButton
                  type="danger"
                  title="删除"
                  icon="el-icon-delete"
                  size="mini"
                ></MyButton>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-show="!isShowList">
          <el-form :inline="true">
            <el-form-item label="属性名">
              <el-input
                placeholder="请输入属性命"
                v-model="attrForm.attrName"
              ></el-input>
            </el-form-item>
          </el-form>
          <el-button
            type="primary"
            icon="el-icon-plus"
            style="margin-righe: 10px"
            @click="addAttribute"
            >添加属性值</el-button
          >
          <el-button @click="isShowList = !isShowList">取消</el-button>
          <el-table
            style="width: 100%; margin: 10px 0px"
            border
            :data="attrForm.attrValueList"
          >
            <el-table-column type="index" label="序号" width="80">
            </el-table-column>
            <el-table-column prop="" label="属性名" width="width">
              <template v-slot="{ row, $index }">
                <el-input v-model="row.valueName"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="" label="操作" width="width">
            </el-table-column>
          </el-table>
          <el-button type="primary">保存</el-button>
          <el-button @click="isShowList = !isShowList">取消</el-button>
        </div>
      </template>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      //搜集三个列表的id，发送请求，获取数据信息
      getCategory1Id: "",
      getCategory2Id: "",
      getCategory3Id: "",
      attrList: [],
      isShowList: true,

      //收集添加或修改的商品数据
      attrForm: {
        attrName: "",
        attrValueList: [
          //  {
          //   attrId: 0,
          //   id: 0,
          //   valueName: "string",
          // },
        ],
        categoryId: "",
        categoryLevel: 3,
      },
    };
  },
  methods: {
    getCategoryList({ CategoryId, level }) {
      if (level === 1) {
        this.getCategory1Id = CategoryId;
      } else if (level === 2) {
        this.getCategory2Id = CategoryId;
      } else {
        this.getCategory3Id = CategoryId;
        //当点击三级按钮，将三个商品选项id传入，获取商品全部信息，进行列表渲染
        this.getAttrInfoList();
      }
    },
    //获取列表数据
    async getAttrInfoList() {
      try {
        const { getCategory1Id, getCategory2Id, getCategory3Id } = this;
        const re = await this.$api.attrs.attrInfoList(
          getCategory1Id,
          getCategory2Id,
          getCategory3Id
        );
        if ((re.code = 20000 || re.code === 200)) {
          this.attrList = re.data;
        } else {
          this.$message.error("获取商品数据失败");
        }
      } catch (error) {
        this.$message.error("请求数据失败");
      }
    },
    //修改bug

    //点击添加属性,向attrValueList数组中添加数据，刚开始添加一个空数组，通过input框添加属性值
    addAttribute() {
      this.attrForm.attrValueList.push({
        attrId: this.attrForm.id,
        valueName: this.valueName,
      });
    },
    //点击修改数据
    changeAttrForm(row) {
     this.isShowList=!this.isShowList
      this.attrForm = cloneDeep(row);
    },
  },
};
</script>

<style lang="less" scoped>
</style>