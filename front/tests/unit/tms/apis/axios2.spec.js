import axios, { setupAccessToken } from '@/tms/apis/axios2'
import MockAdapter from 'axios-mock-adapter'

const mock = new MockAdapter(axios);

mock.onGet('/ue/auth/token?site=invalidsiteid').reply(200, {
    code: 40013,
    msg: '没有获得有效用户信息'
})
mock.onGet('/ue/auth/token?site=validsiteid').reply(200, {
    code: 0,
    result: {
        access_token: 'mock_access_token',
        expire_in: 7200
    }
})
mock.onGet(/\/ue\/withaccesstoken/).reply(() => {
    return [200, { code: 0, result: 'test' }]
})
mock.onGet(/\/ue\/returnlogicerror/).reply(() => {
    return [200, { code: 1, msg: '服务端业务逻辑错误' }]
})

describe("#apis", () => {
    describe("#axios2.js", () => {
        it("创建失败(siteid为空)", () => {
            expect(setupAccessToken()).rejects.toMatch('Axios2:参数错误')
        })
        it("根据siteid创建失败", () => {
            return expect(setupAccessToken('invalidsiteid')).rejects.toMatch('Axios2:没有获得有效用户信息')
        })
        it("根据siteid创建成功", () => {
            return setupAccessToken('validsiteid').then(data => {
                expect(data).toBe(axios)
            })
        })
        it("发送请求，添加access_token", () => {
            return axios.get('/ue/withaccesstoken').then(res => {
                expect(res.config.params).toMatchObject({ access_token: 'mock_access_token' })
            })
        })
        it("发送请求，返回业务逻辑错误", () => {
            return axios.get('/ue/returnlogicerror').catch(err => {
                expect(err).toBe('服务端业务逻辑错误')
            })
        })
    })
})