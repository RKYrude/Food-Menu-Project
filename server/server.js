import express, { response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from "cors"
import multer from 'multer';
import sharp from 'sharp';
import pg from 'pg';
import dotenv from "dotenv"

dotenv.config();

const app = express();
const PORT = 3000;

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const clientBuildPath = path.join(__dirname, "../client/dist");

const storage = multer.memoryStorage();
const upload = multer({ storage });


const db = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

db.connect()
    .then(() => {
        console.log("Connected to Supabase Hosted Database successfully");
    })
    .catch((err) => {
        console.error("Connection error", err.stack);
    });

let dishes = [];

app.use(cors({
    origin: "*",
    methods: ["GET", "POST"],
}));
app.use(express.static(clientBuildPath));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function loadDishes() {
    try {
        let response = await db.query(
            `SELECT devmenu.id, devmenu.item_image, devmenu.item_name,variant.id as variant_id, devmenu.item_type, variant.item_option, variant.item_price
            FROM devmenu
            RIGHT JOIN variant
            ON devmenu.id = variant.devmenu_id
            ORDER BY devmenu.id ASC, variant.item_price ASC;`
        )

        const rawData = response.rows;

        const groupedData = rawData.reduce((acc, curr) => {
            if (!acc[curr.id]) {
                acc[curr.id] = {
                    id: curr.id,
                    itemimage: curr.item_image,
                    itemname: curr.item_name,
                    itemtype: curr.item_type,
                    itemvariant: []
                };
            }
            acc[curr.id].itemvariant.push({
                id: curr.variant_id,
                variantName: curr.item_option,
                variantPrice: curr.item_price
            });
            return acc;
        }, {});

        dishes = Object.values(groupedData);        

    } catch (err) {
        console.error(err);
    }

}
loadDishes();

// app.get('*', (req, res) => {
//     res.sendFile(path.join(clientBuildPath, 'index.html'));
//     // res.sendFile("../client/index.html");
// });

app.get("/getdishes", async (req, res) => {
    console.log(dishes);
    
    res.status(200).json(dishes);
});

app.get("/searchdishes", async (req, res) => {
    const searchWord = req.query.s;
    const priceOrder = req.query.price;
    const foodType = req.query.type;

    let searchMatch = JSON.parse(JSON.stringify(dishes));

    if (searchWord) {
        searchMatch = searchMatch.filter(dish =>
            dish.itemname.toLowerCase().includes(searchWord.toLowerCase())
        );
    }
    if (foodType) {
        if (foodType === "veg") {
            searchMatch = searchMatch.filter(dish =>
                dish.itemtype === "veg"
            );
        } else {
            searchMatch = searchMatch.filter(dish =>
                dish.itemtype === "nonveg"
            );
        }
    }

    if (priceOrder) {

        let sortedItemVariant;

        searchMatch = searchMatch.map(item => {
            if (priceOrder == "lowhigh") {
                sortedItemVariant = item.itemvariant.sort((a, b) => a.variantPrice - b.variantPrice);
            } else {
                sortedItemVariant = item.itemvariant.sort((a, b) => b.variantPrice - a.variantPrice);
            }

            return {
                ...item,
                itemvariant: sortedItemVariant,
            };
        }).sort((a, b) => {
            if (priceOrder == "lowhigh") {
                return a.itemvariant[0].variantPrice - b.itemvariant[0].variantPrice;
            } else {
                return b.itemvariant[0].variantPrice - a.itemvariant[0].variantPrice;
            }
        });
    }
    res.status(200).json(searchMatch);
});


app.post("/addnewitem", upload.single("itemimage"), async (req, res) => {
    try {
        const { itemname, itemtype } = req.body;
        const itemvariant = JSON.parse(req.body.itemvariant)
        let webpBuffer = null;


        if (req.file.mimetype && req.file.mimetype !== "image/webp") {
            webpBuffer = await sharp(req.file.buffer)
                .webp({ quality: 70 })
                .toBuffer();

            req.file.buffer = webpBuffer;
            req.file.mimetype = "image/webp"
            req.file.size = Buffer.byteLength(webpBuffer);

        } else {
            webpBuffer = req.file.buffer
        }

        try {
            let insertItemId = await db.query(
                "INSERT INTO devmenu (item_image, item_name, item_type) VALUES ($1, $2, $3) RETURNING id;",
                [webpBuffer, itemname, itemtype]
            );


            for (let i = 0; i < itemvariant.length; i++) {
                await db.query(
                    "INSERT INTO variant (devmenu_id, item_option, item_price) VALUES ($1, $2, $3);",
                    [insertItemId.rows[0].id, itemvariant[i].variantName, itemvariant[i].variantPrice]
                );
            };

            res.status(200).json({ message: "Item added successfully!" });
            loadDishes();

        } catch (err) {
            console.error("Erorr Inserting Data: ", err);
        }

    } catch (err) {
        console.error("Error Processing Request:", err);
        res.status(500).json({ error: "An error occurred while processing your request." });
    }

});




app.post("/editolditem", upload.single("itemimage"), async (req, res) => {
    try {
        const { id, itemname, itemtype } = req.body;
        const itemvariant = JSON.parse(req.body.itemvariant || "[]");
        const deletedVariantIDs = JSON.parse(req.body.deletedVariantIDs) || "[]";
        let webpBuffer = null;

        if (deletedVariantIDs.length > 0) {
            await db.query(
                `DELETE FROM variant WHERE id = ANY($1::int[])`,
                [deletedVariantIDs]
            );
        }

        if (req.file) {
            if (req.file.mimetype && req.file.mimetype !== "image/webp") {
                webpBuffer = await sharp(req.file.buffer)
                    .webp({ quality: 70 })
                    .toBuffer();
            }

            await db.query(
                `UPDATE devmenu SET item_image = $1, item_name = $2, item_type = $3 WHERE id = $4`,
                [webpBuffer, itemname, itemtype, id]
            );
        } else {
            await db.query(
                `UPDATE devmenu SET item_name = $1, item_type = $2 WHERE id = $3`,
                [itemname, itemtype, id]
            );
        }



        for (let i = 0; i < itemvariant.length; i++) {
            if (typeof itemvariant[i].id === "number") {
                await db.query(
                    `UPDATE variant SET item_option = $1, item_price = $2 WHERE id = $3 AND devmenu_id = $4`,
                    [itemvariant[i].variantName, itemvariant[i].variantPrice, itemvariant[i].id, id]
                );
            } else {
                await db.query(
                    "INSERT INTO variant (devmenu_id, item_option, item_price) VALUES ($1, $2, $3);",
                    [id, itemvariant[i].variantName, itemvariant[i].variantPrice]
                );
            }
        }

        res.status(200).json({ message: "Item updated successfully!" });
        loadDishes();

    } catch (err) {
        console.error("Error Processing Request:", err);
        res.status(500).json({ error: "An error occurred while processing your request." });
    }
});


app.post("/deleteitem", async (req, res) => {
    const { deletionId } = req.body;

    try {
        await db.query(
            `DELETE FROM devmenu WHERE id=$1`,
            [deletionId]
        );
        res.status(200).json({ message: "Item deleted successfully!" });
        loadDishes();
    } catch (err) {
        console.error("Deletion Error: ", err);
        res.status(500).json({ error: "An error occurred while deleting the item." });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at PORT:${PORT}`);
});