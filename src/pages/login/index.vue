<template>
  <div class="app_login">
    <img class="login_bg" src="/static/images/login_bg.png"/>
    <div>
      <div class="bind_user">
        <img class="login_icon" src="/static/images/login_ico.png" alt="">
      </div>
      <div class="user_login">
        <div class="form-group">
          <span class="control-label">用户名</span>
          <input class="form-control" type="text" placeholder="请输入用户名" v-model="username">
        </div>
        <div class="form-group">
          <span class="control-label">密码</span>
          <input class="form-control" type="password" placeholder="请输入密码" v-model="password">
        </div>
      </div>
      <div class="remember_box">
        <div class="checkbox-box">
          <input type="checkbox" class="checkbox_input" :checked="rememberOrNot===1"
                 @click="rememberPwd(rememberOrNot)">
          <label for="remember">记住密码</label>
        </div>
        <span class="fr" @click="showTips">忘记密码？</span>
      </div>
      <button class="login_btn" @click="login">登录</button>
      <a class="register" href="register.html">注册账号</a>
    </div>
    <div class="show_tips" v-if="isShow">
      <div class="show_tips_content">
        <h4>温馨提示</h4>
        <p>如果忘记密码，请联系本单位联络员或客服0571-28990788</p>
        <button @click="hideTips">确定</button>
      </div>
    </div>
  </div>
</template>

<script>
  import CryptoJS from 'crypto-js'
  import { Login } from '@/utils/api'

  export default {
    data () {
      return {
        username: '',
        password: '',
        code: '',
        showError1: false,
        showError2: false,
        rememberOrNot: 0,
        isShow: false,
        key: 'jy365jy365jy365y',
        iv: '0392039203920300'
      }
    },
    methods: {
      encrypt (val) {
        return CryptoJS.AES.encrypt(val, CryptoJS.enc.Utf8.parse(this.key), {
          iv: CryptoJS.enc.Utf8.parse(this.iv),
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7
        })
      },
      decrypt (val = '') {
        return CryptoJS.AES.decrypt(val, CryptoJS.enc.Utf8.parse(this.key), {
          iv: CryptoJS.enc.Utf8.parse(this.iv),
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7
        }).toString(CryptoJS.enc.Utf8)
      },
      login () {
        let _this = this
        if (this.username && this.password) {
          if (this.showError1) {
            mpvue.showModal({
              title: '提示',
              content: '账号不能为中文'
            })
            return
          }
          if (this.showError2) {
            mpvue.showModal({
              title: '提示',
              content: '密码长度为6到16位'
            })
            return
          }
          mpvue.login({
            async success (loginRes) {
              _this.code = loginRes.code
              let res = await Login({
                Code: _this.code,
                Account: _this.username,
                Password: _this.password,
                Mac: _this.username
              })
              if (res.Type === 1) {
                // eslint-disable-next-line camelcase
                const { Data, session_key } = res
                mpvue.setStorageSync('skey', session_key)
                mpvue.setStorageSync('userInfo', Data)
                if (_this.rememberOrNot === 1) {
                  let u = _this.encrypt(this.username)
                  let p = _this.encrypt(this.password)
                  mpvue.setStorageSync('u_app', u)
                  mpvue.setStorageSync('p_app', p)
                } else {
                  mpvue.setStorageSync('u_app', '')
                  mpvue.setStorageSync('p_app', '')
                }
                mpvue.switchTab({ url: '/pages/index/main' })
              } else {
                mpvue.showModal({
                  title: '提示',
                  content: res.Message
                })
              }
            }
          })
        } else {
          mpvue.showModal({
            title: '提示',
            content: '用户名或密码不能为空'
          })
        }
      },
      showTips: function () {
        this.isShow = true
      },
      hideTips: function () {
        this.isShow = false
      },
      rememberPwd: function (flag) {
        this.rememberOrNot = flag === 0 ? 1 : 0
        mpvue.setStorageSync('rememberOrNot', this.rememberOrNot)
      }
    },
    onLoad () {
      this.username = this.decrypt(mpvue.getStorageSync('u_app'))
      this.password = this.decrypt(mpvue.getStorageSync('p_app'))
      this.rememberOrNot = Number(mpvue.getStorageSync('rememberOrNot'))
    },
    watch: {
      username (val) {
        let flag = false
        let reg = /^[\u4e00-\u9fa5]+$/
        let arr = val.split('')
        flag = arr.some(val => reg.test(val))
        this.showError1 = flag
      },
      password (val) {
        let flag = false
        let length = val.length
        if (length < 6 || length > 16) {
          flag = true
        }
        this.showError2 = flag
      }
    }
  }
</script>

<style lang="scss">
  @import "../../styles/mixins";
  /* 登录样式 */
  .login_bg {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    @include wh(750px, 1334px);
    z-index: -1;
  }

  .bind_user {
    padding: toRpx(124.5px) 0;
    width: 100%;
    background: #f4f4f4;
    overflow: hidden;
    text-align: center;

    .login_icon {
      @include wh(127px, 129px);
    }
  }

  .user_login {
    height: toRpx(180px);
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    padding-left: toRpx(30px);
    background: #fff;

    .form-group {
      @include flex(flex-start);
      align-items: center;
      @include ht-lineHt(90px);
      font-size: toRpx(32px);

      &:first-child {
        border-bottom: 1px solid #ddd;
      }
    }

    .control-label {
      width: toRpx(100px);
      text-align: justify;
      text-align-last: justify;
    }

    .form-control {
      @include wh(600px, 80px);
      border: none;
      outline: none;
      padding-left: toRpx(18px);
    }
  }

  .remember_box {
    @include flex(space-between);
    align-items: center;
    padding: toRpx(30px);
    color: #999;
  }

  .login_btn {
    width: 92%;
    @include ht-lineHt(90px);
    text-align: center;
    font-size: toRpx(36px);
    background: #ec4747;
    margin: toRpx(45px) 4%;
    outline: none;
    border-radius: toRpx(10px);
    border: none;
    color: #fff;
  }

  .register {
    @include wh(200px, 72px);
    line-height: toRpx(72px);
    border: 1px solid $brand-primary;
    font-size: toRpx(30px);
    color: $brand-primary;
    padding: 0 toRpx(18px);
    border-radius: toRpx(7.5px);
    text-align: center;
    margin-left: 50%;
    transform: translateX(-50%);
  }
</style>
