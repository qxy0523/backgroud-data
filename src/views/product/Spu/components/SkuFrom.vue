<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      <span>{{ spu.spuName }}</span>
    </el-form-item>
    <el-form-item label="SKU名称">
      <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input
        placeholder="价格(元)"
        v-model="skuInfo.price"
        type="number"
      ></el-input>
    </el-form-item>
    <el-form-item label="重量(千克)">
      <!-- v-model="model" -->
      <el-input
        placeholder="重量(千克)"
        v-model="skuInfo.weight"
        type="number"
      ></el-input>
    </el-form-item>
    <el-form-item label="规格描述">
      <el-input
        placeholder="规格描述"
        type="textarea"
        rows="4"
        v-model="skuInfo.skuDesc"
      ></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form label-width="80px" :inline="true">
        <el-form-item
          :label="attr.attrName"
          v-for="attr in attrInfoList"
          :key="attr.id"
        >
          <!-- v-model="model" -->
          <el-select v-model="attr.attrIdAndattrValueId" placeholder="请选择">
            <!-- 收集被选中框的id和被选中值的id -->
            <el-option
              :label="attrValue.valueName"
              :value="`${attr.id}:${attrValue.id}`"
              v-for="(attrValue, index) in attr.attrValueList"
              :key="attrValue.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form label-width="80px" :inline="true">
        <el-form-item
          :label="spuSaleAttr.saleAttrName"
          v-for="spuSaleAttr in spuSaleAttrList"
          :key="spuSaleAttr.id"
        >
          <el-select
            v-model="spuSaleAttr.spuSaleAttrIdValueId"
            placeholder="请选择"
          >
            <el-option
              :label="spuSaleAttrValue.saleAttrValueName"
              :value="`${spuSaleAttr.id}:${spuSaleAttrValue.id}`"
              v-for="spuSaleAttrValue in spuSaleAttr.spuSaleAttrValueList"
              :key="spuSaleAttrValue.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片列表">
      <!-- @selection-change="handleSelectionChange" -->
      <el-table
        style="width: 100%"
        border
        :data="spuImageList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="图片" width="width">
          <template v-slot="{ row, $index }">
            <img :src="row.imgUrl" alt="" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column prop="imgName" label="名称" width="width">
        </el-table-column>
        <el-table-column label="操作" width="width">
          <template v-slot="{ row, $index }">
            <el-button
              type="primary"
              size="mini"
              @click="changeIsDefault(spuImageList, row)"
              v-if="row.isDefault === '0'"
              >设为默认</el-button
            >
            <el-tag type="success" v-else>默认</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="saveSku">保存</el-button>
      <el-button @click="changeAddSKU">取消</el-button>
    </el-form-item>
  </el-form>
</template>
</template>
<script>
export default {
  name: "SkuFrom",
  data() {
    return {
      attrInfoList: [], //平台属性列表
      spuSaleAttrList: [], //销售属性
      spuImageList: [],
      //收集被选中的图片列表
      spuImageListCheck: [],
      spu: {}, //当前spu的信息

      //保存请求收集数据
      skuInfo: {
        //直接输入获取到的
        price: "",
        skuName: "",
        weight: "",
        skuDesc: "",
        skuDefaultImg: "",

        //父组件传递过来的
        category3Id: "",
        spuId: 0,
        tmId: 0, //品牌id

        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   attrName: "string",
          //   id: 0,
          //   skuId: 0,
          //   valueId: 0,
          //   valueName: "string",
          // },
        ],
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   skuId: 0,
          //   spuImgId: 0,
          // },
        ],
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: "string",
          //   saleAttrValueId: 0,
          //   saleAttrValueName: "string",
          //   skuId: 0,
          //   spuId: 0,
          // },
        ],
      },
    };
  },
  methods: {
    async getInitAddSkuFormData(row, category1Id, category2Id) {
      //  spu
      this.spu = row;
      // category1Id, category2Id, category3Id spuId
      //  http://localhost:9530/dev-api/admin/product/attrInfoList/2/14/63
      // 请求平台属性列表
      const re1 = this.$api.attrs.attrInfoList(
        category1Id,
        category2Id,
        row.category3Id
      );

      //  http://localhost:9530/dev-api/admin/product/spuSaleAttrList/6734
      const re2 = this.$api.sku.getSpuSaleAttrList(row.id);

      //  http://localhost:9530/dev-api/admin/product/spuImageList/6734
      const re3 = this.$api.sku.getSpuImageList(row.id);
      //Promise.all{[]},返回的是一个新的promise对象
      const result = await Promise.all([re1, re2, re3]);
      this.attrInfoList = result[0].data;
      this.spuSaleAttrList = result[1].data;
      const spuImageList = result[2].data;

      //spuImageList里面没有isDefault，给每一个图片对象添加一个
      spuImageList.forEach((item) => {
        item.isDefault = "0";
      });
      this.spuImageList = spuImageList;
    },
    //点击取消跳转页面
    changeAddSKU() {
      this.$emit("addSkuChange", false);
    },
    //选择图片
    handleSelectionChange(value) {
      this.spuImageListCheck = value;
    },
    //修改设置默认,先遍历说有的spuImageList，添加isDefault，再排他
    changeIsDefault(spuImageList, row) {
      //排他思想
      spuImageList.forEach((item) => {
        item.isDefault = "0";
      });
      row.isDefault = "1";
      // 收集默认图片的路径
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    //点击保存按钮，发送请求
    async saveSku() {
      //1.获取数据
      const { skuInfo, attrInfoList, spuSaleAttrList, spuImageListCheck, spu } =
        this;
      //2.整理数据
      //父组件传递过来的
      skuInfo.category3Id = spu.category3Id;
      skuInfo.spuId = spu.spuId;
      skuInfo.tmId = spu.tmId; //品牌id
      // skuAttrValueList:平台属性列表
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
        if (item.attrIdAndattrValueId) {
          let [attrId, valueId] = item.attrIdAndattrValueId.split(":");
          prev.push({ attrId, valueId });
        }
        return prev;
      }, []);
      //skuSaleAttrValueList:销售属性
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.spuSaleAttrIdValueId) {
          let [saleAttrId, saleAttrValueId] =item.spuSaleAttrIdValueId.split(":");
          prev.push({ saleAttrId, saleAttrValueId });
        }
        return prev;
      }, []);
      //图片
       //被选中的
      // id: （…）
      // imgName: （…）
      // imgUrl: （…）
      // spuId: （…）
        //我们要的
          //  imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   spuImgId: 0,
      skuInfo.skuImageList=spuImageListCheck.map((item)=>{
        return{
          imgName:item.imgName,
          imgUrl:item.imgUrl,
          isDefault:item.isDefault,
          spuImgId:item.id
        }
      })
      //3.发送请求
      try{
        const re=await this.$api.sku.addUpdate(skuInfo)
        if(re.code===20000||re.code===200){
          this.$message.success("保存成功")
          //跳转页面
          this.$emit("addSkuChange", false);

        }else{
        this.$message.error("保存失败")
        }
      }catch(error){
        this.$message.error("请求保存失败")
      }
     
      //4.成功干嘛
      //5.失败干嘛
    },
  },
};
</script>

<style lang="less" scoped>
</style>