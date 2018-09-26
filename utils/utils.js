const mysql = require("mysql");
const DBConfigs = require("../configs/dbConfig");

let sqlConnection;

module.exports = {
    getSqlConnection: () => {
        if (sqlConnection) return sqlConnection;
        sqlConnection = mysql.createConnection(DBConfigs.getConfigs());
        return sqlConnection;
    }
};
