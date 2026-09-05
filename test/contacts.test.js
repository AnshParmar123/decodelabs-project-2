const test = require('node:test');
const assert = require('node:assert/strict');
const app = require('../src/app');

let server;
let baseUrl;

test.before(() => {
  server = app.listen(0);
  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

test.after(() => {
  server.close();
});

test('GET /api/health returns 200 with an ok status', async () => {
  const res = await fetch(`${baseUrl}/api/health`);
  const body = await res.json();

  assert.equal(res.status, 200);
  assert.equal(body.status, 'ok');
});

test('GET /api/contacts returns the seeded list', async () => {
  const res = await fetch(`${baseUrl}/api/contacts`);
  const body = await res.json();

  assert.equal(res.status, 200);
  assert.ok(Array.isArray(body.data));
  assert.ok(body.count >= 2);
});

test('POST /api/contacts creates a message and returns 201', async () => {
  const payload = {
    name: 'Test Reviewer',
    email: 'reviewer@example.com',
    message: 'This is a test message long enough to pass validation.',
  };

  const res = await fetch(`${baseUrl}/api/contacts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const body = await res.json();

  assert.equal(res.status, 201);
  assert.equal(body.data.name, payload.name);
  assert.equal(body.data.status, 'new');
  assert.ok(res.headers.get('location').startsWith('/api/contacts/'));
});

test('POST /api/contacts rejects an invalid email with 400', async () => {
  const res = await fetch(`${baseUrl}/api/contacts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Bad Email',
      email: 'not-an-email',
      message: 'This message is long enough to pass the length check.',
    }),
  });
  const body = await res.json();

  assert.equal(res.status, 400);
  assert.ok(body.error.details.some((d) => d.includes('email')));
});

test('GET /api/contacts/:id returns 404 for an unknown id', async () => {
  const res = await fetch(`${baseUrl}/api/contacts/999999`);
  assert.equal(res.status, 404);
});

test('PUT /api/contacts/:id updates status to read', async () => {
  const created = await fetch(`${baseUrl}/api/contacts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Status Update Test',
      email: 'status@example.com',
      message: 'Checking that status updates persist correctly.',
    }),
  }).then((r) => r.json());

  const res = await fetch(`${baseUrl}/api/contacts/${created.data.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'read' }),
  });
  const body = await res.json();

  assert.equal(res.status, 200);
  assert.equal(body.data.status, 'read');
});

test('DELETE /api/contacts/:id removes the message and returns 204', async () => {
  const created = await fetch(`${baseUrl}/api/contacts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Delete Test',
      email: 'delete@example.com',
      message: 'This message will be deleted immediately after creation.',
    }),
  }).then((r) => r.json());

  const res = await fetch(`${baseUrl}/api/contacts/${created.data.id}`, { method: 'DELETE' });
  assert.equal(res.status, 204);

  const getRes = await fetch(`${baseUrl}/api/contacts/${created.data.id}`);
  assert.equal(getRes.status, 404);
});

test('unknown route returns a 404 in the standard error shape', async () => {
  const res = await fetch(`${baseUrl}/api/does-not-exist`);
  const body = await res.json();

  assert.equal(res.status, 404);
  assert.equal(body.error.status, 404);
});
