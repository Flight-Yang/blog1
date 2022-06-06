<template>
  <div id="edit">
    <h1>创建文章</h1>
    <h3>文章标题</h3>
    <el-input v-model="title"></el-input>
    <p class="msg">限30个字</p>
    <h3>内容简介</h3>
    <el-input type="textarea" v-model="description" :autosize="{ minRows: 2, maxRows: 6}"></el-input>
    <p class="msg">限30个字</p>
    <h3>文章内容</h3>
    <el-input type="textarea" v-model="content" :autosize="{ minRows: 4, maxRows: 30}"></el-input>
    <p class="msg">限30个字</p>
    <p>
      <label>是否展示在首页</label>
      <el-switch v-model="atIndex" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
    </p>
    <div class="btnContainer">
      <el-button @click="onCreate">确定</el-button>
    </div>


  </div>
</template>


<script>
  import blog from '@/api/blog.js'

  export default {
    data() {
      return {
        title: '',
        description: '',
        content: '',
        atIndex: false
      }
    },

    methods: {
      onCreate() {
        blog.createBlog({
          title: this.title,
          description: this.description,
          content: this.content,
          atIndex: this.atIndex
        })
          .then(res => {
            this.$message.success(res.msg)
            this.$router.push({path: `/detail/${res.data.id}`})
          })
      }
    }
  }
</script>

<style>
  #edit {
    margin-top: 40px;
  }

  h3 {
    margin-top: 40px;
  }

  p {
    margin-top: 10px;
  }

  .btnContainer {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }

</style>
