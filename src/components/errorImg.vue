<template>
  <img :class="className" :src="imgSrc" @error="handleError"/>
</template>

<script>
  export default {
    props: {
      className: {
        type: String
      },
      src: {
        type: String
      },
      errSrc: {
        type: String,
        default: '/static/images/newlyCourse.png'
      }
    },
    computed: {
      imgSrc: {
        get () {
          return this.src ? this.src : this.errSrc
        },
        set (val) {
          console.log(val)
          this.src = val
        }
      }
    },
    methods: {
      handleError () {
        this.imgSrc = this.errSrc
      }
    }
  }
</script>
