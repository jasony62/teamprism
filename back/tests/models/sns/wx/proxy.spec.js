const { createProxy } = require('../../../../models/sns/wx/proxy')

const axios = require('axios')
const MockAdapter = require('axios-mock-adapter')

const mock = new MockAdapter(axios);
mock.onGet(/https:\/\/api.weixin.qq.com\/sns\/oauth2\/access_token.*/).reply(200, {
    "access_token": "ACCESS_TOKEN",
    "expires_in": 7200,
    "refresh_token": "REFRESH_TOKEN",
    "openid": "OPENID",
    "scope": "snsapi_userinfo"
})
mock.onGet(/https:\/\/api.weixin.qq.com\/sns\/userinfo.*/).reply(200, {
    "openid": " OPENID",
    "nickname": "NICKNAME",
    "sex": "1",
    "province": "PROVINCE",
    "city": "CITY",
    "country": "COUNTRY",
    "headimgurl": "http://thirdwx.qlogo.cn/mmopen/g3MonUZtNHkdmzicIlibx6iaFqAc56vxLSUfpb6n5WKSYVY0ChQKkiaJSgQ1dZuTOgvLLrhJbERQQ4eMsv84eavHiaiceqxibJxCfHe/46",
    "privilege": ["PRIVILEGE1", "PRIVILEGE2"],
    "unionid": "o6_bmasdasdsad6_2sgVt7hMZOPfL"
})

describe("#models", () => {
    describe("#sns", () => {
        describe("#wx", () => {
            describe("#proxy.js", () => {
                describe("Proxy", () => {
                    let wxProxy
                    beforeAll(() => {
                        return createProxy('anysiteid').then(rst => {
                            wxProxy = rst
                        })
                    })
                    test("getOAuthUser()", () => {
                        return wxProxy.getOAuthUser('anycode').then(rst => {
                            expect(rst).toMatchObject({ openid: expect.stringMatching(/\w+/) })
                        })
                    })
                })
            })
        })
    })
})