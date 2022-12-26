process.env.NODE_ENV = "test";

const UserModel = require("../modules/medicine/medicine");
//Require the dev-dependencies
const mongoose = require("mongoose");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index");
const should = chai.should();

chai.use(chaiHttp);
describe("auth", () => {
  describe("/POST login", () => {
    it("Login with admin", (done) => {
      let user = {
        username: "admin",
        password: "admin1234",
      };
      chai
        .request(server)
        .post("/api/auth/login")
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          done();
        });
    });
  });

  describe("/POST forgot password", () => {
    it("Forgot password with mail", (done) => {
      let user = {
        email: "namnthe141488@fpt.edu.vn",
      };
      chai
        .request(server)
        .post("/api/auth/forgotPassword")
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });

  describe("/GET verify", () => {
    it("Get user if they login successful", (done) => {
      let user = {
        username: "admin",
        password: "admin1234",
      };
      chai
        .request(server)
        .post("/api/auth/login")
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          let token = res.body.data.token;
          chai
            .request(server)
            .get("/api/auth/verify")
            .set({ "authorization": token })
            .send(user)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.data.should.be.a("object");
              res.body.data.username.should.be.equal("admin");
              done();
            });
        });
    });
  });
});
