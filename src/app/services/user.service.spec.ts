import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from './user.service';

describe('UserService profile', () => {
  it('writes only display profile fields', async () => {
    const set = jasmine.createSpy('set').and.returnValue(Promise.resolve());
    const doc = jasmine.createSpy('doc').and.returnValue({ set });
    const service = new UserService({ doc } as unknown as AngularFirestore);
    await service.addNewUser('alice', 'Alice', '123');
    expect(doc).toHaveBeenCalledWith('users/alice');
    expect(set).toHaveBeenCalledWith({ name: 'Alice', phone: '123' });
  });
});
