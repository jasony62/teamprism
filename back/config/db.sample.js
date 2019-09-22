module.exports = {
    master: {
        connectionLimit: 2,
        waitForConnections: false,
        host: "localhost",
        port: "3306",
        user: "",
        password: "",
        database: ""
    },
    write: {
        connectionLimit: 1,
        waitForConnections: false,
        host: "localhost",
        port: "3306",
        user: "",
        password: "",
        database: ""
    }
}