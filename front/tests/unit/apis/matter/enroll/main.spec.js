import api from '@/apis/matter/enroll/main'

describe("#apis", () => {
    describe("#matter", () => {
        describe("#enroll", () => {
            describe("#main.js", () => {
                it("获得活动进入规则", () => {
                    api.getEntryRule('57260635db4fb').then(rsp => {
                        expect(rsp.data).not.toBe(false)
                    })
                })
            })
        })
    })
})