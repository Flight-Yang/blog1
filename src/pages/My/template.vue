<template>
  <div id="my">
    <section class="user-info" v-if="user">
      <img :src="user.avatar" :alt="user.username" class="avatar">
      <h3>{{user.username}}</h3>
    </section>
    <section>
      <router-link class="item" v-for="blog in blogs" :key="blog.id"
                   :to="`/detail/${blog.id}`">
        <div class="date">
          <span class="day">{{splitDate(blog.createdAt).date}}</span>
          <span class="month">{{splitDate(blog.createdAt).month}}月</span>
          <span class="year">{{splitDate(blog.createdAt).year}}年</span>
        </div>
        <h3>{{blog.title}}</h3>
        <p>{{blog.description}}</p>
        <div class="actions">
          <router-link :to="`/edit/${blog.id}`">编辑</router-link>&nbsp;
          <a href="#" @click.prevent="onDelete(blog.id)">删除</a>
        </div>
      </router-link>
    </section>
    <section class="pagination">
      <el-pagination
        layout="prev, pager, next"
        :total="total/2"
        :current-page="page"
        @current-change="onPageChange">
      </el-pagination>
    </section>
  </div>
</template>

<script>
  import blog from '@/api/blog'
  import {mapGetters} from 'vuex'

  export default {
    data() {
      return {
        blogs: [],
        page: 1,
        total: 0
      }
    },
    computed: {
      ...mapGetters(['user']),
    },

    created() {
      let userid = localStorage.getItem('userid')
      console.log('我的'+userid)
      this.page = parseInt(this.$route.query.page) || 1
      blog.getBlogsByUserId(userid, {page: this.page}).then(res => {
        this.page = res.page
        this.total = res.total
        this.blogs = res.data
      })
    },


    methods: {
      onPageChange(newPage) {
        blog.getBlogsByUserId(this.user.id, {page: newPage}).then(res => {
          this.blogs = res.data
          this.total = res.total
          this.page = res.page
          this.$router.push({path: "/my", query: {page: newPage}})
        })
      },
      async onDelete(blogId) {
          await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }) .then(async () => {
            await blog.deleteBlog({blogId})
            this.$message.success('删除成功')
            this.blogs = this.blogs.filter(blog => blog.id !== blogId)
          }).catch(() => {})
      },


      splitDate(dataStr) {
        let dateObj = typeof dataStr === 'object' ? dataStr : new Date(dataStr)
        return {
          date: dateObj.getDate(),
          month: dateObj.getMonth() + 1,
          year: dateObj.getFullYear()
        }
      }
    }
  }
</script>

<style lang="less">
  @import "../../assets/base.less";

  #my, #user {
    .user-info {
      display: grid;
      grid: auto auto / 80px 1fr;
      margin-top: 30px;
      padding-bottom: 20px;
      border-bottom: 1px solid #ebebeb;

      .avatar {
        grid-column: 1;
        grid-row: 1 / span 2;
        width: 60px;
        height: 60px;
        border-radius: 50%;
      }

      h3 {
        grid-column: 2;
        grid-row: 1;
        margin-top: 10px;
      }
    }

    .item {
      display: grid;
      grid: auto auto auto / 80px 1fr;
      margin: 20px 0;

      .date {
        grid-column: 1;
        grid-row: 1 / span 3;
        justify-self: center;
        text-align: center;

        span {
          display: block;
          color: @textLighterColor;
        }

        .day {
          font-size: 40px;
        }
      }

      h3 {
        grid-column: 2;
        grid-row: 1;
      }

      p {
        grid-column: 2;
        grid-row: 2;
        margin-top: 0;
        word-wrap: break-word;
        word-break: break-all;
      }

      .actions {
        grid-column: 2;
        grid-row: 3;
        font-size: 12px;

        a {
          color: @themeLighterColor;
        }
      }
    }

    .pagination {
      display: grid;
      justify-items: center;
      margin-bottom: 30px;
    }

    .pagination {
      .el-icon {
        color: rgb(55, 49, 70);

        &:hover {
          color: #0acd0a;
        }
      }

      .el-pager li {
        &.active {
          color: @themeColor;
        }

        &:hover {
          color: #0acd0a;
        }
      }
    }
  }
</style>
