<script>
  import { Login } from '@/utils/api'

  export default {
    methods: {
      doLogin () {
        console.log('登录')
        mpvue.login({
          async success (res) {
            console.log('login success', res)
            const code = res.code
            let loginRes = await Login({ code })
            console.log(loginRes)
            // if()
          },
          fail (res) {
            console.log('login fail', res)
          }
        })
      }
    },
    created () {
      // 调用API从本地缓存中获取数据
      /*
       * 平台 api 差异的处理方式:  api 方法统一挂载到 mpvue 名称空间, 平台判断通过 mpvuePlatform 特征字符串
       * 微信：mpvue === wx, mpvuePlatform === 'wx'
       * 头条：mpvue === tt, mpvuePlatform === 'tt'
       * 百度：mpvue === swan, mpvuePlatform === 'swan'
       * 支付宝(蚂蚁)：mpvue === my, mpvuePlatform === 'my'
       */

      let logs
      if (mpvuePlatform === 'my') {
        logs = mpvue.getStorageSync({ key: 'logs' }).data || []
        logs.unshift(Date.now())
        mpvue.setStorageSync({
          key: 'logs',
          data: logs
        })
      } else {
        logs = mpvue.getStorageSync('logs') || []
        logs.unshift(Date.now())
        mpvue.setStorageSync('logs', logs)
      }

      /* 微信小程序鉴权 */
      let loginFlag = mpvue.getStorageSync('skey')
      if (loginFlag) {
        mpvue.checkSession({
          success () {
            console.log('success')
          },
          fail () {
            console.log('check login', this)
            this.doLogin()
          }
        })
      } else {
        this.doLogin()
      }
    },
    log () {
      console.log(`log at:${Date.now()}`)
    },
    onLaunch () {
      mpvue.hideTabBar()
    }
  }
</script>

<style lang="scss">
  @import "./styles/main";
</style>
