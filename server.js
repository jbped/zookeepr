const { RSA_NO_PADDING } = require("constants");
const express = require("express");
const fs = require("fs");
const path = require("path");
const PORT = process.env.PORT || 3001;
const app = express();
const { animals } = require("./data/animals");

// parse incoming string or array data, extended: true makes it view all levels of the array. 
app.use(express.urlencoded({ extended:true }));
// parse incoming JSON data
app.use(express.json());
// allow access to public folder
app.use(express.static("public"));

function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    let filteredResults = animalsArray;
    // if query.personalityTraits exists create an array for each query param. Then for each trait, find an animal that has the matching traits to the the trait index in the personalityTraitsArray
    if (query.personalityTraits) {
        if (typeof query.personalityTraits === "string") {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits;
        }

        personalityTraitsArray.forEach(trait => {
            filteredResults = filteredResults.filter(animal => animal.personalityTraits.indexOf(trait) !== -1);
        });
    }

    console.log(personalityTraitsArray);
    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name){
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    return filteredResults;
}

function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id ===id) [0];
    return result;
}

function createNewAnimal(body, animalsArray) {
    const animal = body;
    animalsArray.push(animal)
    fs.writeFileSync(
        path.join(__dirname, "./data/animals.json"),
        JSON.stringify({ animals: animalsArray }, null, 2)
    );
    return animal;
}

function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
        return false;
      }
      if (!animal.species || typeof animal.species !== 'string') {
        return false;
      }
      if (!animal.diet || typeof animal.diet !== 'string') {
        return false;
      }
      if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
        return false;
      }
      return true;
}
// Get Query request
app.get("/api/animals", (req, res) => {
  let results = animals;
  if (req.query) {
    results = filterByQuery(req.query, results);
  }
  res.json(results);
});

// Get Param request
app.get("/api/animals/:id", (req, res) => {
    const result = findById(req.params.id, animals);
        if (result) {
            res.json(result);
        } else {
            res.send(404);
        }
})

app.post("/api/animals", (req,res) => {
    console.log(req.body);
    req.body.id = animals.length.toString();

    if(!validateAnimal(req.body)) {
        res.status(400).send("The animal is not properly formatted!")
    } else {
        const animal = createNewAnimal(req.body, animals);
        res.json(req.body);
    }
})

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/animals", (req,res) => {
    res.sendFile(path.join(__dirname, "./public/animals.html"));
})

app.get("/zookeepers", (req,res) => {
    res.sendFile(__dirname, "./public/zookeepers.html");
})

app.get("*", (req,res) => {
    res.sendFile(__dirname, "./public/index.html");
})

app.listen(PORT, () => {
    console.log (`API server now on port ${PORT}!`);
});