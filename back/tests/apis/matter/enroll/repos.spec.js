// const request = require("supertest")
// const app = require("../../../app")

describe("#apis", () => {
    describe("#ue", () => {
        describe("#matter", () => {
            describe("#enroll", () => {
                describe("#main.js", () => {
                    const Repos = require('../../../../apis/matter/enroll/repos')
                    let testdata,mockReq
                    beforeAll(() => {
                        testdata = require('../../../../cus/test.data')
                        mockReq = {
                            query: {
                                app: testdata.apis.ue.matter.enroll.main.appId,
                                // access_token: testdata.access_token
                            }
                        }
                    })
                    test("dirSchemasGet()", () => {
                        let ctrl = new Repos(mockReq)
                        return ctrl.dirSchemasGet().then(rst => {
                            console.log(rst)
                            expect(rst).toMatchObject({ code: 0, result: expect.anything() })
                        })
                    })
                })
            })
        })
    })
})