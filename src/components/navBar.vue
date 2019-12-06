<template>
  <div>
    <div class="custom_nav_bar" :style="{height: navigationBarHeight}">
      <div class="status_bar" :style="{height: statusBarHeight}"></div>
      <div class='title-container'>
        <div class='capsule'>
          <slot></slot>
        </div>
        <div class='title'>{{text}}</div>
      </div>
    </div>
    <div :style="{height: navigationBarHeight, background: 'white'}"></div>
  </div>
</template>

<script>
  export default {
    name: 'navBar',
    props: {
      text: {
        type: String,
        default: '标题'
      }
    },
    data () {
      return {
        navigationBarHeight: '',
        statusBarHeight: ''
      }
    },
    onLoad () {
      const _this = this
      mpvue.getSystemInfo({
        success (res) {
          _this.statusBarHeight = res.statusBarHeight + 'px'
          _this.navigationBarHeight = (res.statusBarHeight + 44) + 'px'
        }
      })
    },
    methods: {
      backHome () {
      },
      back () {
        mpvue.navigateBack({
          delta: 1
        })
      }
    }
  }
</script>

<style lang="scss">
  @import "../styles/mixins";

  .custom_nav_bar {
    width: 100%;
    background-color: $brand-primary;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;

    .title-container {
      height: 40px;
      display: flex;
      align-items: center;
      position: relative;
    }

    .capsule {
      margin-left: 10px;
      height: 30px;
      display: flex;
      align-items: center;
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: 15px;
      border: 1px solid rgba(255, 255, 255, 0.1);

      .slide_img_view {
        border-top-left-radius: 15px;
        border-bottom-left-radius: 15px;
        padding: 0 7.5px 0 15px;
        height: 100%;
        @include flex(center);
        align-items: center;

        &:hover {
          background-color: rgba(#ebf1f1, 0.2);
        }
      }

      & > .search_img_view {
        height: 100%;
        @include flex(center);
        align-items: center;
        border-left: 1px solid rgba(255, 255, 255, 0.3);
        padding: 0 15px 0 7.5px;
        border-top-right-radius: 15px;
        border-bottom-right-radius: 15px;

        &:hover {
          background-color: rgba(#ebf1f1, 0.2);
        }
      }
    }

    .title {
      color: white;
      position: absolute;
      top: 8px;
      left: 104px;
      right: 104px;
      height: 30px;
      line-height: 30px;
      font-size: 16px;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
</style>
