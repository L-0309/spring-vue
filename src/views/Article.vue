<template>
<div>
<!--            搜索区域-->
  <div class="pd-10">
    <el-input style="width: 200px" v-model="name" placeholder="请输入标题" suffix-icon="el-icon-s-promotion"
              clearable></el-input>

    <el-select v-model="userId" clearable placeholder="请选择发布人" @change="getUserId" size="mini">
      <el-option v-for="item in options" :key="item.id" :label="item.nickname" :value="item.id"></el-option>
    </el-select>
    <el-button type="primary" class="ml-5" icon="el-icon-search" @click="search">搜索</el-button>
    <el-button type="warning" class="ml-5" icon="el-icon-refresh" @click="reset">重置</el-button>
  </div>
<!--  操作区域-->
  <div>
    <el-row>
      <el-col :span="2">
        <el-button type="primary" @click="handleAdd">添加<i class="el-icon-circle-plus-outline"></i></el-button>
      </el-col>
      <el-col :span="2">
        <el-popconfirm confirm-button-text='确定' cancel-button-text='取消' icon="el-icon-info" icon-color="red"
                       title="确定批量删除吗？" @confirm="delBatch">
          <el-button slot="reference" type="danger">批量删除 <i class="el-icon-remove-outline"></i></el-button>
        </el-popconfirm>
      </el-col>
    </el-row>
  </div>

  <el-table :data="tableData" @selection-change="handleSelectionChange" border stripe>
    <el-table-column type="selection"></el-table-column>
    <el-table-column prop="id" label="ID" width="50"></el-table-column>
    <el-table-column prop="name" label="标题"></el-table-column>
    <el-table-column label="文章内容">
      <template v-slot="scope">
        <el-button type="primary" @click="view(scope.row.content)">查看内容</el-button>
      </template>
    </el-table-column>
    <el-table-column prop="user.nickname" label="发布人"></el-table-column>
    <el-table-column prop="time" label="发布时间"></el-table-column>
    <el-table-column label="操作">
      <template v-slot="scope">
        <el-button type="primary" @click="handleEdit(scope.row)" size="mini">
          编辑<i class="el-icon-edit-outline"></i>
        </el-button>
        <el-popconfirm
            class="ml-5"
            confirm-button-text='确定'
            cancel-button-text='取消'
            icon="el-icon-info"
            icon-color="red"
            title="确定删除吗？"
            @confirm="handleDelete(scope.row)"
        >
          <el-button slot="reference" type="danger">删除 <i class="el-icon-remove-outline"></i></el-button>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <!--          分页区域-->
  <div style="padding: 10px 0">
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="current"
        :page-sizes="[5, 10, 15, 20, 30]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>
  </div>

  <!--          弹窗-->
  <el-dialog title="文章信息" :visible.sync="dialogFormVisible" width="60%">
    <el-form label-width="90px">
      <el-form-item v-show="idVerify" label="id：">
        <el-input v-model="form.id"  autocomplete="off" readonly></el-input>
      </el-form-item>
      <el-form-item label="标题：">
        <el-input v-model="form.name"  autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="内容：">
        <mavon-editor ref="md" v-model="form.content" :ishljs="true" @imgAdd="imgAdd"></mavon-editor>
      </el-form-item>
      <el-form-item v-if="!idVerify" label="发布人：">
        <el-select v-model="form.userId" placeholder="发布人" size="mini">
          <el-option v-for="item in options" :key="item.id" :label="item.nickname" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发布时间：">
        <el-date-picker
            v-model="form.time"
            value-format="yyyy-MM-DD HH:mm:ss"
            type="datetime"
            placeholder="选择日期时间"
            align="center"
            :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button icon="el-icon-close" type="info" @click="dialogFormVisible = false;idVerify = false">取 消</el-button>
      <el-button icon="el-icon-circle-check" type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>

  <el-dialog title="预览文章" :visible.sync="viewDialogVis" width="60%">
    <el-card>
      <div>
        <mavon-editor
            class="md"
            :value="content"
            :subfield="false"
            :defaultOpen="'preview'"
            :toolbarsFlag="false"
            :editable="false"
            :scrollStyle="true"
            :ishljs="true"
        />
      </div>
    </el-card>
    <div slot="footer" class="dialog-footer">
      <el-button icon="el-icon-close" type="info" @click="viewDialogVis = false">取 消</el-button>
      <el-button icon="el-icon-circle-check" type="primary" @click="viewDialogVis = false">确 定</el-button>
    </div>
  </el-dialog>

