import {Repos as RepApis } from '@/apis/matter/enroll'
import axios, { setupAccessToken } from '@/tms/apis/axios2'
import MockAdapter from 'axios-mock-adapter'

const mock = new MockAdapter(axios)
mock.onGet('/ue/auth/token?site=validsiteid').reply(200, {
    code: 0,
    result: {
        access_token: 'valid_access_token',
        expire_in: 7200
    }
})
mock.onGet(/\/ue\/api\/matter\/enroll\/repos.*/).reply(200, {
    code: 0,
    result: []
})

describe('apis', () => {
    describe('matter', () => {
        describe('enroll', () => {
            describe('repos.js', () => {
                beforeAll(() => {
                    return setupAccessToken('validsiteid')
                });
                it('获取数据列表', () => {
                    return RepApis.getList('/recordList', 'anyappid').then(rst => {
                        expect(rst).toEqual([]);
                    })
                })
            })
        })
    })
})