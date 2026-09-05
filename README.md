# The Nervous System — Project 2

A small, dependency-light REST API built with Node.js and Express, following REST and HTTP fundamentals: correct verb semantics, resource-based naming, server-side validation, and a full, meaningful set of HTTP status codes.

## Overview

This is the backend counterpart to [Project 1](../decodelabs-project-1) — the responsive portfolio frontend. Project 1's contact form currently hands off to `mailto:`; this API is the real server-side endpoint that form is meant to call: submit a message, and manage submitted messages through a small CRUD surface.

**Resource:** `Contact` — a message submitted through a contact form.

```json
{
  "id": 1,
  "name": "Priya Sharma",
  "email": "priya.sharma@example.com",
  "message": "Loved your portfolio!",
  "status": "new",
  "createdAt": "2026-09-03T15:12:12.192Z"
}
```

## Design principles this API follows

- **Resources are nouns, methods are verbs** — `GET /api/contacts`, never `GET /api/getContacts`
- **Never trust the client** — every request body is validated (type, format, length) before it reaches the data layer; malformed JSON is caught and returned as `400`, not a crash
- **Use the semantic status code, don't force the client to guess** — `201` on creation (with a `Location` header), `204` on deletion, `404` for missing resources, `400` for validation failures
- **Statelessness** — no server-side session; every request is handled independently
- **Documented like your users are other developers** — every endpoint below has an executable `curl` example

## Tech stack

- Node.js
- Express 5
- No database — an in-memory store, matching this project's "simple backend API" scope (Project 1 was the interface, Project 2 is the logic; persistence is a later milestone)
- Node's built-in test runner (`node:test`) for the test suite — no test framework dependency

## Getting started

```bash
npm install
npm start          # runs on http://localhost:4000
```

For auto-restart on file changes during development:

```bash
npm run dev
```

Run the test suite:

```bash
npm test
```

## API reference

Base URL: `http://localhost:4000/api`

### Health check

```
GET /api/health
```

```bash
curl http://localhost:4000/api/health
```

```json
{ "status": "ok", "uptimeSeconds": 42, "timestamp": "2026-09-05T15:12:13.151Z" }
```

### List messages

```
GET /api/contacts
GET /api/contacts?status=new
```

```bash
curl http://localhost:4000/api/contacts
```

```json
{ "count": 2, "data": [ { "id": 1, "name": "...", "...": "..." } ] }
```

### Get one message

```
GET /api/contacts/:id
```

```bash
curl http://localhost:4000/api/contacts/1
```

Returns `404` if the id doesn't exist:

```json
{ "error": { "status": 404, "message": "No contact message with id 999" } }
```

### Create a message

```
POST /api/contacts
```

```bash
curl -X POST http://localhost:4000/api/contacts \
  -H "Content-Type: application/json" \
  -d '{"name":"Jordan Lee","email":"jordan@example.com","message":"Great work on this project!"}'
```

Validation rules:

| Field   | Rule                                  |
|---------|----------------------------------------|
| name    | string, 2–100 characters               |
| email   | string, valid email format             |
| message | string, 10–2000 characters             |

On success, returns `201 Created` with a `Location` header pointing to the new resource. On failure, returns `400` with every violated rule listed:

```json
{
  "error": {
    "status": 400,
    "message": "Validation failed",
    "details": ["email must be a valid email address"]
  }
}
```

### Update a message's status

```
PUT /api/contacts/:id
```

```bash
curl -X PUT http://localhost:4000/api/contacts/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"read"}'
```

`status` must be `"new"` or `"read"`. Returns `404` if the id doesn't exist.

### Delete a message

```
DELETE /api/contacts/:id
```

```bash
curl -X DELETE http://localhost:4000/api/contacts/1
```

Returns `204 No Content` on success, `404` if the id doesn't exist.

## Status codes used

| Code | Meaning               | When                                      |
|------|-----------------------|--------------------------------------------|
| 200  | OK                    | Successful GET or PUT                      |
| 201  | Created               | Successful POST                            |
| 204  | No Content            | Successful DELETE                          |
| 400  | Bad Request           | Failed validation, malformed JSON          |
| 404  | Not Found             | Unknown id, or unknown route               |
| 500  | Internal Server Error | Unexpected server fault                    |

## Error shape

Every error response — validation failures, missing resources, unknown routes, and unexpected server errors — follows the same shape:

```json
{ "error": { "status": 400, "message": "...", "details": ["optional array of specifics"] } }
```

## Project structure

```
.
├── server.js
├── src/
│   ├── app.js                     # Express app: middleware + route mounting
│   ├── routes/contacts.routes.js
│   ├── controllers/contacts.controller.js
│   ├── middleware/
│   │   ├── cors.js
│   │   ├── logger.js
│   │   ├── validateContact.js
│   │   └── errorHandler.js
│   ├── data/store.js              # in-memory data layer
│   └── utils/ApiError.js
└── test/contacts.test.js
```
