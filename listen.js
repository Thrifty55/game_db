const app = require("./app");
const port = 9092;

app.listen(port, () => {
  console.log("listening on port " + port);
});