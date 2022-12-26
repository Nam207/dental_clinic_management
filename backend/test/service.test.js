process.env.NODE_ENV = "test";

const ServerModel = require("../modules/service/service");
//Require the dev-dependencies
const mongoose = require("mongoose");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index");
const should = chai.should();

chai.use(chaiHttp);
describe("service", () => {
  describe("/POST service", () => {
    beforeEach((done) => {
      ServerModel.remove({}, (err) => {
        done();
      });
    });
    it("Add a SINGLE service on /api/service POST", (done) => {
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
          let service = {
            name: "Dịch vụ 1",
            time: 10,
            price: 12,
            note: "quan trọng",
            status: false,
          };
          chai
            .request(server)
            .post("/api/service")
            .set({ authorization: token })
            .field("name", service.name)
            .field("time", service.time)
            .field("price", service.price)
            .field("note", service.note)
            .field("status", service.status)
            .attach(
              "imageUrl",
              "C:/Users/Lenovo/OneDrive/Desktop/dental_clinic_management/backend/pdfs/icon.jpg"
            )
            .end((err, res) => {
              res.should.have.status(200);
              res.body.success.should.be.equal(1);
              res.body.data.should.be.a("object");
              res.body.data.name.should.be.equal("Dịch vụ 1");
              done();
            });
        });
    });
  });

  describe("/PUT service", () => {
    it("Update a SINGLE service on /api/service PUT", (done) => {
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
          let service = {
            name: "newService",
            time: 50,
            price: 120000,
            note: "quan trọng 2",
            status: false,
          };
          chai
            .request(server)
            .put("/api/service/DV_0000000001")
            .set({ authorization: token })
            .field("name", service.name)
            .field("time", service.time)
            .field("price", service.price)
            .field("note", service.note)
            .field("status", service.status)
            .field("imageUrl", "1111111")
            .end((err, res) => {
              res.should.have.status(200);
              res.body.success.should.be.equal(1);
              res.body.data.should.be.a("object");
              done();
            });
        });
    });
  });

  describe("/PUT service", () => {
    it("Update Status a SINGLE service on /api/service/ PUT", (done) => {
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
            .put("/api/service/DV_0000000001/true")
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

  describe("/GET service", () => {
    it("Get a SINGLE service on /api/service GET", (done) => {
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
            .get("/api/service/DV_0000000001")
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

  describe("/GET all service", () => {
    it("Get ALL services on /api/service GET", (done) => {
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
            .get("/api/service")
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

  describe("/GET all service 2", () => {
    it("Get ALL services WITHOUT paging on /api/service/allService GET", (done) => {
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
            .get("/api/service/allService")
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

  describe("/GET all services active", () => {
    it("Get ALL services ACTIVE on /api/service/activeService GET", (done) => {
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
            .get("/api/service/activeService")
            .set({ authorization: token })
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a("object");
              res.body.success.should.be.equal(1);
              res.body.data.data.should.be.a("array");
              res.body.data.total.should.be.equal(1);
              done();
            });
        });
    });
  });

  describe("/GET medicine by service", () => {
    it("Get all prescription in this service on /api/service/prescription GET", (done) => {
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
            .get("/api/service/prescription")
            .set({ authorization: token })
            .end((err, res) => {
              res.should.have.status(400);
              res.body.should.be.a("object");
              done();
            });
        });
    });
  });
});
