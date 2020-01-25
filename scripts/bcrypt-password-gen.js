var bcrypt = require("bcrypt");
bcrypt.hash("thisisunsafe", 10, function(err, hash) {
  console.log(hash);
});
