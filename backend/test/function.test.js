process.env.NODE_ENV = "test";

//Require the dev-dependencies
const mongoose = require("mongoose");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index");
const should = chai.should();

chai.use(chaiHttp);
describe("function", () => {
  describe("/GET function", () => {
    it("Get ALL function on /api/function GET", (done) => {
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
            .get("/api/function")
            .set({ authorization: token })
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a("object");
              res.body.success.should.be.equal(1);
              res.body.data.should.be.a("array");
              res.body.data.length.should.be.equal(6);
              done();
            });
        });
    });
  });
});
