const express = require("express");

const PORT = process.env.PORT || 3001;
const app = express();
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

// parse incoming string or array data, extended: true makes it view all levels of the array. 
app.use(express.urlencoded({ extended:true }));
// parse incoming JSON data
app.use(express.json());
// allow access to public folder
app.use(express.static("public"));

app.use("/api", apiRoutes);
app.use("/", htmlRoutes);

app.listen(PORT, () => {
    console.log (`API server now on port ${PORT}!`);
});