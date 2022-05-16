const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const jwt = require("jsonwebtoken");

const db = require("../lib/db");
const userMiddleware = require("../middleware/users");

router.get("/", (req, res) => {
  res.send("<h1>Hello</h1>");
});

router.post("/sign-up", userMiddleware.validateRegister, (req, res, next) => {
  db.query(
    `SELECT * FROM users WHERE LOWER(username) = LOWER(${db.escape(
      req.body.username
    )});`,

    (err, result) => {
      //error
      if (result.length) {
        return res.status(409).send({ msg: "This username already in use!  " });
      } else {
        //username not in user
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).send({
              msg: err,
            });
          } else {
            db.query(
              `INSERT INTO users (id, username, password, registered) VALUES ('${uuid.v4()}', ${db.escape(
                req.body.username
              )}, ${db.escape(hash)}, now())`,
              (err, result) => {
                if (err) {
                  res.status(400).send({
                    msg: err,
                  });
                  throw err;
                }
                console.log(result);
                return res.status(201).send({
                  msg: "Registered!",
                });
              }
            );
          }
        });
      }
    }
  );
});

router.post("/login", (req, res, next) => {
  db.query(
    `SELECT * FROM users WHERE username = ${db.escape(req.body.username)};`,
    (err, result) => {
      if (err) {
        res.status(400).send({
          msg: err,
        });
        throw err;
      }

      if (!result.length) {
        return res.status(401).send({
          msg: "Username or password is incorrect",
        });
      }

      bcrypt.compare(
        req.body.password,
        result[0]["password"],
        (bErr, bResult) => {
          if (bErr) {
            res.status(401).send({
              msg: "Username or password is incorrect!",
            });
            throw bErr;
          }

          if (bResult) {
            //password match
            const token = jwt.sign(
              {
                username: result[0].username,
                userId: result[0].id,
              },
              "SECRETKEY",
              {
                expiresIn: "7d",
              }
            );

            db.query(
              `UPDATE users SET last_login = now() WHERE id = ${result[0].id}`
            );
            return res.status(200).send({
              msg: "Logged in!",
              token,
              user: result[0],
            });
          }
          return res.status(401).send({
            msg: "Username or password incorrect!",
          });
        }
      );
    }
  );
});

router.put("/password-update", (req, res) => {
  db.query(
    `UPDATE users SET password=${db.escape(
      req.body.password
    )} WHERE username =${db.escape(req.body.username)} `,
    (err, result) => {
      if (err) {
        throw err;
      }
      return res.send({
        status: 200,
        msg: "password updated",
      });
    }
  );
});

router.delete("/delete-user/:username", (req, res) => {
  console.log(req.params);
  console.log(req.query);
  db.query(
    `DELETE FROM users WHERE username =${db.escape(req.params.username)}`,
    (err, result) => {
      if (err) {
        throw err;
      }
      console.log(req.query);
      return res.send({
        status: 200,
        msg: "User Deleted..!",
        deleted_user: req.body.username,
      });
    }
  );
});

router.get("/secret-route", userMiddleware.isLoggedIn, (req, res, next) => {
  console.log(req.userData);
  res.send("This is the secret content. Only logged users can see that");
});

router.get("/getAllUsers", (req, res, next) => {
  db.query("SELECT * FROM users", (err, data) => {
    if (err) {
      throw err;
    }
    return res.status(200).send({
      data: data,
      msg: "Success",
      status: 200,
    });
  });
});

module.exports = router;
