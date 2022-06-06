<template>
  <div id="index">
    <section class="blog-posts">
      <router-link class="item" v-for="blog in blogs " :key="blog.id" :to="`/detail/${blog.id}`">
        <figure class="avatar">
          <img :src="blog.user.avatar" :alt="blog.user.username">
          <figcaption>{{blog.user.username}}</figcaption>
        </figure>
        <h3>{{blog.title}} <span>{{friendlyDate(blog.createdAt) }}</span></h3>
        <p>{{blog.description}}</p>
      </router-link>
    </section>
    <section class="pagination">
      <el-pagination
        layout="prev, pager, next"
        :total="total/2"
        :current-page.sync="page"
        @current-change="onPageChange">
      </el-pagination>
    </section>
  </div>
</template>

<script>
  import blog from '@/api/blog.js'

  export default {
    data() {
      return {
        blogs: [],
        total: 0, //文章总数
        page: 1  //当前页数
      }
    },

    created() {
      this.page = parseInt(this.$route.query.page) || 1;   //这里的$route应该是能访问$router保存下的内容
      blog.getIndexBlogs({page:this.page}).then(res => {  //这里传page是为了保存刷新页面后依旧在原来的页面上
        console.log(res.page)
        this.blogs = res.data;
        this.total = res.total;
        this.page = res.page;
      })
    },

    methods:{
      onPageChange(newPage){
        console.log(newPage)
        blog.getIndexBlogs({page:newPage}).then(res => {  //这里传page是为了保存刷新页面后依旧在原来的页面上
          console.log(res)
          this.blogs = res.data;
          this.total = res.total;
          this.page = res.page;
          this.$router.push({path:'/',query:{page:newPage}})
        }).then(() => {
          // 当点击新的分页后，自动滚动到顶部
          const scrollToTop = () => {
            let sTop =
              document.documentElement.scrollTop || document.body.scrollTop;
            if (sTop > 0) {
              window.requestAnimationFrame(scrollToTop);
              window.scrollTo(0, sTop - sTop / 8);
            }
          };
          scrollToTop();
        });
      }
    }



  }
</script>


<style lang="less">
  @import "../../assets/base.less";

  #index {

    .item {
      display: grid;
      grid: auto auto / 80px 1fr;
      margin: 20px 0;

      .avatar {
        grid-column: 1;
        grid-row: 1 / span 2;
        justify-self: center;
        margin-left: 0;
        text-align: center;

        img {
          width: 60px;
          height: 60px;
          border-radius: 50%;
        }

        figcaption {
          font-size: 12px;
          color: @textLighterColor;
        }
      }

      h3 {
        grid-column: 2;
        grid-row: 1;

        & > span {
          color: @textLighterColor;
          font-size: 12px;
          font-weight: normal;
        }
      }

      p {
        grid-column: 2;
        grid-row: 2;
        margin-top: 0;
      }
    }
  }

  .pagination {
    display: flex;
    justify-content: center;
    margin: 30px 0;
  }

</style>
