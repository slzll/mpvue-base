<template>
  <i-tab-bar i-class="custom_tab_bar" fixed color="#ec4747" :current="current" @change="handleChange">
    <i-tab-bar-item key="home" img="/static/tabs/home.png" current-img="/static/tabs/home-active.png"
                    title="首页"/>
    <i-tab-bar-item key="courseCenter" img="/static/tabs/course.png" current-img="/static/tabs/course-active.png"
                    title="课程"/>
    <i-tab-bar-item key="examCenter" img="/static/tabs/exam.png" current-img="/static/tabs/exam-active.png"
                    title="考试"/>
    <i-tab-bar-item key="personalCenter" img="/static/tabs/person.png" current-img="/static/tabs/person-active.png"
                    title="我的"/>
  </i-tab-bar>
</template>

<script>
  export default {
    name: 'tabBar',
    props: ['current'],
    data () {
      return {
        tabBar: {
          home: '../index/main',
          courseCenter: '../courseCenter/main',
          examCenter: '../examCenter/main',
          personalCenter: '../personalCenter/main'
        }
      }
    },
    methods: {
      handleChange ({ mp }) {
        const { detail } = mp
        const { key } = detail
        const url = this.tabBar[key]
        console.log(key, url)
        mpvue.switchTab({
          url
        })
      }
    }
  }
</script>

<style lang="scss">
  @import "../styles/mixins";
</style>
