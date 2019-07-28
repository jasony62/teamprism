import api from '@/apis/matter/enroll/main'

import axios, { setupAccessToken } from '@/tms/apis/axios2';
import MockAdapter from 'axios-mock-adapter'

const mock = new MockAdapter(axios);
mock.onGet('/ue/auth/token?site=validsiteid').reply(200, {
    code: 0,
    access_token: 'valid_access_token',
    expire_in: 7200
})
mock.onGet(/\/ue\/api\/matter\/enroll\/entryRule.*/).reply(200, {
    code: 0,
    result: {},
})

describe("#apis", () => {
    describe("#matter", () => {
        describe("#enroll", () => {
            describe("#main.js", () => {
                beforeAll(() => {
                    return setupAccessToken('validsiteid')
                })
                it("获得活动进入规则", () => {
                    return api.getEntryRule('anyappid').then(rst => {
                        expect(rst).toMatchObject({})
                    })
                })
            })
        })
    })
})