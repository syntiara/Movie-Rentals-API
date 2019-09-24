
import { secretKey } from '../../../server/config';
import { User } from '../../../server/models/user';
import { verify } from 'jsonwebtoken';
import { models } from '../../mocks/model';

describe('user.generateAuthToken', () => {
  it('should return a valid JWT', () => {
    const user = new User(models.userPayload);
    const token = user.generateAuthToken();
    const decoded = verify(token, secretKey);
    expect(decoded).toMatchObject(models.userPayload);
  });
});