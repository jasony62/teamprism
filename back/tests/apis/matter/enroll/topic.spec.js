describe("#apis", () => {
    describe("#matter", () => {
        describe("#enroll", () => {
            describe("#topic.js", () => {
                const Repos = require('../../../../apis/matter/enroll/topic')
                let testdata,mockReq,ctrl
                beforeAll( async () => {
                    testdata = require('../../../../cus/test.data')
                    mockReq = {
                        query: {
                            app: testdata.apis.ue.matter.enroll.main.appId
                        }
                    }

                    ctrl = new Repos(mockReq)
                    ctrl.getUser = () => {
                        return testdata.user
                    } 
                    await ctrl.tmsBeforeEach()
                })
                test("listAll()", () => {
                    return ctrl.listAll().then(rst => {
                        expect(rst).toMatchObject({ code: 0, result: expect.anything() })
                    })
                })
                afterAll(() => {
                    // 关闭数据库连接
                    let { Db } = require('../../../../tms/db')
                    Db.destroy()
                })
            })
        })
    })
})