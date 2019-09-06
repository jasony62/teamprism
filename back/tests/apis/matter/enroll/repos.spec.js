describe("#apis", () => {
    describe("#matter", () => {
        describe("#enroll", () => {
            describe("#repos.js", () => {
                const Repos = require('../../../../apis/matter/enroll/repos')
                let testdata, mockReq
                beforeAll(() => {
                    testdata = require('../../../../cus/test.data')
                    mockReq = {
                        query: {
                            app: testdata.apis.ue.matter.enroll.main.appId
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
                test("recordList()", () => {
                    let ctrl = new Repos(mockReq)
                    return ctrl.recordList().then(rst => {
                        expect(rst).toMatchObject({ code: 0, result: expect.anything() })
                    })
                })
            })
        })
    })
})