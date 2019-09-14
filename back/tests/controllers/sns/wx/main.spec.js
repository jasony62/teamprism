describe("#apis", () => {
    describe("#sns", () => {
        describe("#wx", () => {
            describe("#main.js", () => {
                let request = {}
                let client = {
                    siteid: 'anysiteid'
                }
                const CtrlClass = require('../../../../apis/sns/wx/main')
                let ctrl = new CtrlClass(request, client)
                test("appid()", () => {
                    return ctrl.appid().then(rst => {
                        expect(rst).toMatchObject({ code: 0, result: expect.stringMatching(/\w+/) })
                    })
                })
            })
        })
    })
})