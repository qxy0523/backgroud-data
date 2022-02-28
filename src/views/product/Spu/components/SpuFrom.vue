<template>
  <div>
    <el-form label-width="100px">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spuInfo.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="trademarkId">
          <el-option
            :label="trademark.tmName"
            :value="trademark.id"
            v-for="trademark in getTrademarkList"
            :key="trademark.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          placeholder="SPU描述"
          rows="4"
          type="textarea"
          v-model="spuInfo.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <template>
          <!--  :file-list="spuImageList"将图片放入数组里面，自动遍历生成照片 -->
          <!-- :on-remove="handleRemove"移除 -->
          <el-upload
            action="/dev-api/admin/product/fileUpload"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :file-list="spuImageList"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </template>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select
          :placeholder="
            unSelectedSaleAttrList.length
              ? `还有${unSelectedSaleAttrList.length}未选择`
              : '没有啦！！！'
          "
          v-model="saleAttrId"
        >
          <el-option
            :label="saleAttr.name"
            :value="saleAttr.id"
            v-for="saleAttr in unSelectedSaleAttrList"
            :key="saleAttr.id"
          ></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus">添加销售属性</el-button>
        <el-table border style="width: 100%" :data="spuInfo.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="100">
          </el-table-column>
          <el-table-column prop="prop" label="属性名称列表" width="width">
            <template v-slot="{ row, $index }">
              <el-tag
                :key="tag.id"
                v-for="tag in row.spuSaleAttrValueList"
                closable
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <!-- @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm" -->
              <el-input class="input-new-tag" ref="saveTagInput" size="small">
              </el-input>
              <el-button class="button-new-tag" size="small">+添加</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="100">
            <template>
              <MyButton
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></MyButton>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">保存</el-button>
        <el-button @click="cancelChange">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuFrom",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      //获取商品名称列表
      getTrademarkList: [],
      baseSaleAttrList: [],
      //图片列表
      spuImageList: [],
      spuInfo: {},

      trademarkId: "",
      saleAttrId: "",
    };
  },

  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //进入添加页面发送请求
    async getTrademarkLists() {
      const re6 = await this.$api.trademark.getTrademarkList();
      if (re6.code === 20000 || re6.code === 200) {
        this.getTrademarkList = re6.data;
      }
    },
    async baseSaleAttrLists() {
      const re7 = await this.$api.spu.getSaleAttrList();
      if (re7.code === 20000 || re7.code === 200) {
        this.baseSaleAttrList = re7.data;
      }
    },
    //进入修改页面发送请求
    async getImagesAddSkuList(row) {
      /* get (spuId) {
    return request.get(`/admin/product/getSpuById/${spuId}`)
  */
      const re1 = await this.$api.spu.get(row.id);
      if (re1.code === 20000 || re1.code === 200) {
        this.spuInfo = re1.data;
      }
      // 获取指定SPU的id对应的图片列表
      //     getSpuImageList (spuId) {
      //   return request.get(`/admin/product/spuImageList/${spuId}`)
      // },
      const re4 = await this.$api.sku.getSpuImageList(row.id);
      if (re4.code === 20000 || re4.code === 200) {
        let spuImageList = re4.data;
        spuImageList.forEach((item) => {
          item.url = item.imgUrl;
          item.name = item.imgName;
        });
        this.spuImageList = spuImageList;
      }

      const re2 = await this.$api.trademark.getTrademarkList();
      if (re2.code === 20000 || re2.code === 200) {
        this.getTrademarkList = re2.data;
      }
      const re3 = await this.$api.spu.getSaleAttrList();
      if (re3.code === 20000 || re3.code === 200) {
        this.baseSaleAttrList = re3.data;
      }
    },
    cancelChange() {
      this.$emit("addAndEditChange", false);
    },
  },
  computed: {
    unSelectedSaleAttrList() {
      return this.baseSaleAttrList.filter((attr) => {
        return this.spuInfo.spuSaleAttrList.every((item) => {
          return item.saleAttrName !== attr.name;
        });
      });
      // spuInfo.spuSaleAttrList.saleAttrName
    },
  },
};
</script>
<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>