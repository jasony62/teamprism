describe("#apis", () => {
    describe("#matter", () => {
        describe("#enroll", () => {
            describe("#repos.js", () => {
                const Repos = require('../../../../apis/matter/enroll/repos')
                let testdata,mockReq,ctrl
                beforeAll( async () => {
                    testdata = require('../../../../cus/test.data')
                    mockReq = {
                        query: {
                            app: testdata.apis.ue.matter.enroll.main.appId,
                            ek: testdata.apis.ue.matter.enroll.record.ek
                        }
                    }

                    ctrl = new Repos(mockReq)
                    ctrl.getUser = () => {
                        return testdata.user
                    } 
                    await ctrl.tmsBeforeEach()
                })
                test("dirSchemasGet()", () => {
                    return ctrl.dirSchemasGet().then(rst => {
                        expect(rst).toMatchObject({ code: 0, result: expect.anything() })
                    })
                })
                test("recordList()", () => {
                    return ctrl.recordList().then(rst => {
                        expect(rst).toMatchObject({ code: 0, result: expect.anything() })
                    })
                })
                test("coworkDataList()", () => {
                    return ctrl.coworkDataList().then(rst => {
                        expect(rst).toMatchObject({ code: 0, result: expect.anything() })
                    })
                })
                test("recordGet()", () => {
                    return ctrl.recordGet().then(rst => {
                        expect(rst.result.enroll_key).toBe(mockReq.query.ek)
                    })
                })
            })
        })
    })
})