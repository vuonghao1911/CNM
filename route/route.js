const router = require("express").Router();
const muller = require("multer");
const convertFormToJson = muller();
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const { check, validationResult } = require("express-validator");

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
  router.post(
    "/addPaper",
    convertFormToJson.fields([]),
    urlencodedParser,
    [
      check("namePaper", "This Name must me 3+ characters long")
        .exists()
        .isLength({ min: 3 }),
      check("author", "Author is not valid").exists().isLength({ min: 3 }),
      check("isbn", "ISBN is XXX-XXX-XXX")
        .exists()
        .matches(/^[0-9]{3}-[0-9]{3}-[0-9]{3}$/),
      check("pageNumber", "Pages is Number ")
        .exists()
        .isInt({ min: 1, max: 1000 }),
      check("year", "Year is not valid")
        .exists()
        .isBefore(new Date().getFullYear().toString()),
    ],
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const alert = errors.array();
        return res.render("AddPaper", {
          alert,
        });
      } else {
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
      }
    }
  );

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
