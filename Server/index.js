const express = require("express");
const cors = require("cors");
const systemdb = require("./mysql");

const app = express();
app.use(cors());
app.use(express.json());

//新增使用者資訊
app.post("/updateUser", (req, res) => {
  console.log("updateUser", req.body);
  const users = req.body;
  const values = users.map((user) => [user.USER_ID, user.PASSWORD]);
  console.log("values", values);

  systemdb.query(
    "INSERT INTO user (USER_ID, PASSWORD) VALUES ?",
    [values],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to insert data." });
      } else {
        res.json({ message: "Values inserted successfully." }); // 回傳JSON物件
      }
    }
  );
});

//讀取使用者資訊
app.get("/getUser", (req, res) => {
  systemdb.query("SELECT * FROM user", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

//新增商品資訊
app.post("/updateItems", (req, res) => {
//   console.log("updateProduct", req.body);
  const products = req.body;
  const values = products.map((product) => [
    product.ITEM_ID,
    product.ITEM_MODEL,
    product.ITEM_DESC,
    product.ITEM_CATA,
    product.ITEM_PRICE,
  ]);
  console.log("values", values);

  systemdb.query(
    "INSERT INTO iteminformation (ITEM_ID, ITEM_MODEL, ITEM_DESC, ITEM_CATA, ITEM_PRICE) VALUES ?",
    [values],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to insert data." });
      } else {
        res.json({ message: "Values inserted successfully." }); // 回傳JSON物件
      }
    }
  );
});

//讀取商品資訊
app.get("/getItems", (req, res) => {
  systemdb.query("SELECT * FROM iteminformation", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.listen(4000, () => {
  console.log("在4000啟動!!!!");
});
