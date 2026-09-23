import { after, before, beforeEach, test } from 'node:test';
import { readFileSync } from 'node:fs';
import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { ref, uploadBytes, deleteObject, getBytes } from 'firebase/storage';

let env;
const product = { DataId: 'sku-1', name: 'Product', price: 12.5, photoUrl: 'https://example.com/product.png' };
const db = (uid, claims) => (uid ? env.authenticatedContext(uid, claims) : env.unauthenticatedContext()).firestore();
before(async () => {
  env = await initializeTestEnvironment({ projectId: 'demo-ecommerce',
    firestore: { host: '127.0.0.1', port: 8080, rules: readFileSync('../../firestore.rules', 'utf8') },
    storage: { host: '127.0.0.1', port: 9199, rules: readFileSync('../../storage.rules', 'utf8') }
  });
});
beforeEach(async () => { await env.clearFirestore(); await env.clearStorage(); });
after(async () => { if (env) await env.cleanup(); });

test('default deny protects unknown documents', async () => {
  await assertFails(getDoc(doc(db('alice'), 'private/config')));
  await assertFails(setDoc(doc(db('admin', { admin: true }), 'private/config'), { value: 1 }));
});
test('catalog is public to read and only boolean admin claim can mutate it', async () => {
  for (const path of ['goods/Bags/item/sku-1', 'category/bags']) {
    await assertFails(setDoc(doc(db(), path), product));
    await assertFails(setDoc(doc(db('alice'), path), product));
    await assertFails(setDoc(doc(db('fake', { admin: 'true' }), path), product));
    await assertSucceeds(setDoc(doc(db('admin', { admin: true }), path), product));
    await assertSucceeds(getDoc(doc(db(), path)));
    await assertFails(deleteDoc(doc(db('alice'), path)));
    await assertSucceeds(deleteDoc(doc(db('admin', { admin: true }), path)));
  }
});
test('cart supports only UID owner reads and bounded quantity changes', async () => {
  const path = 'users/alice/cart/line';
  await assertSucceeds(setDoc(doc(db('alice'), path), { ...product, amount: 2 }));
  await assertSucceeds(getDocs(collection(db('alice'), 'users/alice/cart')));
  for (const outsider of [undefined, 'bob']) {
    await assertFails(getDoc(doc(db(outsider), path)));
    await assertFails(setDoc(doc(db(outsider), path), { ...product, amount: 1 }));
    await assertFails(updateDoc(doc(db(outsider), path), { amount: 3 }));
    await assertFails(deleteDoc(doc(db(outsider), path)));
  }
  await assertSucceeds(updateDoc(doc(db('alice'), path), { amount: 99 }));
  for (const amount of [0, -1, 100, 1.5, '2']) {
    await assertFails(updateDoc(doc(db('alice'), path), { amount }));
  }
  await assertFails(updateDoc(doc(db('alice'), path), { price: 0 }));
  await assertFails(setDoc(doc(db('alice'), 'users/alice/cart/bad'), { ...product, amount: 1, trusted: true }));
  await assertSucceeds(deleteDoc(doc(db('alice'), path)));
});
test('wishlist isolates owners and rejects unrelated fields', async () => {
  const path = 'users/alice/wishlist/line';
  await assertSucceeds(setDoc(doc(db('alice'), path), product));
  await assertSucceeds(getDoc(doc(db('alice'), path)));
  await assertFails(getDoc(doc(db('bob'), path)));
  await assertFails(setDoc(doc(db(), path), product));
  await assertFails(setDoc(doc(db('bob'), path), product));
  await assertFails(setDoc(doc(db('alice'), 'users/alice/wishlist/bad'), { ...product, amount: 1 }));
  await assertSucceeds(deleteDoc(doc(db('alice'), path)));
});
test('profile cannot grant itself privileges or access another user', async () => {
  await assertSucceeds(setDoc(doc(db('alice'), 'users/alice'), { name: 'Alice', phone: '123' }));
  await assertFails(updateDoc(doc(db('alice'), 'users/alice'), { admin: true }));
  await assertFails(getDoc(doc(db('bob'), 'users/alice')));
  await assertFails(setDoc(doc(db('bob'), 'users/alice'), { name: 'Bob', phone: '123' }));
});
test('orders are owner readable and client creation, pricing and status mutation are denied', async () => {
  await env.withSecurityRulesDisabled(context => setDoc(doc(context.firestore(), 'orders/order-1'), { userId: 'alice', total: 100, status: 'Pending' }));
  await assertSucceeds(getDoc(doc(db('alice'), 'orders/order-1')));
  await assertSucceeds(getDocs(query(collection(db('alice'), 'orders'), where('userId', '==', 'alice'))));
  await assertFails(getDocs(collection(db('alice'), 'orders')));
  await assertFails(getDoc(doc(db('bob'), 'orders/order-1')));
  await assertFails(setDoc(doc(db('alice'), 'orders/new'), { userId: 'alice', total: 0 }));
  await assertFails(updateDoc(doc(db('alice'), 'orders/order-1'), { status: 'Delivered' }));
  await assertFails(updateDoc(doc(db('admin', { admin: true }), 'orders/order-1'), { total: 0 }));
});
test('storage allows only admin catalog images and denies unknown locations', async () => {
  const admin = env.authenticatedContext('admin', { admin: true }).storage();
  const customer = env.authenticatedContext('alice').storage();
  const guest = env.unauthenticatedContext().storage();
  const bytes = new Uint8Array([1, 2, 3]);
  await assertFails(uploadBytes(ref(customer, 'goods/item'), bytes, { contentType: 'image/png' }));
  await assertSucceeds(uploadBytes(ref(admin, 'goods/item'), bytes, { contentType: 'image/png' }));
  await assertSucceeds(getBytes(ref(guest, 'goods/item')));
  await assertFails(uploadBytes(ref(admin, 'goods/script'), bytes, { contentType: 'text/html' }));
  await assertFails(uploadBytes(ref(admin, 'private/item'), bytes, { contentType: 'image/png' }));
  await assertFails(uploadBytes(ref(admin, 'goods/large'), new Uint8Array(5 * 1024 * 1024 + 1), { contentType: 'image/png' }));
  await assertFails(deleteObject(ref(customer, 'goods/item')));
  await assertSucceeds(deleteObject(ref(admin, 'goods/item')));
});
