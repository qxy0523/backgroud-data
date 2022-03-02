<template>
  <div>
    <el-form label-width="100px">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spuInfo.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spuInfo.tmId">
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
        <template v-slot="{ row, $index }">
          <!--  :file-list="spuImageList"将图片放入数组里面，自动遍历生成照片 -->
          <!-- :on-remove="handleRemove"移除 -->
          <el-upload
            action="/dev-api/admin/product/fileUpload"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleAvatarSuccess"
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
          v-model="saleAttrIdName"
        >
          <el-option
            :label="saleAttr.name"
            :value="`${saleAttr.id}:${saleAttr.name}`"
            v-for="saleAttr in unSelectedSaleAttrList"
            :key="saleAttr.id"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addSpuSaleAttrList"
          :disabled="!saleAttrIdName"
          >添加销售属性</el-button
        >
        <el-table border style="width: 100%" :data="spuInfo.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="100">
          </el-table-column>
          <el-table-column prop="prop" label="属性名称列表" width="width">
            <template v-slot="{ row, $index }">
              <el-tag
                :key="tag.id"
                v-for="(tag, index) in row.spuSaleAttrValueList"
                closable
                @close="handleClose(row, index)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <!-- @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm" -->
              <el-input
                v-if="row.isEdit"
                class="input-new-tag"
                ref="saveTagInput"
                size="small"
                v-model="row.saleAttrValueName"
                @keyup.enter.native="handleInputConfirm(row)"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="changeInput(row)"
                >+添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="100">
            <template v-slot="{ row, $index }">
              <MyButton
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="spuInfo.spuSaleAttrList.splice($index, 1)"
              ></MyButton>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
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
      spuInfo: {
        category3Id: "",
        spuName: "",
        description: "",
        tmId: "",
        spuImageList: [
          // {
          //   imgName: "string",
          //   imgUrl: "string",
          // },
        ],
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   saleAttrName: "",
          //   spuSaleAttrValueList: [
          //     // {
          //     //   baseSaleAttrId: 0,
          //     //   saleAttrValueName: "",
          //     // },
          //   ],
          // },
        ],
      },
      category3Id: "",
      //收集销售属性，的id和属性名
      saleAttrIdName: "",
    };
  },

  methods: {
    //删除图片
    handleRemove(file, fileList) {
      // console.log(file, fileList);
      // file被删除的图片信息，删除该图片的图片信息
      this.spuImageList = fileList;
    },
    //图片成功上传
    handleAvatarSuccess(res, file, fileList) {
      // console.log(res, file,fileList);
      this.spuImageList = fileList;
    },
    //放大镜效果
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //进入添加页面发送请求
    async getTrademarkLists(getCategory3Id) {
      console.log(getCategory3Id);
      this.category3Id = getCategory3Id;
      const re6 = await this.$api.trademark.getTrademarkList();
      if (re6.code === 20000 || re6.code === 200) {
        this.getTrademarkList = re6.data;
      }
    },
    async baseSaleAttrLists(getCategory3Id) {
      this.category3Id = getCategory3Id;
      const re7 = await this.$api.spu.getSaleAttrList();
      if (re7.code === 20000 || re7.code === 200) {
        this.baseSaleAttrList = re7.data;
      }
    },
    //进入修改页面发送请求
    async getImagesAddSkuList(row, getCategory3Id) {
      /* get (spuId) {
    return request.get(`/admin/product/getSpuById/${spuId}`)
  */
      this.category3Id = getCategory3Id;
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
    //点击添加列表,添加后那个数据就清除
    addSpuSaleAttrList() {
      let [baseSaleAttrId, saleAttrName] = this.saleAttrIdName.split(":");
      this.spuInfo.spuSaleAttrList.push({
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      });
      //选中后清除
      this.saleAttrIdName = "";
    },
    //添加属性名称列表
    //点击添加变为input框
    changeInput(row) {
      //如果直接设置，isEdit将不会是响应式的，用$set
      this.$set(row, "isEdit", true);
      //输入内容,解决小bug，调用some的时候saleAttrValueName不存在
      this.$set(row, "saleAttrValueName", "");
      //获取焦点，当最新一次DOM更新，获取焦点
      this.$nextTick(() => {
        this.$refs.saveTagInput.focus();
      });
    },
    //失去焦点，或者点enter键的时候，提交
    handleInputConfirm(row) {
      const { baseSaleAttrId, saleAttrValueName } = row;
      //输入的内容不可为空
      if (saleAttrValueName.trim() === "") {
        // this.$message.error("输入的内容不可为空");
        row.saleAttrValueName = "";
        //input框变为button框
        row.isEdit = false;
        return;
      }
      //some遍历，有重复的不可输入
      const re = row.spuSaleAttrValueList.some((item) => {
        return item.saleAttrValueName === saleAttrValueName;
      });
      if (re) {
        this.$message.error("输入的内容不可重复");
        row.saleAttrValueName = "";
        //input框变为button框
        row.isEdit = false;
        return;
      }
      row.spuSaleAttrValueList.push({
        baseSaleAttrId,
        saleAttrValueName,
      });
      //清除输入框内数据
      row.saleAttrValueName = "";
      //并变为button按钮
      row.isEdit = false;
    },
    // 删除属性值
    handleClose(row, index) {
      row.spuSaleAttrValueList.splice(index, 1);
    },
    //点击保存，发送请求
    /*
      1.获取请求参数
      不只是有spuForm 还有 spuImgList  category3Id
      2.整理参数
      3.发请求
      4.成功干嘛
      5.失败干嘛
    */
    async save() {
      //1.获取请求参数
      const { spuInfo, spuImageList, category3Id } = this;
      //2.整理参数
      // category3Id
      spuInfo.category3Id = category3Id;
      //整理图片
      spuInfo.spuImageList = spuImageList.map((item) => {
        //新旧图片都有name，但是旧图片服务器地址在imgUrl上，新图片在response的data上
        return {
          imgName: item.name,
          imgUrl: item.imgUrl || item.response.data,
        };
      });
      //去掉点击的时候多多添加的isEdit和saleAttrValueName
      spuInfo.spuSaleAttrList.forEach((item) => {
        delete item.isEdit;
        delete item.saleAttrValueName;
      });
      //数据整理完毕，发送请求
      try {
        const re = await this.$api.spu.addUpdate(spuInfo);
        if (re.code === 20000 || re.code === 200) {
          this.$message.success("保存成功");
          //保存成功，跳转页面
          this.$emit("addAndEditChange", false);
          //如果是在当前页修改数据，修改完数据应该还在当前页，再次请求数据
          this.$emit("saveSpuFromLIst", spuInfo.id);
          this.resetData();
        } else {
          this.$message.error("保存失败");
        }
      } catch (error) {
        this.$message.error("请求保存失败");
      }
    },
    //无论是添加还是修改，都经过保存，在这个时候清空数据
    resetData() {
      Object.assign(this._data, this.$options.data());
    },
    //点击取消跳转页面
    cancelChange() {
      this.$emit("addAndEditChange", false);
      this.resetData();
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