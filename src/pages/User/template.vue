<template>
  <div id="user">
    <section class="user-info">
      <img :src="user.avatar" :alt="user.username" class="avatar" />
      <h3>{{ user.username }}</h3>
    </section>
    <section>
      <router-link
        class="item"
        v-for="blog in this.blogs"
        :key="blog.id"
        :to="`/detail/${blog.id}`"
      >
        <div class="date">
          <span class="day">{{ splitDate(blog.createdAt).date }}</span>
          <span class="month">{{ splitDate(blog.createdAt).month }}月</span>
          <span class="year">{{ splitDate(blog.createdAt).year }}</span>
        </div>
        <h3>{{ blog.title }}</h3>
        <p>{{ blog.description }}</p>
      </router-link>
    </section>
    <section class="pagination">
      <el-pagination
        layout="prev, pager, next"
        :total="total/2"
        :current-page="page"
        @current-change="onPageChange"
      >
      </el-pagination>
    </section>
  </div>
</template>

<script>
  import blog from '@/api/blog.js'

  export default {
    data () {
      return {
        blogs: [], // 博客文章的信息
        user: {}, // 用户的信息保存
        page: 1, // 分页数
        total: 0 // 一共有多少文章
      }
    },
    created() {
      this.userId = this.$route.params.userId;
      this.page = this.$route.query.page || 1;
      blog.getBlogsByUserId(this.userId, { page: this.page }).then(res => {
        console.log(`user返回的res@@@`, res);
        this.page = res.page;
        this.total = res.total;
        this.blogs = res.data;
        if (res.data.length > 0) {
          this.user = res.data[0].user;
        }
      });
    },
    methods: {
      splitDate(dateStr) {
        let dateObj = typeof dateStr === "object" ? dateStr : new Date(dateStr);
        return {
          date: dateObj.getDate(),
          month: dateObj.getMonth() + 1, // 加一位才是真正月份
          year: dateObj.getFullYear() // 注意是getFullYear
        };
      },
      onPageChange(newPage) {
        blog.getBlogsByUserId(this.userId, { page: newPage }).then(res => {
          this.blogs = res.data;
          this.total = res.total;
          this.page = res.page;
          // 进入Index页面，查询参数变成当前所在页
          this.$router.push({
            path: `/user/${this.userId}`,
            query: { page: newPage }
          });
        });
      }
    }


  }
</script>

<style lang="less" scoped>
 @import "../../assets/base.less";

  .user-info {
    display: grid;
    grid: auto auto/ 80px 1fr;
    margin-top: 30px;
    padding-bottom: 30px;
    border-bottom: 1px solid #ebebeb;
    h3 {
      grid-column: 2 / 3;
      grid-row: 1 / 2;
      margin-top: 10px;
    }
    img {
      grid-column: 1/2;
      grid-row: 1 / span 2;
      width: 60px;
      height: 60px;
      border-radius: 50%;
    }
  }
  .item {
    width: 800px;
    display: grid;
    // grid: auto auto auto / 80px 1fr;
    margin: 20px 0;
    grid-template-rows: auto auto auto;
    grid-template-columns: 80px 1fr;
    .date {
      grid-column: 1/2;
      grid-row: 1 / span 3;
      justify-self: center;
      text-align: center;
    }
    span {
      display: block;
      margin-top: 5px;
      color: #3f463c85;
    }
    .day {
      font-size: 40px;
    }
    h3 {
      grid-column: 2/3;
      grid-row: 1/2;
    }
    p {
      grid-column: 2/3;
      grid-row: 2/3;
      margin-top: 7px;
    }
    .actions {
      grid-column: 2;
      grid-row: 3;
      font-size: 12px;
    }
  }
</style>
