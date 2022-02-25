<template>
  <div>
    <el-card>
      <template>
        <CategorySelector @getCategoryList="getCategoryList" :isShowList="isShowList"></CategorySelector>
      </template>
    </el-card>
    <el-card style="margin-top: 20px">
      <template v-show="isShowList">
        <div v-show="isShowList">
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="addAndClear"
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
                  @click="deleteAttrForm(row)"
                ></MyButton>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-show="!isShowList">
          <el-form :inline="true" :model="attrForm" :rules="rules">
            <el-form-item label="属性名" prop="attrName">
              <el-input
                placeholder="请输入属性名"
                v-model="attrForm.attrName"
              ></el-input>
            </el-form-item>
          </el-form>
          <el-button
            type="primary"
            icon="el-icon-plus"
            style="margin-righe: 10px"
            @click="addAttribute"
            :disabled="!attrForm.attrName"
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
                <el-input
                  v-model="row.valueName"
                  v-if="row.isShow"
                  @blur="changLook(row)"
                  @keyup.enter.native="changLook(row)"
                  size="mini"
                  placeholder="输入属性值名称"
                  :ref="$index"
                ></el-input>
                <span
                  v-else
                  @click="changeEdit(row, $index)"
                  style="display: block; width: 100%"
                  >{{ row.valueName }}</span
                >
              </template>
            </el-table-column>
            <el-table-column prop="" label="操作" width="width">
              <template v-slot="{ row, $index }">
                <el-popconfirm
                  :title="`你确认要删除${row.valueName}吗？`"
                  @onConfirm="deleteAttrList($index)"
                >
                  <MyButton
                    slot="reference"
                    type="danger"
                    title="删除"
                    icon="el-icon-delete"
                    size="mini"
                  >
                  </MyButton>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
          <el-button type="primary" @click="saveAttrFrom" :disabled="!attrForm.attrValueList.length">保存</el-button>
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
      rules:{
        attrName:[
          { required: true, message: "请输入商品名字", trigger: "blur" },
          { min: 2, max: 5, message: "长度在 2 到 5 个字符", trigger: "change" },
        ],
      }
    };
  },
  mounted() {
    console.log(this);
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
    // 添加属性一次后，再次添加，会把之前的数据保存，再次添加属性的时候，清空上次数据，并将categoryId填入
    addAndClear() {
      this.isShowList = !this.isShowList;
      this.attrForm = {
        attrName: "",
        attrValueList: [],
        categoryId: this.getCategory3Id,
        categoryLevel: 3,
      };
    },

    //点击添加属性值,向attrValueList数组中添加数据，刚开始添加一个空数组，通过input框添加属性值
    addAttribute() {
      this.attrForm.attrValueList.push({
        attrId: this.attrForm.id,
        valueName: "",
        //当添加的时候，属性列表为input框，当修改的时候为span框
        isShow: true,
      });
      // 给最后一个输入框获取焦点
      this.$nextTick(() => {
        this.$refs[this.attrForm.attrValueList.length - 1].focus();
      });
    },
    //点击修改数据
    changeAttrForm(row) {
      this.isShowList = !this.isShowList;
      this.attrForm = cloneDeep(row);

      //点击修改数据，是查看状态，默认为span标签，想让给每个数据添加一个isShow，使用$set响应式
      this.attrForm.attrValueList.forEach((item) => {
        this.$set(item, "isShow", false);
      });
    },
    // 点击保存，保存信息
    async saveAttrFrom() {
      //处理数据
      // 整理参数：
      // 1、属性值名称如果为空串(不输入内容直接保存)，从属性值列表当中去除
      // 2、属性值当中去除isEdit属性
      // 3、属性值列表如果没有属性值，不发请求
      // 4.如果表头为空，不能保存
      this.attrForm.attrValueList = this.attrForm.attrValueList.filter(
        (item) => {
          if (item.valueName !== "") {
            delete item.isShow
            return true;
          }
        }
      );

      if(!this.attrForm.attrValueList.length||!this.attrForm.attrName.trim())return

      try {
        const re = await this.$api.attrs.addOrUpdate(this.attrForm);
        if (re.code === 20000 || re.code === 200) {
          this.$message.success("保存成功");
          //保存成功跳转页面
          this.isShowList = !this.isShowList;
          //删除之后从新获取数据
          this.getAttrInfoList();
        } else {
          this.$message.error("保存失败");
        }
      } catch (error) {
        this.$message.error("保存请求失败");
      }
    },
    // 点击删除数据
    deleteAttrForm(row) {
      this.$confirm(`确认要删除${row.attrName}？`, "确认信息", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确认",
        cancelButtonText: "取消",
      })
        .then(async () => {
          try {
            const re = await this.$api.attrs.remove(row.id);
            if (re.code === 20000 || re.code === 200) {
              this.$message.success("删除成功");
              //删除之后从新获取数据，更新
              this.getAttrInfoList();
            } else {
              this.$message.error("删除失败");
            }
          } catch (error) {
            this.$message.error("删除请求失败");
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "确认取消",
          });
        });
    },
    //当失去焦点的时候，将input框改为span框
    changLook(row) {
      /* 
        input在切换为span之前要判断数据合法性
        1、数据是不是空的
        2、除了自己以外，输入的数据是不是和其它的属性值名称重复
      */
      //如果输入的数据去空格后为空，则清空数据，并返回
      let valueName = row.valueName;
      if (valueName.trim() === "") {
        row.valueName = "";
        return;
      }
      let attrValueList = this.attrForm.attrValueList.some((item) => {
        // 除了自己以外，输入的数据是不是和其它的属性值名称重复
        if (row !== item) {
          return row.valueName === item.valueName;
        }
      });
      if (attrValueList) {
        this.$message.error("该属性值已经存在，请重新输入");
        //提示的同时清空输入内容，并将input框显示出来
        row.valueName = "";
        // row.isShow = true;
        return;
      }
      row.isShow = false;
    },
    //点击span框转到input模式,编辑模式
    changeEdit(row, index) {
      //转为input框
      row.isShow = true;
      // isShow，改变时候获取焦点
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
    //点击删除某个属性名
    deleteAttrList(index) {
      return this.attrForm.attrValueList.splice(index, 1);
    },
  },
};
</script>

<style lang="less" scoped>
</style>