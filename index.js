const express = require("express");
const app = express();
const port = 3000;
const AWS = require("aws-sdk");
const config = new AWS.Config({
  accessKeyId: "AKIAZXHWI7BBAMDNUKVB",
  secretAccessKey: "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",
  region: "ap-southeast-1",
});
AWS.config = config;
const doc = new AWS.DynamoDB.DocumentClient();
const router = require("./route/route");

app.set("view engine", "ejs");
app.set("views", "./views");
router(app, doc);
//app.use("/", router);
// app.get("/", (req, res) => {
//   res.render("home");
// });

// app.get("/home", (req, res) => {
//   // res.send('Hello World!')
//   const params = {
//     TableName: "Paper",
//   };
//   doc.scan(params, (err, data) => {
//     res.send(data.Items);
//   });
// });
app.get("/trang/:sotrang", (req, res) => {
  // res.send('Hello World!')
  const params = {
    TableName: "Paper",
    FilterExpression: "#soTrang = :email",
    ExpressionAttributeNames: {
      "#soTrang": "soTrang",
    },
    ExpressionAttributeValues: {
      ":email": Number(req.params.sotrang),
    },
  };
  console.log(Number(req.params.sotrang));
  doc.scan(params, function (err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data);
      data.Items.forEach(function (element, index, array) {
        console.log("printing", element.soTrang);
      });
    }

    res.send(data);
  });
});
app.delete("/:id", (req, res) => {
  const id = req.params.id;
  const params = {
    TableName: "Paper",
    Key: { id: id },
  };

  doc.delete(params, (err, data) => {
    res.send("ok");
    console.log(err);
  });
});
app.post("/bao/:name", (req, res) => {
  const params = {
    TableName: "Paper",
    Item: {
      id: new Date().getTime() + "dangbuoi",
      tenBaiBao: req.params.name,
      tacGia: "but",
      isbn: 1,
      namXuatBan: 1111,
      soTrang: 40,
    },
  };

  doc.put(params, (err, data) => {
    res.send(data);
    console.log(err);
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
