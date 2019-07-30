const { Config } = require('../../../../models/sns/wx/proxy')

describe("#models", () => {
    describe("#sns", () => {
        describe("#wx", () => {
            describe("#proxy.js", () => {
                describe("Config", () => {
                    let modelWxConfig, oAnyWx
                    beforeAll(() => {
                        modelWxConfig = new Config()
                    })
                    test("select()", () => {
                        return modelWxConfig.select().then(rst => {
                            expect(rst.length).toBeGreaterThan(0)
                            oAnyWx = rst[0]
                        })
                    })
                    test("bySite()", () => {
                        return modelWxConfig.bySite(oAnyWx.siteid).then(oWx => {
                            expect(oWx.id).toBe(oAnyWx.id)
                        })
                    })
                    afterAll(done => {
                        modelWxConfig.end(done)
                    })
                })
            })
        })
    })
})