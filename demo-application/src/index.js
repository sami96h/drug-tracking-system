const app = require('./app');

const port = app.get('port');
const create= require('../create')

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is listening at http://localhost:${port}`);
});

