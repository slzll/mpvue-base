<template>
  <div id="app_courseCenter" class="container_bottom">
    <!--<nav-bar text="课程中心">
      <div class="slide_img_view" @click="toggleLeft()">
        <img class="slide_img" src="/static/images/slide.png" alt="">
      </div>
      <div class="search_img_view">
        <img class="search_img" src="/static/images/search.png" alt="">
      </div>
    </nav-bar>-->
    <i-nav-bar :title="title" color="white" background="#ec4747">
      <div class="canui-head-box" slot="left">
        <navigator class="slide_img_view icon-back" hover-class="none" @click="toggleLeft()">
          <img class="slide_img" src="/static/images/slide.png" alt="">
        </navigator>
        <navigator class="search_img_view icon-home" hover-class="none">
          <img class="search_img" src="/static/images/search.png" alt="">
        </navigator>
      </div>
    </i-nav-bar>
    <div class="container">
      <i-drawer i-class="drawer_container" mode="left" :visible="showLeft" @close="toggleLeft">
        <scroll-view scroll-y>
          <div class="channel_list_container" :style="{paddingTop: navigationBarHeight}">
            <ul class="channel_list">
              <li class="channel_list_item" v-for="(item,i) in channelData" :key="item.ChannelId">
                <div class="parent_tree_container" @click="changeChannel(item)">
                  <div class="channel_list_link common_title ellipsis">
                    <img class="common_title_icon" src="/static/images/red_ico.png" alt="">
                    <span>{{item.ChannelName}}</span>
                  </div>
                  <div v-if="item.Nodes && item.Nodes.length > 0" @click="item.showNodes = !item.showNodes"
                       class="list_expand">
                    <img v-show="!item.showNodes" src="/static/images/dropdown.png" alt="">
                    <img v-show="item.showNodes" src="/static/images/pullup.png" alt="">
                  </div>
                </div>
                <ul v-show="item.showNodes" class="channel_list">
                  <li class="channel_list_item" v-for="nodeItem in item.Nodes" :key="nodeItem.ChannelId">
                    <div class="ellipsis common_title" @click="getCourseInfo(nodeItem.ChannelId)">
                      <img class="common_title_circle" src="/static/images/red_cicle.png" alt="">
                      <span>{{nodeItem.ChannelName}}</span>
                    </div>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </scroll-view>
      </i-drawer>
      <scroll-view class="course_list_container" v-if="!noData"
                   scroll-y="true" lower-threshold="0">
        <a class="course_item" v-for="item in courseData" :key="item.CourseId" href="../pages/index/main">
          <div class="course_item_imgs">
            <error-img class-name="course_img" :src="item.CourseImg"/>
            <img v-if="item.CourseType==='JYAicc'" class="inner_pic" src="/static/images/jingpin.png" alt="">
            <img v-if="item.CourseType==='Mp4'" class="inner_pic" src="/static/images/MP4.png" alt="">
            <img v-if="item.CourseType==='h5'" class="inner_pic" src="/static/images/H5.png" alt="">
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
    <tab-bar current="courseCenter"/>
  </div>
</template>

<script>
  import navBar from '@/components/navBar'
  import TabBar from '@/components/tabBar'
  import ErrorImg from '@/components/errorImg'
  import { GetChannelInfoList, GetCourseInfoList } from '@/utils/api'
  import checkLogin from '@/mixins/checkLogin'

  export default {
    mixins: [checkLogin],
    components: {
      TabBar,
      ErrorImg,
      navBar
    },
    data () {
      return {
        title: '课程中心',
        navigationBarHeight: '',
        leftDrawerHeight: '',
        courseData: [],
        channelData: [],
        showLeft: false,
        noData: false,
        loading: false,
        noDataLoading: false,
        activeId: null,
        page: 1
      }
    },
    watch: {},
    methods: {
      toggleLeft () {
        this.showLeft = !this.showLeft
      },
      async getChannelList () {
        let res = await GetChannelInfoList()
        this.channelData = res.Data.List.map(item => {
          item.showNodes = false
          return item
        })
        this.getCourseInfo(this.channelData[0].Id)
      },
      async getCourseInfo (ChannelId) {
        this.noData = false
        if (ChannelId && this.activeId !== ChannelId) {
          this.noDataLoading = false
          this.activeId = ChannelId
          this.page = 1
          this.courseData = []
        }
        let res = await GetCourseInfoList({ ChannelId: this.activeId, Page: this.page })
        if (res.Type === 1) {
          this.loading = false
          this.showLeft = false
        } else {
          return
        }
        let list = res.Data.List
        if (list.length === 0 && this.page === 1) {
          this.noData = true
          return
        }
        if (list.length === 0 && this.page > 1) {
          this.noDataLoading = true
          return
        }
        this.courseData = [...this.courseData, ...list]
      },
      changeChannel (item) {
        this.title = item.ChannelName
        this.getCourseInfo(item.ChannelId)
      }
    },
    onReady () {
      this.getChannelList()
    },
    onLoad () {
      const _this = this
      mpvue.getSystemInfo({
        success (res) {
          _this.navigationBarHeight = (res.statusBarHeight + 44) + 'px'
          _this.leftDrawerHeight = (res.windowHeight - res.statusBarHeight - 44) + 'px'
        }
      })
    },
    onReachBottom () {
      if (this.noDataLoading) return
      this.loading = true
      this.page++
      this.getCourseInfo()
    },
    onPullDownRefresh () {
      this.loading = true
      this.page = 1
      this.courseList = []
      this.getCourseInfo()
    }
  }
</script>

<style lang="scss">
  @import "../../styles/mixins";

  /*-------左上角按钮-------*/
  .canui-head-box {
    background: rgba(0, 0, 0, 0.2);
    color: #fff;
    border-radius: 20px;
    padding: 4px 4px;
    border: toRpx(1px) solid rgba(255, 255, 255, 0.3);
  }

  .canui-head-box navigator {
    padding: 8px;
    font-size: 20px;
    display: initial;
  }

  .canui-head-box navigator + navigator {
    border-left: 1px solid rgba(255, 255, 255, 0.3);
    margin: 0 3px;
    padding: 0 5px;
    padding-left: 10px;
  }


  .no_data_img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    @include wh(127.5px, 201px);
  }

  .channel_list_container {
    width: 75vw;
    height: 100vh;
    background: #fff;
  }

  .channel_list {
    background: #fff;

    .channel_list_item {
      font-size: toRpx(28px);
      line-height: toRpx(90px);
      padding: 0 toRpx(40px);
      border-bottom: toRpx(1px) solid #eee;

      .parent_tree_container {
        @include flex();

        .list_expand {
          img {
            width: toRpx(40px);
            height: toRpx(22.5px);
          }
        }
      }

      .common_title_icon {
        margin-right: toRpx(10px);
        @include wh(5px, 28px);
      }
    }
  }

  .course_list_container {
    width: 100vw;
  }

  .course_item {
    @include flex(flex-start);
    width: 100%;
    height: toRpx(204px);
    padding: toRpx(20px) toRpx(30px);
    border-bottom: toRpx(1px) solid #eee;

    .course_item_imgs {
      position: relative;

      .course_img {
        @include wh(258px, 145px);
      }

      .inner_pic {
        position: absolute;
        top: toRpx(5px);
        right: toRpx(5px);
        @include wh(50px, 27px);
      }
    }

    .course_item_content {
      flex-grow: 1;
      margin-left: toRpx(20px);
      font-size: toRpx(24px);

      .course_name {
        font-size: toRpx(28px);
        height: toRpx(75px);
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
