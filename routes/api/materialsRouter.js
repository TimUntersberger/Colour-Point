import express from "express";

const router = express.Router();

router
    .route("/")
    .get((req, res) => {
        connection.query(
            req.query.id != 0
                ? "SELECT m.id, m.name, m.format, m.quantity, m.minquantity FROM categories c INNER JOIN products m ON c.id = m.categorie_id WHERE m.categorie_id=" +
                  req.query.id
                : "SELECT * FROM products",
            (err, result) => {
                if (err) console.log(err);
                res.send({
                    materials: result
                });
            }
        );
    })
    .post((req, res) => {
        if (req.body.id === undefined) {
            res.send({});
            return;
        }
        const defaultValues = [0, "Name", "Format", 0, 0];
        // transform data into value string
        const data = [...defaultValues, req.body.id]
            .map(val => "'" + val + "'")
            .join(", ");
        connection.query(
            "insert into products(`id`,`name`,`format`,`quantity`,`minquantity`,`categorie_id`) values(" +
                data +
                ")",
            (err, result) => {
                if (err) console.log(err);
                io.emit("new material", {
                    name: defaultValues[1],
                    format: defaultValues[2],
                    quantity: defaultValues[3],
                    minquantity: defaultValues[4],
                    id: result.insertId,
                    categorie_id: req.body.id
                });
                res.send({});
            }
        );
    });
router
    .route("/:id")
    .delete((req, res) => {
        connection.query(
            "delete from products where id=" + req.params.id,
            (err, result) => {
                if (err) console.error(err);
                io.emit("delete material", {
                    id: req.params.id,
                    category_id: req.body.category_id
                });
                res.send({});
            }
        );
    })
    .patch((req, res) => {
        let set = "set ";
        if (req.body.quantity)
            set += "quantity=quantity+" + parseInt(req.body.quantity) + " ";
        if (req.body.minquantity)
            set += "minquantity=" + req.body.minquantity + " ";
        if (req.body.name) set += "name='" + req.body.name + "' ";
        if (req.body.format) set += "format='" + req.body.format + "' ";
        if (set !== "set ")
            connection.query(
                "update products " + set + "where id=" + req.body.id,
                (err, result) => {
                    if (err) console.error(err);
                    io.emit("update material", req.body);
                    res.json({});
                }
            );
    });

export default router;
