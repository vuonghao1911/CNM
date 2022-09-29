const router = require("express").Router();
const muller = require("multer");
const convertFormToJson = muller();

function Router(app, doc) {
  //get home page
  router.get("/", (req, res) => {
    // res.send('Hello World!')
    const params = {
      TableName: "Paper",
    };
    doc.scan(params, (err, data) => {
      console.log(data.Items);
      return res.render("home", { data: data.Items });
    });
  });

  //get form add data
  router.get("/addPaper", (req, res) => {
    return res.render("AddPaper");
  });

  //post data to server
  router.post("/addPaper", convertFormToJson.fields([]), (req, res) => {
    const { namePaper, author, year, pageNumber, isbn } = req.body;
    console.log("data:%j ", req.body);
    //return res.redirect("/");
    const params = {
      TableName: "Paper",

      Item: {
        id: new Date().getTime() + "dangbuoi",
        tenBaiBao: namePaper,
        tacGia: author,
        isbn: isbn,
        namXuatBan: year,
        soTrang: pageNumber,
      },
    };

    doc.put(params, (err, data) => {
      if (err) {
        return res.send("false");
        console.log(err);
      } else {
        return res.redirect("/");
      }
    });
  });

  router.post("/delete", convertFormToJson.fields([]), (req, res) => {
    const id = req.body.id;
    console.log(id);
    const params = {
      TableName: "Paper",
      Key: { id: id },
    };

    doc.delete(params, (err, data) => {
      if (err) {
        console.log(err);
        return res.send(err);
      } else {
        // res.send("ok");
        return res.redirect("/");
      }
    });
  });

  return app.use("/", router);
}

//export default Router;
module.exports = Router;
