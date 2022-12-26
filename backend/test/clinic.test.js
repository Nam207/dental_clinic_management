process.env.NODE_ENV = "test";

//Require the dev-dependencies
const mongoose = require("mongoose");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index");
const should = chai.should();

chai.use(chaiHttp);
describe("clinic", () => {
  describe("/GET clinic", () => {
    it("Get clinic on /api/clinic GET", (done) => {
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
            .get("/api/clinic")
            .set({ authorization: token })
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a("object");
              res.body.success.should.be.equal(1);
              res.body.data.should.be.a("array");
              res.body.data.length.should.be.equal(1);
              done();
            });
        });
    });
  });

  describe("/PUT clinic", () => {
    it("Update clinic on /api/clinic PUT", (done) => {
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
          let clinic = {
            name: "newName",
            phone: "0974485921",
            email: "namnthe141488@gmail.com",
            address: "Việt Trì, Phú Thọ",
            accountNumber: "BIDV Stk (không nhớ)",
          };
          chai
            .request(server)
            .put("/api/clinic")
            .set({ authorization: token })
            .field("name", clinic.name)
            .field("phone", clinic.phone)
            .field("email", clinic.email)
            .field("address", clinic.address)
            .field("accountNumber", clinic.accountNumber)
            .field("icon", "11111111")
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a("object");
              res.body.success.should.be.equal(1);
              res.body.data.should.be.a("object");
              done();
            });
        });
    });
  });
});
