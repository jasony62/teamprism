describe("#models", () => {
    describe("#matter", () => {
        describe("#article", () => {
            describe("index.js", () => {
                test("byId()", async () => {
                    let dmArticle = require('../../../../models/matter/article').create({ debug: true })
                    await dmArticle.byId(1)
                    expect(dmArticle.execSqlStack[0]).toMatch(/^select \* from xxt_article where id='1'$/i)
                })
                test("byIds()", async () => {
                    let dmArticle = require('../../../../models/matter/article').create({ debug: true })
                    await dmArticle.byIds([1, 2, 3])
                    expect(dmArticle.execSqlStack[0]).toMatch(/^select \* from xxt_article where id in\('1','2','3'\)$/i)
                })
            })
        })
    })
})