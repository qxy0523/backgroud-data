<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="showAddDialog"
      >添加</el-button
    >
    <el-table :data="trademarkList" border style="width: 100%; margin: 20px 0">
      <el-table-column
        prop="prop"
        label="序号"
        type="index"
        align="center"
        width="80"
      />
      <el-table-column prop="tmName" label="品牌名称" width="width" />
      <!-- :model="tmForm"这个属性写上是为了我们后期做表单验证而写的
      表单验证后期要验证的数据是哪个对象 -->
      <el-table-column label="品牌LOGO" width="width">
        <template v-slot="{ row, $index }">
          <img :src="row.logoUrl" alt="" style="width: 80px; height: 60px" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="width">
        <template v-slot="{ row, $index }">
          <el-button
            type="warning"
            size="mini"
            icon="el-icon-edit"
            @click="showUpdateDialog(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="deleteUpDate(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="text-align: center"
      @current-change="getTrademarkList"
      @size-change="handleSizeChange"
      :page-sizes="[3, 6, 9]"
      :current-page="page"
      :page-size="limit"
      :total="total"
      :pager-count="5"
      layout=" prev, pager, next, jumper, ->,sizes, total"
    />
    <el-dialog
      :title="tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <!-- :model="tmForm"这个属性写上是为了我们后期做表单验证而写的
      表单验证后期要验证的数据是哪个对象 -->
      <el-form style="width: 80%" :model="tmForm">
        <el-form-item label="品牌名称" label-width="100px">
          <el-input v-model="tmForm.tmName" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="品牌LOGO" label-width="100px">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">
              只能上传jpg/png文件，且不超过2M
            </div>
          </el-upload>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "Trademark",
  data() {
    return {
      page: 1,
      limit: 3,
      trademarkList: [],
      total: 0,

      dialogFormVisible: false,

      tmForm: {
        tmName: "",
        logoUrl: "",
      },
    };
  },
  mounted() {
    this.getTrademarkList();
  },
  methods: {
    // 这个函数负责两个作用：1、初始化请求 2、切换页码的回调
    async getTrademarkList(page = 1) {
      this.page = page;
      try {
        const result = await this.$api.trademark.getPageList(
          this.page,
          this.limit
        );
        if (result.code === 20000 || result.code === 200) {
          this.trademarkList = result.data.records;
          this.total = result.data.total;
        } else {
          this.$message.error("获取品牌列表失败");
        }
      } catch (error) {
        this.$message.error("请求获取品牌列表失败");
      }
    },
    //修改每页展示的数据条数
    handleSizeChange(limit) {
      this.limit = limit;
      this.getTrademarkList();
    },
    //点击后显示出添加框
    showAddDialog() {
      this.dialogFormVisible = true;
      this.tmForm = {
        tmName: "",
        logoUrl: "",
      };
    },
    // 点击修改按钮，显示对话框
    showUpdateDialog(row) {
      this.dialogFormVisible = true;
      this.tmForm = { ...row };
      // 拷贝？ 拷贝全称数据拷贝，必须出现新的内存空间
      // 拷贝一般说的都是对象类型
      // 对象类型拷贝：
      // 深浅拷贝说的是对象类型内部的对象数据
      // 如果拷贝后的对象内部的数据地址和原对象内部的数据地址是一样的，叫浅拷贝
      // 反之是深拷贝
    },
    // upload上传相关函数
    // 上传成功的函数
    handleAvatarSuccess(res, file) {
      // 这里面就是我们要收集图片路径的地方
      // console.log(res,file);
      this.tmForm.logoUrl = res.data;
      // 下面其实拿的是图片的本地路径
      // this.imageUrl = URL.createObjectURL(file.raw);
      // console.log(this.imageUrl);
    },
    // 上传之前的函数，限制图片的格式和大小
    beforeAvatarUpload(file) {
      const isJPGOrPNG =
        file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPGOrPNG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPGOrPNG && isLt2M;
    },

    //添加成功或修改成功发送请求
    async addOrUpdate() {
      // 1、获取收集的参数
      let trademark = this.tmForm;
      // 2、整理参数
      // 需要的时候再整理，这里不需要
      // 3、发请求
      try {
        // 4、成功干啥
        const result = await this.$api.trademark.addOrUpdate(trademark);
        if (result.code === 20000 || result.code === 200) {
          this.$message.success(trademark.id ? "修改品牌成功" : "添加品牌成功");
          // 重新获取列表数据
          // 注意：我们现在是分页列表，那么添加成功和修改成功，列表页获取哪页数据是不一样的
          // 修改成功，获取的还是原来那一页的数据
          // 添加成功，获取的是第一页的数据
          this.getTrademarkList(trademark.id ? this.page : 1);
          // 关闭对话框
          this.dialogFormVisible = false;
        } else {
          this.$message.error(trademark.id ? "修改品牌失败" : "添加品牌失败");
        }
      } catch (error) {
        // 5、失败干啥
        this.$message.error(
          trademark.id ? "请求修改品牌失败" : "请求添加品牌失败"
        );
      }
    },

    //点击删除，删除商品
    async deleteUpDate(row) {
      const id=row.id
      try {
        const result = await this.$api.trademark.remove(id);
        if (result.code === 20000 || result.code === 200) {
          this.$message.success("删除成功");
          //删除成功后，重新发送请求，如果当页数据只剩一条删除后，应跳到前一页，否则在本页
          this.getTrademarkList(
            this.trademarkList.length > 1 ? this.page : this.page - 1
          );
        } else {
          this.$message.error("删除失败");
        }
      } catch (error) {
        this.$message.error("删除请求失败");
      }
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