</div>
</template>

<script>
import request from "@/utils/request";
import axios from "axios";

export default {
  name: "Picture",
  data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
      },
      idVerify: false,
      dialogFormVisible: false,
      form: {},
      tableData: [],
      //分页数据
      current: 1,
      pageSize: 5,
      total: 0,
      //多删
      multipleSelection: [],
      name: '',
      pictureShow: false,
      options: [],
      userId: '',
      server: this.serverIp,
      content: '',
      viewDialogVis: false
    }
  },
  methods: {
    view(content) {
      this.content = content
      this.viewDialogVis = true
    },
    imgAdd(pos, $file) {
      // 绑定@imgAdd event
      // 第一步.将图片上传到服务器.
      let formdata = new FormData();
      formdata.append('file', $file);
      axios ({
        url: this.server,
        method: 'post',
        data: formdata,
        headers: { 'Content-Type': 'multipart/form-data' },
      }).then((url) => {
        // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
        /**
         * $vm 指为mavonEditor实例，可以通过如下两种方式获取
         * 1. 通过引入对象获取: `import {mavonEditor} from ...` 等方式引入后，`$vm`为`mavonEditor`
         * 2. 通过$refs获取: html声明ref : `<mavon-editor ref=md ></mavon-editor>，`$vm`为 `this.$refs.md`
         */
        this.$refs.md.$img2Url(pos, url.data.data);
      })
    },
    handleEdit(row) {
      this.form = JSON.parse(JSON.stringify(row))
      this.idVerify = true
      this.dialogFormVisible = true
    },
    handleAdd() {
      this.form = {}
      this.dialogFormVisible = true
    },
    save() {
      request.post('article/save', this.form).then(
          res => {
            if (res.code === '200') {
              this.$message.success('操作成功')
              this.dialogFormVisible = false
              this.idVerify = false
              this.load()
            }
          }
      )
    },
    getUserId(userId) {
      this.userId = userId;
      this.load()
    },

    //批量删除
    delBatch() {
      let ids = this.multipleSelection.map(i => i.id);
      if (ids.length > 0) {
        request.post('article/del/batch', ids).then(
            res => {
              if (res.code === '200') {
                this.$message.success('批量删除成功')
                this.load()
              }
              if (res.code === '500' || res.code === '400' || res.code === '0') {
                if (res.code === '0') {
                  this.$message.error(res.msg)
                  return
                }
                this.$message.error(res.msg)
              }
            })
      } else {
        this.$message.info('还没有选择任何信息')
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    //删除
    handleDelete(id) {
      request.delete('article/' + id.id).then(
          res => {
            if (res.code === '200') {
              this.$message.success('删除成功')
              this.load()
            }
            if (res.code === '500' || res.code === '400' || res.code === '0') {
              if (res.code === '0') {
                this.$message.error(res.msg)
                return
              }
              this.$message.error(res.msg)
            }
          }
      )
    },
    reset() {
      this.name = ''
      this.userId = ''
      this.load()
    },
    userNickname() {
      request.get('user/nickname').then(
          res => {
            this.options = res.data
          }
      )
    },
    load() {
      request.get('article/findAll', {
        params:{
          current: this.current, pageSize: this.pageSize,
          name: this.name,userId: this.userId
        }
      }).then(
          res => {
            this.tableData = res.data.records
            this.total = res.data.total
          }
      )
    },
    //搜索
    search() {
      this.load()
    },
    //改变页面大小触发
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.load()
    },
    //改变当前页码触发
    handleCurrentChange(current) {
      this.current = current
      this.load()
    },
  },
  created() {
    this.load()
    this.userNickname();
  }
}
</script>

<style scoped>

</style>