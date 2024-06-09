import express, { response } from "express";
// pake nodemon agar bisa hot reload si backendnya
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import { Book } from "./models/bookModel.js";

const app = express();
// parsing request body
app.use(express.json());

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

app.get("/", (req, res) => {
  console.log(req);
  return res.status(234).send("halo ini respon kalo berhasil");
});

// Route for saving a book because using Mongoose requires async functions
app.post("/books", async (request, response) => {
  try {
    // Check if all required fields are provided in the request body
    if (
      !request.body.title ||
      !request.body.author ||
      !request.body.publishYear
    ) {
      // If any required field is missing, respond with status 400 (Bad Request)
      return response.status(400).send({
        message: "Send All Required fields : title, author, publish year",
      });
    }

    // Create a new book object with the data from the request body
    const newBook = {
      title: request.body.title,
      author: request.body.author,
      publishYear: request.body.publishYear,
    };

    // Save the new book to the database using Mongoose
    const book = await Book.create(newBook);

    // Respond with status 201 (Created) and send the saved book object
    return response.status(201).send(book);
  } catch (error) {
    // If there's an error, log the error message and respond with status 500 (Internal Server Error)
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route to get all books from the database
app.get("/books", async (request, response) => {
  try {
    // Mengambil semua buku dari database menggunakan model Book
    const books = await Book.find({});

    // Mengirimkan respons sukses dengan status 200 dan data buku
    return response.status(200).json({
      count: books.length,
      data: books,
    });
  } catch (error) {
    // Penanganan kesalahan: mencetak pesan kesalahan ke konsol dan mengirimkan respons status 500
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route to get all books from the database by id
app.get("/books/:id", async (request, response) => {
  try {
    const { id } = request.params;

    // Mengambil semua buku dari database menggunakan model Book
    const book = await Book.findById(id);

    // Mengirimkan respons sukses dengan status 200 dan data buku
    return response.status(200).json(book);
  } catch (error) {
    // Penanganan kesalahan: mencetak pesan kesalahan ke konsol dan mengirimkan respons status 500
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// connect to db
mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("App connect to DB");
  })
  .catch((error) => {
    console.log(error);
  });
