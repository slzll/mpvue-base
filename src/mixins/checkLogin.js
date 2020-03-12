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
          if (loginRes.Type === 401) {
            console.log('跳转登录')
            mpvue.redirectTo({
              url: '/pages/login/main'
            })
          } else {
            // eslint-disable-next-line camelcase
            const { Data, session_key } = loginRes
            mpvue.setStorageSync('skey', session_key)
            mpvue.setStorageSync('userInfo', Data)
          }
        },
        fail (res) {
          console.log('login fail', res)
        }
      })
    }
  },
  onLoad () {
    console.log('on load')
    /* 微信小程序鉴权 */
    let loginFlag = mpvue.getStorageSync('skey')
    if (loginFlag) {
      mpvue.checkSession({
        success () {
          console.log('check session success')
        },
        fail () {
          console.log('check session fail')
          this.doLogin()
        }
      })
    } else {
      this.doLogin()
    }
  },
  onShow () {
    // console.log('on show')
  },
  onReady () {
    // console.log('on ready')
  }
}
