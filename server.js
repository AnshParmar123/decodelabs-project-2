const app = require('./src/app');

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Project 2 API listening on http://localhost:${PORT}`);
});
