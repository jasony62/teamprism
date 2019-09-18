import apis from '@/apis/matter/enroll'

import axios, { setupAccessToken } from '@/tms/apis/axios2';
import MockAdapter from 'axios-mock-adapter'

const mock = new MockAdapter(axios);
mock.onGet('/ue/auth/token?site=validsiteid').reply(200, {
    code: 0,
    result: {
        access_token: 'valid_access_token',
        expire_in: 7200
    }
})
mock.onGet(/\/ue\/api\/matter\/enroll\/get.*/).reply(200, {
    code: 0,
    result: {},
})
mock.onGet(/\/ue\/api\/matter\/enroll\/entryRule.*/).reply(200, {
    code: 0,
    result: {},
})

describe("apis", () => {
    describe("matter", () => {
        describe("enroll", () => {
            describe("index.js", () => {
                beforeAll(() => {
                    return setupAccessToken('validsiteid')
                })
                it("获得活动", () => {
                    return apis.getApp('anyappid').then(rst => {
                        expect(rst).toMatchObject({})
                    })
                })
                it("获得活动进入规则", () => {
                    return apis.checkEntryRule('anyappid').then(rst => {
                        expect(rst).toMatchObject({})
                    })
                })
            })
        })
    })
})