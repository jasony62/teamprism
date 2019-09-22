module.exports = {
    port: 3000,
    name: "teamprism",
    router: {
        auth: {
            prefix: "/ue"
        },
        controllers: {
            prefix: "/api"
        }
    }
}