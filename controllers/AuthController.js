import Utils from '../utils/utils';

const sqlConnection = Utils.getSqlConnection();

const isValid = ({ key = '', val = '' } = {}) => {
  let pattern;
    switch (key) {
        case 'name':
            pattern = /^[a-zA-Z ]*$/;
            break;
        case 'email':
            pattern = /^[a-zA-Z0-9._-]*@[a-zA-Z_-]*\.[a-zA-Z]{2,5}$/;
            break;
    }
    return pattern.test(val);
};

const queryDB = ({ email = '', password = '', forgotCredentials = false, checkUser = false } = {}) => {
    let sqlStr, sqlParams;

    if (forgotCredentials) {
        sqlStr = "SELECT password from users WHERE email LIKE ?";
        sqlParams = [`%${email}%`];
    } else if (checkUser) {
        sqlStr = "SELECT count(*) from users WHERE email LIKE ?";
        sqlParams = [`%${email}%`];
    } else {
        sqlStr = "SELECT count(*) from users WHERE email LIKE ? AND password LIKE ?";
        sqlParams = [`%${email}%`, `%${password}%`];
    }

    return new Promise((resolve, reject) => {
        sqlConnection.query(sqlStr, sqlParams, (err, results) => {
            if (err) {
                reject(err);
            }
            resolve(results);
        });
    });
};


const insertToDB = values => {
    let sqlStr =
        "INSERT INTO users (name,email,password) VALUES ?";
    return new Promise((resolve, reject) => {
        sqlConnection.query(sqlStr, [values], (err, results) => {
            if (err) {
                reject(err);
            }
            resolve(results);
        });
    });
};



module.exports = {
    createUser : (req, res) => {
        const { name, email, password } = req.body;
        /**
         * validate request params
         */
        const allParamsValid =
            isValid({key:'name', val: name})
            && isValid({key:'email', val: email});
        if (!allParamsValid) {
            res.status(500).send("Params provided failed validation checks");
        }

        /**
         * check if user exists already
         */
        queryDB({email, checkUser: true})
            .then(result => {
                if (result.length > 0) {
                    res.status(200).send(`User exists already`);
                }
                insertToDB([name, email, password])
                    .then(result => {
                        res.status(200).send(`Successfully created user ${result}`);
                    })
                    .catch(err => {
                        res.status(500).send(err);
                    });
            })
            .catch(err => {
                res.status(500).send(err);
            })

    },

    login: (req, res) => {
        const { email, password } = req.query;
        queryDB({email, password})
            .then(result => {
                res.status(200).send(`Successfully logged in ${result}`);
            })
            .catch(err => {
                res.status(500).send(err);
            })
    },

    forgotPassword: (req, res) => {
        const { email, password } = req.query;
        queryDB({email, password, forgotCredentials: true})
            .then(result => {
                res.status(200).send(`Your password is ${result}, reset your password.`);
            })
            .catch(err => {
                res.status(500).send(err);
            })
    }
};
