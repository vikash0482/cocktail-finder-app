import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

// 🔹 Home page
app.get("/", (req, res) => {
  res.render("index");
});

// 🔹 Handle search → redirect to result page
app.post("/search", async (req, res) => {
  const drinkName = req.body.drink.toLowerCase();

  try {
    const response = await axios.get(
      `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${drinkName}`
    );

    let drinks = response.data.drinks;

    if (drinks) {
      drinks = drinks.filter(
        d => d.strDrink.toLowerCase() === drinkName
      );
    }

    if (drinks && drinks.length > 0) {
      res.render("result", { drinks });
    } else {
      res.render("result", { drinks: null });
    }

  } catch (error) {
    console.log(error.message);
    res.render("result", { drinks: null });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});