<template>
  <div id="app_courseCenter">
    <div class="container">
      <button class="toggle_list_btn" @click="toggleLeft()">打开列表</button>
      <i-drawer i-class="drawer_container" mode="left" :visible="showLeft" @close="toggleLeft">
        <scroll-view scroll-y>
          <view class="channel_list_container">
            <ul class="channel_list">
              <li class="channel_list_item" v-for="(item,i) in typeData" :key="item.Id">
                <div class="parent_tree_container">
                  <div class="channel_list_link common_title ellipsis" @click="getCourseInfo(item.Id)">
                    <img class="common_title_icon" src="/static/images/red_ico.png" alt="">
                    <span>{{item.Name}}</span>
                  </div>
                  <div v-if="item.Nodes && item.Nodes.length > 0" @click="item.showNodes = !item.showNodes"
                       class="list_expand">
                    <img v-show="!item.showNodes" src="/static/images/dropdown.png" alt="">
                    <img v-show="item.showNodes" src="/static/images/pullup.png" alt="">
                  </div>
                </div>
                <ul v-show="item.showNodes" class="channel_list">
                  <li class="channel_list_item" v-for="nodeItem in item.Nodes" :key="nodeItem.Id">
                    <div class="ellipsis common_title" @click="getCourseInfo(nodeItem.Id)">
                      <img class="common_title_circle" src="/static/images/red_cicle.png" alt="">
                      <span>{{nodeItem.Name}}</span>
                    </div>
                  </li>
                </ul>
              </li>
            </ul>
          </view>
        </scroll-view>
      </i-drawer>
      <scroll-view class="course_list_container" v-if="!noData"
                   scroll-y="true" lower-threshold="0" @scroll="handleScrollToLower()">
        <a class="course_item" v-for="item in courseData" :key="item.CourseId" href="../pages/index/main">
          <div class="course_item_imgs">
            <img class="course_img" :src="item.CourseImg" alt=""
                 @error="item.CourseImg = errorImgScr">
            <img v-if="item.CourseType=='JYAicc'" class="inner_pic" src="/static/images/jingpin.png" alt="">
            <img v-if="item.CourseType=='Mp4'" class="inner_pic" src="/static/images/MP4.png" alt="">
            <img v-if="item.CourseType=='h5'" class="inner_pic" src="/static/images/H5.png" alt="">
          </div>
          <div class="course_item_content">
            <h4 class="course_name">{{item.CourseName}}</h4>
            <p>
              <span class="course_teacher">讲师：{{item.TeacherName}}</span>
            </p>
            <p style="overflow: hidden;">
              <span class="course_score pull-left red">{{item.Credit}}学分</span>
              <span class="course_select_flag pull-right"
                    :class="item.SelectFlag=='已选'?'choose':''">{{item.SelectFlag}}</span>
            </p>
          </div>
        </a>
        <i-load-more v-if="loading" :loading="loading"></i-load-more>
        <i-load-more v-if="noDataLoading" tip="暂无数据" :loading="false"></i-load-more>
      </scroll-view>
      <img class="no_data_img" v-if="noData" src="/static/images/no_data.png" alt="">
    </div>
  </div>
</template>

<script>
  import { GetExamType, GetExamList } from '@/utils/api'

  export default {
    data () {
      return {
        domain: 'http://test10.jy365.net',
        courseData: [],
        typeData: [],
        showLeft: false,
        noData: false,
        loading: false,
        noDataLoading: false,
        activeId: null,
        page: 1,
        errorImgScr: '/static/images/newlyCourse.png'
      }
    },
    watch: {},
    methods: {
      toggleLeft () {
        this.showLeft = !this.showLeft
      },
      async getChannelList () {
        let res = await GetExamType()
        this.typeData = res.Data.List
        this.getCourseInfo(this.typeData[0].TypeId)
      },
      async getCourseInfo (TypeId) {
        this.noData = false
        if (TypeId && this.activeId !== TypeId) {
          this.noDataLoading = false
          this.activeId = TypeId
          this.page = 1
          this.courseData = []
        }
        let res = await GetExamList({
          TypeId: this.activeId,
          Page: this.page
        })
        if (res.Type === 1) {
          this.loading = false
          this.showLeft = false
        } else {
          return
        }
        if (res.Data.List.length === 0) {
          this.noDataLoading = this.page !== 1
          return
        } else {
          res.Data.List.forEach(item => {
            item.CourseImg = this.domain + item.CourseImg
          })
        }
        this.courseData = [...this.courseData, ...res.Data.List]
        if (this.courseData.length === 0) {
          this.noData = true
        }
      },
      handleScrollToLower () {
        console.log(111111)
      }
    },
    created () {
    },
    mounted () {
    },
    onReady () {
      this.getChannelList()
    },
    onReachBottom () {
      console.log('上拉中')
      if (this.noDataLoading) return
      this.loading = true
      this.page++
      this.getCourseInfo()
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixins";

  .no_data_img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    @include wh(127.5px, 201px);
  }

  .toggle_list_btn {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: toRpx(40px);
    line-height: toRpx(40px);
    background: $brand-primary;
    border-radius: 0;
    color: #fff;
    z-index: 1;
  }

  .channel_list_container {
    width: 75vw;
    height: 100vh;
    background: #fff;
  }

  .channel_list {
    background: #fff;

    .channel_list_item {
      font-size: toRpx(14px);
      line-height: toRpx(45px);
      padding: 0 toRpx(20px);
      border-bottom: toRpx(1px) solid #eee;

      .parent_tree_container {
        @include flex();

        .list_expand {
          img {
            width: toRpx(20px);
            height: toRpx(11.25px);
          }
        }
      }
    }
  }

  .course_list_container {
    margin-top: toRpx(40px);
    width: 100vw;
  }

  .course_item {
    @include flex(flex-start);
    width: 100%;
    height: toRpx(102px);
    padding: toRpx(10px) toRpx(15px);
    border-bottom: toRpx(1px) solid #eee;

    .course_item_imgs {
      position: relative;

      .course_img {
        @include wh(129px, 72.5px);
      }

      .inner_pic {
        position: absolute;
        top: toRpx(2.5px);
        right: toRpx(2.5px);
        @include wh(25px, 13.5px);
      }
    }

    .course_item_content {
      flex-grow: 1;
      margin-left: toRpx(10px);
      font-size: toRpx(12px);

      .course_name {
        font-size: toRpx(14px);
        height: toRpx(37.5px);
        line-height: 1.4;
        @include ellipsis_two(2);
      }

      .course_teacher {
        color: $color-text-secondary;
        line-height: 1.8;
      }
    }
  }
</style>
