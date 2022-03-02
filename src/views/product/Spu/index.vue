<template>
  <div>
    <el-card>
      <template>
        <CategorySelector
          @getCategoryList="getCategoryList"
          :isShowList="isShowList"
        ></CategorySelector>
      </template>
    </el-card>
    <el-card style="margin-top: 20px">
      <template>
        <div v-show="!addAndEdit && !addSKU">
          <el-button type="primary" icon="el-icon-plus" @click="addAndChangeSPU"
            >添加SPU</el-button
          >
          <el-table style="width: 100%" border :data="spuFromLIst">
            <el-table-column type="index" label="序号" width="80">
            </el-table-column>
            <el-table-column prop="spuName" label="SPU名称" width="width">
            </el-table-column>
            <el-table-column prop="description" label="SPU描述" width="width">
            </el-table-column>
            <el-table-column prop="prop" label="操作" width="width">
              <template v-slot="{ row, $index }">
                <MyButton
                  type="success"
                  icon="el-icon-plus"
                  title="添加SKU"
                  size="mini"
                  @click="addSku(row)"
                ></MyButton>
                <MyButton
                  type="warning"
                  icon="el-icon-edit"
                  title="修改SPU"
                  size="mini"
                  style="margin-left: 10px"
                  @click="editAndChangeSPU(row)"
                ></MyButton>
                <MyButton
                  type="info"
                  icon="el-icon-info"
                  title="查看SPU的SKU列表"
                  size="mini"
                  style="margin-left: 10px"
                ></MyButton>
                <el-popconfirm
                  :title="`确定删除${row.spuName}吗？`"
                  @onConfirm="deleteSpu(row)"
                >
                  <MyButton
                    slot="reference"
                    type="danger"
                    icon="el-icon-delete"
                    title="删除SPU"
                    size="mini"
                    style="margin-left: 10px"
                  ></MyButton>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @current-change="getSpuFromLIst"
            @size-change="handleSizeChange"
            style="text-align: center"
            :page-sizes="[3, 6, 9]"
            :current-page="page"
            :page-size="limit"
            :total="total"
            :pager-count="5"
            layout=" prev, pager, next, jumper, ->,sizes, total"
          />
        </div>
        <SpuFrom
          v-show="addAndEdit"
          @addAndEditChange="addAndEditChange"
          ref="spuFrom"
          @saveSpuFromLIst="saveSpuFromLIst"
        ></SpuFrom>
        <SkuFrom v-show="addSKU" ref="skuFrom" @addSkuChange="addSkuChange"></SkuFrom>
      </template>
    </el-card>
  </div>
</template>

<script>
import SkuFrom from "@/views/product/Spu/components/SkuFrom";
import SpuFrom from "@/views/product/Spu/components/SpuFrom";
export default {
  name: "Spu",
  data() {
    return {
      getCategory1Id: "",
      getCategory2Id: "",
      getCategory3Id: "",
      isShowList: true,
      page: 1,
      limit: 3,
      total: 0,
      spuFromLIst: [],

      //控制修改SPU和添加SPU
      addAndEdit: false,
      addSKU: false,
    };
  },
  components: {
    SkuFrom,
    SpuFrom,
  },
  methods: {
    getCategoryList({ CategoryId, level }) {
      if (level === 1) {
        this.getCategory1Id = "";
        this.getCategory2Id = "";
        this.spuFromLIst = [];
        this.getCategory1Id = CategoryId;
      } else if (level === 2) {
        this.getCategory2Id = "";
        this.spuFromLIst = [];
        this.getCategory2Id = CategoryId;
      } else {
        this.getCategory3Id = CategoryId;
        //当点击三级按钮，发送请求
        this.getSpuFromLIst();
      }
    },
    // 发送请求列表信息请求且修改页面页码发送请求
    async getSpuFromLIst(pager = 1) {
      this.page = pager;
      const { page, limit, getCategory3Id } = this;
      try {
        const re = await this.$api.spu.getList(page, limit, getCategory3Id);
        if (re.code === 20000 || re.code === 200) {
          this.total = re.data.total;
          this.spuFromLIst = re.data.records;
        } else {
          this.$message.error("数据获取列表失败");
        }
      } catch (error) {
        this.$message.error("请求数据列表失败");
      }
    },
    //修改分页器展示条数
    handleSizeChange(limit) {
      this.limit = limit;
      this.getCategoryList();
    },
    addAndChangeSPU() {
      this.addAndEdit = !this.addAndEdit;
      this.isShowList = !this.isShowList;

      this.$refs.spuFrom.getTrademarkLists(this.getCategory3Id);
      this.$refs.spuFrom.baseSaleAttrLists(this.getCategory3Id);
    },
    editAndChangeSPU(row) {
      this.addAndEdit = !this.addAndEdit;
      this.isShowList = !this.isShowList;
      //点击修改获取到组件内的方法，在组件内发送请求
      this.$refs.spuFrom.getImagesAddSkuList(row, this.getCategory3Id);
    },
    //分页面点击保存，调用getSpuFromLIst请求，再次请求更新过的列表
    saveSpuFromLIst(skuId) {
      //保存有category3Id，添加是没有category3Id的
      if (skuId) {
        this.getSpuFromLIst(this.page);
      } else {
        this.getSpuFromLIst();
      }
    },
    //点击取消，跳转页面
    addAndEditChange(type) {
      this.addAndEdit = type;
      this.isShowList = !this.isShowList;
    },
    addSkuChange(type){
      this.addSKU=type
    },
    //点击删除SPU
    async deleteSpu(row) {
      const re = await this.$api.spu.remove(row.id);
      if (re.code === 20000 || re.code === 200) {
        this.$message.success("删除成功");
        //删除成功，从新请求列表
        this.getSpuFromLIst();
      } else {
        this.$message.error("删除失败");
      }
    },
    //点击添加sku
    addSku(row) {
      this.addSKU = true;
      //调用skuForm组件的方法，发送请求
      this.$refs.skuFrom.getInitAddSkuFormData(row, this.getCategory1Id, this.getCategory2Id);
      //三级列表禁用
      this.isShowList=false
    },
  },
};
</script>

<style lang="less" scoped>
</style>