describe("#models", () => {
    describe("#matter", () => {
        describe("#article", () => {
            describe("index.js", () => {
                test("byId()", async (done) => {
                    let moArticle = require('../../../../models/matter/article').create({ debug: true })
                    await moArticle.byId(1)
                    expect(moArticle.execSqlStack[0]).toMatch(/^select \* from xxt_article where id='1'$/i)
                    moArticle.end(done)
                })
                test("byIds()", async (done) => {
                    let moArticle = require('../../../../models/matter/article').create({ debug: true })
                    await moArticle.byIds([1, 2, 3])
                    expect(moArticle.execSqlStack[0]).toMatch(/^select \* from xxt_article where id in\('1','2','3'\)$/i)
                    moArticle.end(done)
                })
            })
        })
    })
})