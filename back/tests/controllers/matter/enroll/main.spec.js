describe("#apis", () => {
    describe("#matter", () => {
        describe("#enroll", () => {
            describe("#main.js", () => {
                const CtrlClass = require('../../../../apis/matter/enroll/main')
                let testdata, mockReq
                beforeAll( async () => {
                    testdata = require('../../../../cus/test.data')
                    mockReq = {
                        query: {
                            app: testdata.apis.ue.matter.enroll.main.appId,
                            ek: testdata.apis.ue.matter.enroll.record.ek
                        }
                    }
                    ctrl = new CtrlClass(mockReq)
                    ctrl.getUser = () => {
                        return testdata.user
                    } 
                    await ctrl.tmsBeforeEach()
                })
                test("entryRule()", () => {
                    return ctrl.entryRule().then(rst => {
                        expect(rst).toMatchObject({ code: 0, result: expect.anything() })
                    })
                })
                test("get()", () => {
                    return ctrl.get().then(rst => {
                        expect(rst).toMatchObject({ code: 0, result: expect.anything() })
                    })
                })
            })
        })
    })
})