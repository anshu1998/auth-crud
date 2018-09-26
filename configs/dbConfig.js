const DBConfigs = (function () {
    let
        host = "localhost",
        user = "root",
        password = "",
        database = "users_core";

    function getConfigs() {
        return {
            host: host,
            user: user,
            password: password,
            database: database
        };
    }

    return ({
        getConfigs: getConfigs
    });

})();

module.exports = DBConfigs;
