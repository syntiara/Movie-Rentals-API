
const { secretKey } = require('../../../config');
const {User} = require('../../../models/user');
const jwt = require('jsonwebtoken');
const {models} = require('../../mocks/model');

describe('user.generateAuthToken', () => {
  it('should return a valid JWT', () => {
    const user = new User(models.userPayload);
    const token = user.generateAuthToken();
    const decoded = jwt.verify(token, secretKey);
    expect(decoded).toMatchObject(models.userPayload);
  });
});