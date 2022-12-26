process.env.NODE_ENV = "test";

const ProfileModel = require("../modules/profile/profile");
//Require the dev-dependencies
const mongoose = require("mongoose");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index");
const should = chai.should();

chai.use(chaiHttp);
describe("employee", () => {
  describe("/POST employee", () => {
    beforeEach((done) => {
      ProfileModel.remove({}, (err) => {
        done();
      });
    });
    it("Add a SINGLE employee on /api/profile POST", (done) => {
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
          let employee = {
            fullname: "Nguyễn Minh Toán",
            phone: "0974485920",
            email: "manhlong6500@gmail.com",
            address: "Hà Nội",
            workingDays: 20,
            salary: 200000,
            status: false,
            role: ["63a6cd90545ee680719ff50d", "63a6cd90545ee680719ff50e", "63a6cd90545ee680719ff50c"],
            schedule: [
                {
                    start_time_hours: 6,
                    start_time_minutes: 0,
                    end_time_hours: 18,
                    end_time_minutes: 59,
                    weekday: "monday"
                },
                {
                    start_time_hours: 6,
                    start_time_minutes: 0,
                    end_time_hours: 18,
                    end_time_minutes: 59,
                    weekday: "tuesday"
                },
                {
                    start_time_hours: 6,
                    start_time_minutes: 0,
                    end_time_hours: 18,
                    end_time_minutes: 59,
                    weekday: "wednesday"
                },
                {
                    start_time_hours: 6,
                    start_time_minutes: 0,
                    end_time_hours: 18,
                    end_time_minutes: 59,
                    weekday: "thursday"
                },
                {
                    start_time_hours: 6,
                    start_time_minutes: 0,
                    end_time_hours: 18,
                    end_time_minutes: 59,
                    weekday: "friday"
                },
                {
                    start_time_hours: 6,
                    start_time_minutes: 0,
                    end_time_hours: 18,
                    end_time_minutes: 59,
                    weekday: "saturday"
                },
                {
                    start_time_hours: 6,
                    start_time_minutes: 0,
                    end_time_hours: 18,
                    end_time_minutes: 59,
                    weekday: "sunday"
                }
            ],
          };
          chai
            .request(server)
            .post("/api/profile")
            .set({ authorization: token })
            .send(employee)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.success.should.be.equal(1);
              res.body.data.should.be.a("object");
              res.body.data.fullname.should.be.equal("Nguyễn Minh Toán");
              done();
            });
        });
    });
  });

  describe("/PUT employee", () => {
    it("Update a SINGLE employee on /api/profile PUT", (done) => {
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
          let employee = {
            fullname: "Đỗ Huy Hùng",
            phone: "0974485920",
            email: "manhlong6500@gmail.com",
            address: "Hà Nội",
            workingDays: 22,
            salary: 500000,
            status: false,
            role: ["63a6cd90545ee680719ff50d", "63a6cd90545ee680719ff50e", "63a6cd90545ee680719ff50c"],
            schedule: [
                {
                    start_time_hours: 6,
                    start_time_minutes: 0,
                    end_time_hours: 18,
                    end_time_minutes: 59,
                    weekday: "monday"
                },
                {
                    start_time_hours: 6,
                    start_time_minutes: 0,
                    end_time_hours: 18,
                    end_time_minutes: 59,
                    weekday: "tuesday"
                },
                {
                    start_time_hours: 6,
                    start_time_minutes: 0,
                    end_time_hours: 18,
                    end_time_minutes: 59,
                    weekday: "wednesday"
                },
                {
                    start_time_hours: 6,
                    start_time_minutes: 0,
                    end_time_hours: 18,
                    end_time_minutes: 59,
                    weekday: "thursday"
                },
                {
                    start_time_hours: 6,
                    start_time_minutes: 0,
                    end_time_hours: 18,
                    end_time_minutes: 59,
                    weekday: "friday"
                },
                {
                    start_time_hours: 6,
                    start_time_minutes: 0,
                    end_time_hours: 18,
                    end_time_minutes: 59,
                    weekday: "saturday"
                },
                {
                    start_time_hours: 6,
                    start_time_minutes: 0,
                    end_time_hours: 18,
                    end_time_minutes: 59,
                    weekday: "sunday"
                }
            ],
          };
          chai
            .request(server)
            .put("/api/profile/NV_0000000001")
            .set({ authorization: token })
            .send(employee)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.success.should.be.equal(1);
              res.body.data.should.be.a("object");
              res.body.data.fullname.should.be.equal("Đỗ Huy Hùng");
              done();
            });
        });
    });
  });

  describe("/PUT employee", () => {
    it("Update Status a SINGLE employee on /api/profile/ PUT", (done) => {
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
            .put("/api/profile/NV_0000000001/true")
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

  describe("/PUT profile by employee", () => {
    it("Update PROFILE by employee on api/profile/editProfile PUT", (done) => {
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
          let employee = {
            fullname: "Nguyễn Thành Nam",
            phone: "0974485921",
            email: "namnthe141488@gmail.com",
            address: "Hà Nội",
          }
          chai
            .request(server)
            .put("/api/profile/editProfile/NV_0000000001")
            .set({ authorization: token })
            .send(employee)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.success.should.be.equal(1);
              res.body.data.should.be.a("object");
              done();
            });
        });
    });
  });

  describe("/GET employee", () => {
    it("Get a SINGLE employee on /api/profile GET", (done) => {
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
            .get("/api/profile/NV_0000000001")
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

  describe("/GET all employee", () => {
    it("Get ALL employee on /api/profile GET", (done) => {
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
            .get("/api/profile")
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

  describe("/GET all employee 2", () => {
    it("Get ALL employees WITHOUT paging on /api/profile/allEmployee GET", (done) => {
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
            .get("/api/profile/allEmployee")
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

  describe("/GET all doctor", () => {
    it("Get ALL doctor ACTIVE on /api/profile/getDoctor GET", (done) => {
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
            .get("/api/profile/getDoctor")
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

  describe("/GET all doctor working today", () => {
    it("Get ALL doctor ACTIVE and working TODAY on /api/profile/getDoctorToday GET", (done) => {
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
            .get("/api/profile/getDoctorToday")
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
    it("Get employee have this phone on /api/profile/checkPhone GET", (done) => {
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
            .get("/api/profile/checkPhone/0974485921")
            .set({ authorization: token })
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a("object");
              res.body.success.should.be.equal(0);
              res.body.data.phone.should.be.equal("0974485921");
              done();
            });
        });
    });
  });

  describe("/GET check email", () => {
    it("Get employee have this email on /api/profile/checkEmail GET", (done) => {
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
            .get("/api/profile/checkEmail/namnthe141488@gmail.com")
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
