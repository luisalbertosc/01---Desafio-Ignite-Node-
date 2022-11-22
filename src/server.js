const app = require('./');
const PORT = 3333;


app.listen(PORT, (err) => {
  if (err) {
      console.log(err);
  }
  else { console.log("server running on port:", PORT) }

})