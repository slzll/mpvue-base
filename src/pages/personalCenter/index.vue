<template>
  <div id="app_index">
    <div class="container">
      <div class="header">
        <swiper class="swiper-container" :indicator-dots="indicatorDots"
                :autoplay="autoplay" :interval="interval" :duration="duration">
          <div v-for="(item,index) in swiperData" :key="index">
            <swiper-item>
              <img :src="item.Icon" class="slide-image"/>
            </swiper-item>
          </div>
        </swiper>
      </div>
      <div class="scroll-view-container">
        <scroll-view class="icons_list_container" scroll-x="true">
          <div class="icons_list">
            <div class="icons_list_item">
              <a class="icons_list_item_link" href="pages/myCourse.html">
                <img class="icons_list_item_img" src="/static/images/my_course.png" alt="">
                <p class="icons_list_item_title">我的课程</p>
              </a>
            </div>
            <div class="icons_list_item">
              <a class="icons_list_item_link" href="pages/notice.html">
                <img class="icons_list_item_img" src="/static/images/notice_ico.png" alt="">
                <p class="icons_list_item_title">三会一课</p>
              </a>
            </div>
            <div class="icons_list_item">
              <a class="icons_list_item_link" href="pages/newsCenter.html">
                <img class="icons_list_item_img" src="/static/images/news_ico.png" alt="">
                <p class="icons_list_item_title">资讯中心</p>
              </a>
            </div>
            <div class="icons_list_item">
              <a class="icons_list_item_link" href="pages/rankList.html">
                <img class="icons_list_item_img" src="/static/images/rank_ico.png" alt="">
                <p class="icons_list_item_title">排行榜</p>
              </a>
            </div>
            <div class="icons_list_item">
              <a class="icons_list_item_link" href="pages/classGarden.html">
                <img class="icons_list_item_img" src="/static/images/class_ico.png" alt="">
                <p class="icons_list_item_title">班级园地</p>
              </a>
            </div>
            <div class="icons_list_item">
              <a class="icons_list_item_link" href="pages/ebookList.html">
                <img class="icons_list_item_img" src="/static/images/ebook_ico.png" alt="">
                <p class="icons_list_item_title">电子书</p>
              </a>
            </div>
            <div class="icons_list_item">
              <a class="icons_list_item_link" href="pages/communication.html">
                <img class="icons_list_item_img" src="/static/images/communication_ico.png" alt="">
                <p class="icons_list_item_title">交流评论</p>
              </a>
            </div>
          </div>
        </scroll-view>
      </div>
      <div class="boundary"></div>
      <div class="recommend_course">
        <div class="common_title">
          <img class="common_title_icon" src="/static/images/red_ico.png" alt="">
          <span>课程推荐</span>
        </div>
        <div class="recommend_course_list">
          <ul class="clearfix">
            <li v-for="item in courseList" :key="item.CourseId"
                @click="chooseCourse(item.CourseId,item.CourseType,item.OnlineUrl)">
              <a href="javascript:;">
                <img class="recommend_course_img" :src="domain+item.CourseImg" alt=""
                     onerror="this.src='/static/images/newlyCourse.png'">
                <h4>{{item.CourseName}}</h4>
                <span class="name">讲师：{{item.TeacherName}}</span>
                <span class="credit red">{{item.Credit}}学分</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { GetLink, Login, GetCourseInfoList } from '@/utils/api'

  export default {
    data () {
      return {
        userInfo: {},
        canIUse: mpvue.canIUse('button.open-type.getUserInfo'),
        courseList: [],
        domain: 'http://test10.jy365.net',
        swiperData: [],
        indicatorDots: true,
        autoplay: true,
        interval: 5000,
        duration: 1000,
        username: 'zll',
        password: '123456',
        code: ''
      }
    },
    methods: {
      async login () {
        let res = await Login({
          Code: this.code,
          Account: this.username,
          Password: this.password,
          Mac: this.username
        })
        console.log(res)
      },
      getUserInfo () {
        // 调用登录接口
        wx.login({
          success: () => {
            wx.getUserInfo({
              success: res => {
                this.userInfo = res.userInfo
                console.log(this.userInfo)
              }
            })
          }
        })
      },
      async getSwipeLink () {
        console.log('获取轮播链接')
        try {
          let res = await GetLink({ page: 1, rows: 10 })
          this.swiperData = res.Data
        } catch (e) {
          console.log(e)
        }
      },
      async getCourseList () {
        let res = await GetCourseInfoList()
        this.courseList = res.Data.List
      }
    },

    created () {
    },
    mounted () {
    },
    onLoad () {
      this.login()
      this.getSwipeLink()
      this.getCourseList()
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../styles/mixins";

  .header {
    width: 100%;

    .swiper-container {
      width: 100%;
      height: toRpx(180px);

      .slide-image {
        width: 100%;
        height: 100%;
      }
    }
  }

  .scroll-view-container {
    width: 100%;

    .icons_list_container {
      width: 100%;
      padding-top: toRpx(20px);

      .icons_list {
        @include flex();
        width: 100%;
        white-space: nowrap;

        .icons_list_item {
          .icons_list_item_link {
            @include wh(75px, 81px);
            text-align: center;
          }

          .icons_list_item_img {
            width: toRpx(42px);
            height: toRpx(41.5px);
          }

          .icons_list_item_title {
            font-size: toRpx(14px);
          }
        }
      }
    }
  }

  .boundary {
    width: 100%;
    height: toRpx(10px);
    background: $bg-color;
  }

  .recommend_course {
    /*margin-bottom: toRpx(50px);*/
    padding: toRpx(15px);
    width: 100%;

    .recommend_course_list {
      ul {
        @extend %clearFix;

        li {
          float: left;
          width: 50%;

          &:nth-child(odd) {
            padding-top: toRpx(15px);
            padding-right: toRpx(10px);
          }

          &:nth-child(even) {
            padding-top: toRpx(15px);
            padding-left: toRpx(10px);
          }

          a {
            width: 100%;

            .recommend_course_img {
              width: 100%;
              height: toRpx(89px);
            }

            h4 {
              font-size: toRpx(14px);
              line-height: 2;
              @extend %ellipsis;
            }

            span {
              font-size: toRpx(12px);
              line-height: 1.5;

              &.name {
                float: left;
              }

              &.credit {
                float: right;
              }
            }
          }
        }
      }
    }
  }
</style>
