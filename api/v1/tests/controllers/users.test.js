import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../app';

import { correctLogin, userLogin } from '../mockdata/userdata';

chai.use(chaiHttp);
let adminToken;
let userToken;

describe('Users', () => {
  before(async () => {
    const response = await chai
      .request(app)
      .post('/api/v1/auth/signin')
      .send(correctLogin);

    adminToken = response.body.data.token;

    const userResponse = await chai
      .request(app)
      .post('/api/v1/auth/signin')
      .send(userLogin);

    userToken = userResponse.body.data.token;
  });

  // describe('GET /users', () => {
  //   it('should return 403 if user is not an admin', async () => {
  //     const res = await chai.request(app)
  //       .get('/api/v1/users')
  //       .set('x-auth-token', userToken);
  //     expect(res).to.have.status(403);
  //     expect(res.body).to.have.property('error');
  //   });

  //   it('should return 400 for invalid token', async () => {
  //     const res = await chai.request(app)
  //       .get('/api/v1/users')
  //       .set('x-auth-token', 'hfhjshhdhhs');
  //     expect(res).to.have.status(400);
  //     expect(res.body).to.have.property('error');
  //   });

  //   it('should return 401 for missing token', async () => {
  //     const res = await chai.request(app)
  //       .get('/api/v1/users');
  //     expect(res).to.have.status(401);
  //     expect(res.body).to.have.property('data');
  //   });

  //   it('should get all users and return 200', async () => {
  //     const res = await chai.request(app)
  //       .get('/api/v1/users')
  //       .set('x-auth-token', adminToken);
  //     expect(res).to.have.status(200);
  //     expect(res.body).to.have.property('data');
  //   });
  // });
});