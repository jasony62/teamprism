import axios, { setupAccessToken } from '@/tms/apis/axios2'
import MockAdapter from 'axios-mock-adapter'

const mock = new MockAdapter(axios);

describe("apis", () => {
    describe("axios2.js", () => {
        let now = parseInt(new Date / 1000)
        beforeEach(() => {
            sessionStorage.removeItem('access_token')
            mock.reset()
        })
        it("设置失败：siteid为空", () => {
            return setupAccessToken().catch(err => {
                expect(err).toMatchObject({ msg: 'axios2:参数错误' })
            })
        })
        it("sessionStorage中已经有可用的acccess_token", () => {
            mock.onGet('/ue/api/any').reply(200, { code: 0, result: 'test' })
            sessionStorage.setItem('access_token', `validaccesstoken:${now+7200}`)
            return setupAccessToken('anysiteid')
                .then(value => {
                    expect(value).toBe(axios)
                    return axios.get('/ue/api/any')
                })
                .then(res => {
                    expect(res.config.params).toMatchObject({ access_token: 'validaccesstoken' })
                    expect(res.data).toMatchObject({ code: 0, result: 'test' })
                })
        })
        it("sessionStorage中的acccess_token已经过期，成功获取新的access_token", () => {
            mock.onGet('/ue/auth/token?site=anysiteid').reply(200, {
                code: 0,
                result: {
                    access_token: 'new_access_token',
                    expire_in: 7200
                }
            })
            mock.onGet('/ue/api/any').reply(200, { code: 0, result: 'test' })
            return setupAccessToken('anysiteid')
                .then(value => {
                    expect(value).toBe(axios)
                    return axios.get('/ue/api/any')
                }).then(res => {
                    expect(res.config.params).toMatchObject({ access_token: 'new_access_token' })
                    expect(res.data).toMatchObject({ code: 0, result: 'test' })
                })
        })
        it("sessionStorage中的acccess_token已经过期，获取新的access_token失败", () => {
            mock.onGet('/ue/auth/token?site=anysiteid').reply(200, {
                code: 40013,
                msg: '没有获得有效用户信息'
            })
            sessionStorage.setItem('access_token', `validaccesstoken:${now}`)
            return setupAccessToken('anysiteid').catch(err => {
                expect(err.msg).toBe(`axios2:没有获得有效用户信息`)
            })
        })
        it("发出请求时，发现access_token过期，重新获得access_token后，继续发送请求", () => {
            mock.onGet('/ue/auth/token?site=anysiteid').reply(200, {
                code: 0,
                result: {
                    access_token: 'new_access_token',
                    expire_in: 7200
                }
            })
            mock.onGet('/ue/api/any').reply(200, { code: 0, result: 'test' })
            sessionStorage.setItem('access_token', `validaccesstoken:${now+7200}`)
            return setupAccessToken('anysiteid')
                .then(value => {
                    expect(value).toBe(axios)
                    sessionStorage.setItem('access_token', `validaccesstoken:${now}`)
                    return axios.get('/ue/api/any')
                }).then(res => {
                    expect(res.config.params).toMatchObject({ access_token: 'new_access_token' })
                    expect(res.data).toMatchObject({ code: 0, result: 'test' })

                })
        })
        it("发出请求后，服务端响应access_token不可用，获得新access_token后，重发请求", () => {
            mock.onGet('/ue/auth/token?site=anysiteid').reply(200, {
                code: 0,
                result: {
                    access_token: 'new_access_token',
                    expire_in: 7200
                }
            })
            mock.onGet('/ue/api/any').replyOnce(200, { code: 20001, msg: 'getting access_token failed' })
            mock.onGet('/ue/api/any').replyOnce(200, { code: 0, result: 'test' })
            sessionStorage.setItem('access_token', `validaccesstoken:${now+7200}`)
            return setupAccessToken('anysiteid')
                .then(value => {
                    expect(value).toBe(axios)
                    return axios.get('/ue/api/any')
                })
                .then(res => {
                    expect(res.config.params).toMatchObject({ access_token: 'new_access_token' })
                    expect(res.data).toMatchObject({ code: 0, result: 'test' })
                })
        })
        it("业务逻辑错误", () => {
            mock.onGet('/ue/api/any').reply(200, { code: 10001, msg: '服务端业务逻辑错误' })
            sessionStorage.setItem('access_token', `validaccesstoken:${now+7200}`)
            return setupAccessToken('anysiteid').then(value => {
                expect(value).toBe(axios)
                return axios.get('/ue/api/any')
            }).catch(err => {
                expect(err.msg).toBe('服务端业务逻辑错误')
            })
        })
    })
})