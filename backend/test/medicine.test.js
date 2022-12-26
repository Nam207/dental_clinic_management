process.env.NODE_ENV = "test";

const MedicineModel = require("../modules/medicine/medicine");
//Require the dev-dependencies
const mongoose = require("mongoose");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index");
const should = chai.should();

chai.use(chaiHttp);
describe("medicine", () => {
  describe("/POST medicine", () => {
    beforeEach((done) => {
      MedicineModel.remove({}, (err) => {
        done();
      });
    });
    it("Add a SINGLE medicine on /api/medicine POST", (done) => {
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
          let medicine = {
            name: "sp1123",
            quantity: 2,
            price: 12,
            purchasePrice: 11,
            effect: "gây tê",
            usage: "uống",
            contraindication: "cho trẻ em",
          };
          chai
            .request(server)
            .post("/api/medicine")
            .set({ authorization: token })
            .field("name", medicine.name)
            .field("quantity", medicine.quantity)
            .field("price", medicine.price)
            .field("purchasePrice", medicine.purchasePrice)
            .field("effect", medicine.effect)
            .field("usage", medicine.usage)
            .field("contraindication", medicine.contraindication)
            .attach(
              "imageUrl",
              "C:/Users/Lenovo/OneDrive/Desktop/dental_clinic_management/backend/pdfs/icon.jpg"
            )
            .end((err, res) => {
              res.should.have.status(200);
              res.body.success.should.be.equal(1);
              res.body.data.should.be.a("object");
              res.body.data.name.should.be.equal("sp1123");
              done();
            });
        });
    });
  });

  describe("/PUT medicine", () => {
    it("Update a SINGLE medicine on /api/medicine PUT", (done) => {
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
          let medicine = {
            name: "newName",
            quantity: 2,
            price: 15,
            purchasePrice: 14,
            effect: "giảm đau",
            usage: "xịt",
            contraindication: "cho trẻ em",
          };
          chai
            .request(server)
            .put("/api/medicine/SP_0000000001")
            .set({ authorization: token })
            .field("name", medicine.name)
            .field("quantity", medicine.quantity)
            .field("price", medicine.price)
            .field("purchasePrice", medicine.purchasePrice)
            .field("effect", medicine.effect)
            .field("usage", medicine.usage)
            .field("contraindication", medicine.contraindication)
            .field("imageUrl", "1111111")
            .end((err, res) => {
              res.should.have.status(200);
              res.body.success.should.be.equal(1);
              res.body.data.should.be.a("object");
              res.body.data.name.should.be.equal("newName");
              done();
            });
        });
    });
  });

  describe("/PUT medicine", () => {
    it("Update Status a SINGLE medicine on /api/medicine/ PUT", (done) => {
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
            .put("/api/medicine/SP_0000000001/true")
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

  describe("/GET medicine", () => {
    it("Get a SINGLE medicine on /api/medicine GET", (done) => {
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
            .get("/api/medicine/SP_0000000001")
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

  describe("/GET all medicine", () => {
    it("Get ALL medicines on /api/medicine GET", (done) => {
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
            .get("/api/medicine")
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

  describe("/GET all medicine active", () => {
    it("Get ALL medicines ACTIVE on /api/medicine/activeMedicine GET", (done) => {
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
            .get("/api/medicine/activeMedicine")
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

  describe("/GET medicine check", () => {
    it("Check name of medicine EXIST or not on /api/medicine/checkName GET", (done) => {
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
            .get("/api/medicine/checkName/newName")
            .set({ authorization: token })
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a("object");
              res.body.success.should.be.equal(0);
              res.body.data.should.be.a("object");
              res.body.data.name.should.be.equal("newName");
              done();
            });
        });
    });
  });
});
