const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: '192.168.128.101',
    database: 'appinfo',
    password: 'mysecretpassword',
    port: 5432,
})
// TODO: change this to an actual secret key
const secretKey = "secretkey";

const getApps = (request, response) => {
    pool.query('SELECT * FROM app ORDER BY id ASC', (error, results) => {
        if (error) {
            response.status(500).send(error);
        }
        response.send(results)

    })
}

const getAppById = (request, response) => {
    const id = parseInt(request.params.id)
    pool.query('SELECT * FROM app WHERE id = $1', [id], (error, results) => {
        if (error) {
            response.status(500).send(error);
        }
        response.send(results)
    })
}

const createApp = (request, response) => {
    console.log(JSON.stringify(request.body));

    const { name, ownername, description, icon } = request.body

    pool.query('INSERT INTO app (name, ownername, description, icon) VALUES ($1, $2, $3, $4)', [name, ownername, description, icon], (error, results) => {
        if (error) {
            response.status(500).send(error);
        }
        response.status(201).send(`App added with ID: ${results.insertId}`)
    })
}

const updateApp = (request, response) => {
    console.log(JSON.stringify(request.body));

    const { id, name, ownername, description, icon } = request.body

    pool.query(
        'UPDATE app SET name = $1, ownername = $2, description = $3, icon = $4 WHERE id = $5',
        [name, ownername, description, icon, id],
        (error, results) => {
            if (error) {
                response.status(500).send(error);
            }
            response.status(200).send(`App modified with ID: ${id}`)
        }
    )
}

const deleteApp = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('DELETE FROM app WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send(`App deleted with ID: ${id}`)
    })
}

const login = async (request, response) => {
    const { username, userpassword } = request.body

    if (!username || !userpassword) {
        response.status(400).send("Username and Password is required to login!");
    }
    
    try {
        // check if user  exists
        const userExists = await getUserCount(username);
        if (Number(userExists) < 1) {
            response.status(400).send("User does not exist!");
            return;
        }
    } catch (err) {
        console.log("err: " + err);
    }
    
    try {
        // check if password is correct
        const user = await getUser(username);
        const isMatch = await bcrypt.compare(userpassword, user.userpassword);
        if (!isMatch) {
            response.status(400).send("Password is incorrect!");
            return;
        }
    } catch (err) {
        console.log("err: " + err);
    }
    
    // update token
    const token = jwt.sign(
        { username: username }, 
        secretKey, {
        expiresIn: "2h",
    });
    
    // save user token
    try {
        const user = await updateUser(username, token);
    } catch (err) {
        console.log("err: " + err);
    }

    response.status(200).send({ token });
}

const getUser = async (username) => {
    try {
        const user = await pool.query(
            "SELECT * FROM user_auth WHERE username = $1",
            [username]
        );
        return user.rows[0];
    } catch (err) {
        console.error(err.message);
    }
};

// update user token
const updateUser = async (username, token) => {
    try {
        const updateUser = await pool.query(
            "UPDATE user_auth SET token = $1 WHERE username = $2",
            [token, username]
        );
        return "User was updated!";
    } catch (err) {
        console.error(err.message);
    }
};

const getUserCount = async (username) => {
    try {
        const user = await pool.query(
            "SELECT count(*) FROM user_auth WHERE username = $1",
            [username]
        );
        return user.rows[0].count;
    } catch (err) {
        console.error(err.message);
    }
};

const saveUser = async (username, userpassword, token) => {
    try {
        const newUser = await pool.query(
            "INSERT INTO user_auth (username, userpassword, token) VALUES ($1, $2, $3) RETURNING *",
            [username, userpassword, token]
        );
        return newUser.rows[0];
    } catch (err) {
        console.error(err.message);
    }
};

const register = async (request, response) => {
    const { username, userpassword } = request.body

    if (!username || !userpassword) {
        response.status(400).send("Username and Password is required to register!");
        return;
    }

    try {
        // check if user already exists
        const userExists = await getUserCount(username);
        if (userExists > 0) {
            response.status(400).send("Username already exists!");
            return;
        }
    } catch (err) {
        console.log("err: " + err);
    }

    try {
        encryptedPassword = await bcrypt.hash(userpassword, 10);
    } catch (err) {
        console.log("err: " + err);
    }

    const token = jwt.sign(
        { username: username },
        secretKey, // TODO: replace this with an actual secret key
        { expiresIn: "2h" }
    );

    try {
        const newUser = await saveUser(username, encryptedPassword, token);
        response.status(200).send({ token });
    } catch (err) {
        console.error(err.message);
    }
}

module.exports = {
    getApps,
    getAppById,
    createApp,
    updateApp,
    deleteApp,
    login,
    register
}