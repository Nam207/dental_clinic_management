process.env.NODE_ENV = "test";

const CustomerModel = require("../modules/customer/customer");
//Require the dev-dependencies
const mongoose = require("mongoose");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index");
const should = chai.should();

chai.use(chaiHttp);
describe("customer", () => {
  describe("/POST customer", () => {
    beforeEach((done) => {
      CustomerModel.remove({}, (err) => {
        done();
      });
    });
    it("Add a SINGLE customer on /api/customer POST", (done) => {
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
          let customer = {
            fullname: "Nguyễn Thành Long",
            phone: "0865576520",
            email: "manhlong6500@gmail.com",
            dateOfBirth: "2022-11-03T17:00:00.000Z",
            gender: 1,
            job: "IT",
            bloodGroup: "A",
            address: "Việt Trì",
            note: "Khách VIP",
            status: true,
            systemicMedicalHistory: [
              "63a6cd90545ee680719ff524",
              "63a6cd90545ee680719ff53e",
            ],
            dentalMedicalHistory: [
              "63a6cd90545ee680719ff513",
              "63a6cd90545ee680719ff528",
            ],
          };
          chai
            .request(server)
            .post("/api/customer")
            .set({ authorization: token })
            .send(customer)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.success.should.be.equal(1);
              res.body.data.should.be.a("object");
              res.body.data.fullname.should.be.equal("Nguyễn Thành Long");
              done();
            });
        });
    });
  });

  describe("/PUT customer", () => {
    it("Update a SINGLE customer on /api/customer PUT", (done) => {
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
          let customer = {
            fullname: "Nguyễn Thành Nam",
            phone: "0865576521",
            email: "namnthe141488@gmail.com",
            dateOfBirth: "2022-11-03T17:00:00.000Z",
            gender: 1,
            job: "IT",
            bloodGroup: "A",
            address: "Việt Trì",
            note: "Khách VIP",
            status: false,
            systemicMedicalHistory: [
              "63a6cd90545ee680719ff524",
              "63a6cd90545ee680719ff53e",
            ],
            dentalMedicalHistory: [
              "63a6cd90545ee680719ff513",
              "63a6cd90545ee680719ff528",
            ],
          };
          chai
            .request(server)
            .put("/api/customer/KH_0000000001")
            .set({ authorization: token })
            .send(customer)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.success.should.be.equal(1);
              res.body.data.should.be.a("object");
              res.body.data.fullname.should.be.equal("Nguyễn Thành Nam");
              done();
            });
        });
    });
  });

  describe("/PUT customer", () => {
    it("Update Status a SINGLE customer on /api/customer/ PUT", (done) => {
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
            .put("/api/customer/KH_0000000001/true")
            .set({ authorization: token })
            .end((err, res) => {
              res.should.have.status(200);
              res.body.success.should.be.equal(1);
              res.body.data.should.be.a("object");
              res.body.data.status.should.be.equal(true);
              done();
            });
        });
    });
  });

  describe("/PUT customer with medical", () => {
    it("Update history a SINGLE customer on /api/customer/updateCustomerWithMedical PUT", (done) => {
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
          let customer = {
            customerId: "KH_0000000001",
            systemicMedicalHistory: [
              "63a6cd90545ee680719ff53f",
              "63a6cd90545ee680719ff540",
            ],
            dentalMedicalHistory: [
              "63a6cd90545ee680719ff52a",
              "63a6cd90545ee680719ff528",
            ],
          };
          chai
            .request(server)
            .put("/api/customer/updateCustomerWithMedical")
            .set({ authorization: token })
            .send(customer)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.success.should.be.equal(1);
              res.body.data.should.be.a("object");
              done();
            });
        });
    });
  });

  describe("/GET customer", () => {
    it("Get a SINGLE customer on /api/customer GET", (done) => {
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
            .get("/api/customer/KH_0000000001")
            .set({ authorization: token })
            .end((err, res) => {
              res.should.have.status(200);
              res.body.success.should.be.equal(1);
              res.body.data.should.be.a("object");
              done();
            });
        });
    });
  });

  describe("/GET all customer", () => {
    it("Get ALL customer on /api/customer GET", (done) => {
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
            .get("/api/customer")
            .set({ authorization: token })
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a("object");
              res.body.success.should.be.equal(1);
              res.body.data.should.be.a("object");
              res.body.data.data.should.be.a("array");
              res.body.data.total.should.be.equal(1);
              done();
            });
        });
    });
  });

  describe("/GET all customer 2", () => {
    it("Get ALL customers WITHOUT paging on /api/customer/allCustomer GET", (done) => {
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
            .get("/api/customer/allCustomer")
            .set({ authorization: token })
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a("object");
              res.body.success.should.be.equal(1);
              res.body.data.should.be.a("array");
              done();
            });
        });
    });
  });

  describe("/GET all customers active", () => {
    it("Get ALL customers ACTIVE on /api/customer/activeCustomer GET", (done) => {
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
            .get("/api/customer/activeCustomer")
            .set({ authorization: token })
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a("object");
              res.body.success.should.be.equal(1);
              res.body.data.should.be.a("array");
              done();
            });
        });
    });
  });

  describe("/GET customers have birthday", () => {
    it("Get all customers have birthday on /api/customer/birthday GET", (done) => {
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
            .get("/api/customer/birthday")
            .set({ authorization: token })
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a("object");
              res.body.success.should.be.equal(1);
              done();
            });
        });
    });
  });

  describe("/GET check phone", () => {
    it("Get customer have this phone on /api/customer/checkPhone GET", (done) => {
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
            .get("/api/customer/checkPhone/0865576521")
            .set({ authorization: token })
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a("object");
              res.body.success.should.be.equal(0);
              res.body.data.phone.should.be.equal("0865576521");
              done();
            });
        });
    });
  });

  describe("/GET check email", () => {
    it("Get customer have this email on /api/customer/checkEmail GET", (done) => {
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
            .get("/api/customer/checkEmail/namnthe141488@gmail.com")
            .set({ authorization: token })
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a("object");
              res.body.success.should.be.equal(0);
              res.body.data.email.should.be.equal("namnthe141488@gmail.com");
              done();
            });
        });
    });
  });
});
