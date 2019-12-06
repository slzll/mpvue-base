import fetch from './fetch'

const API_URL = '/jy365/api'
const Mobile = API_URL + '/mobile'

export const Api = {
  Login: { url: API_URL + '/Login', data: {} },
  GetLink: { url: Mobile + '/GetLink', data: { page: 1, rows: 10 } },
  GetCourseInfoList: {
    url: Mobile + '/GetCourseInfoList',
    data: { ChannelId: -3, Keyword: '', Order: 'desc', Page: 1, Rows: 10, Sort: 'Id', TeacherName: '' }
  },
  GetUserInfo: { url: Mobile + '/GetUserInfo', data: {} },
  GetChannelInfoList: { url: Mobile + '/GetChannelInfoList', data: { ParentId: 0 } },
  GetExamType: { url: Mobile + '/GetExamType', data: { ParentId: 0 } },
  GetExamList: { url: Mobile + '/GetExamList', data: { ExamType: 'All', Keyword: '', Page: 1, Rows: 10, TypeId: 0 } }
}

export const Login = (data) => fetch.post(Api.Login.url, { ...Api.Login.data, ...data })
// 首页轮播图
export const GetLink = (data) => fetch.post(Api.GetLink.url, { ...Api.GetLink.data, ...data })
// 课程列表
export const GetCourseInfoList = (data) => fetch.post(Api.GetCourseInfoList.url, { ...Api.GetCourseInfoList.data, ...data })
// 用户信息
export const GetUserInfo = (data) => fetch.post(Api.GetUserInfo.url, { ...Api.GetUserInfo.data, ...data })
// 课程频道
export const GetChannelInfoList = (data) => fetch.post(Api.GetChannelInfoList.url, { ...Api.GetChannelInfoList.data, ...data })
// 考试类型
export const GetExamType = (data) => fetch.post(Api.GetExamType.url, { ...Api.GetExamType.data, ...data })
// 考试列表
export const GetExamList = (data) => fetch.post(Api.GetExamList.url, { ...Api.GetExamList.data, ...data })
