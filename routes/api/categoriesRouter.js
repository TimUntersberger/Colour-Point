import express from "express";

const router = express.Router();

router
    .route("/")
    .get((req, res) => {
        connection.query("select * from categories", (err, result) => {
            if (err) console.error(err);
            res.json({
                categories: result
            });
        });
    })
    .post((req, res) => {
        const data = [req.body.name].map(val => "'" + val + "'").join(", ");
        connection.query(
            "insert into categories values(0, " + data + ")",
            (err, result) => {
                if (err) console.log(err);
                io.emit("new category", {
                    name: req.body.name,
                    id: result.insertId
                });
                res.json({
                    message: "ok"
                });
            }
        );
    });

router.route("/:id")
    .delete((req, res) => {
        connection.query(
            "delete from categories where id=" + req.params.id,
            (err, result) => {
                if (err) console.log(err);
                io.emit("delete category", {
                    id: req.params.id
                });
                res.json({
                    message: "ok"
                });
            }
        );
    })
    .patch((req, res) => {
        let set = "set ";
        if (req.body.name) set += "name='" + req.body.name + "' ";
        if (set !== "set ")
            connection.query(
                "update categories " + set + "where id=" + req.params.id,
                (err, result) => {
                    if (err) console.error(err);
                    req.body.id = req.params.id;
                    io.emit("update categories", req.body);
                    res.json({});
                }
            )
    })


export default router;
