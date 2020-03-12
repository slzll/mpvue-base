import Fly from 'flyio/dist/npm/wx'

const request = new Fly()

request.config.baseURL = 'https://www.slzll.com'
request.config.timeout = 10000
request.config.headers['Content-Type'] = 'application/json; charset=utf-8'

request.interceptors.request.use((request) => {
  mpvue.showLoading({ title: '拼命加载中...' })
  let auth = wx.getStorageSync('ASPXAUTH')
  if (auth) {
    request.headers.ASPXAUTH = auth
  }
  return request
})

request.interceptors.response.use(
  (response) => {
    mpvue.hideLoading()
    // 存储aspxauth身份验证
    let auth = response.headers.aspxauth || response.headers.ASPXAUTH
    if (auth) {
      mpvue.setStorageSync('ASPXAUTH', auth[0] || auth)
    }
    if (response.data.Type === 401) {
      mpvue.redirectTo({ url: '/pages/login/main' })
      return
    }
    return response.data
  },
  (err) => {
    mpvue.hideLoading()
    mpvue.showToast({
      title: err.message,
      icon: 'none'
    })
    return err
  }
)

export default {
  get (url, data) {
    return request.get(url, data)
  },
  post (url, data) {
    return request.post(url, data)
  }
}
