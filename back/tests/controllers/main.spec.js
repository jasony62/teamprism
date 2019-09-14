describe("#apis", () => {
    describe("#main.js", () => {
        test("version()", () => {
            const CtrlClass = require('../../apis/main')
            let ctrl = new CtrlClass()
            expect(ctrl.version()).toMatchObject({ code: 0, result: "0.1" })
        })
    })
})