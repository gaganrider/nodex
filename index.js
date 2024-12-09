import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
import dbConnect from "./db/connection.js";
import server from "./utils/socket.js";
const port = process.env.PORT || 8000;
// import server from "./app.js";

dbConnect()
  .then(() =>
    server.listen(port,'0.0.0.0', () =>
      console.log("server is running smooth af on port", port)
    )
  )
  .catch((err) => console.log(err));
