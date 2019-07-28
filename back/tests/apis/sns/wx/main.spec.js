describe("#apis", () => {
    describe("#sns", () => {
        describe("#wx", () => {
            describe("#main.js", () => {
                let request = {
                    query: {
                        site: 'anysiteid'
                    }
                }
                const CtrlClass = require('../../../../apis/sns/wx/main')
                let ctrl = new CtrlClass(request)
                test("appid()", () => {
                    return ctrl.appid().then(rst => {
                        expect(rst).toMatchObject({ code: 0, result: expect.stringMatching(/\w+/) })
                    })
                })
            })
        })
    })
})