package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Todo struct {
	ID        primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Completed bool               `json:"completed"`
	Body      string             `json:"body"`
}

type Note struct {
	ID    primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Title string             `json:"title"`
	Date  time.Time          `json:"date"`
	Body  string             `json:"body"`
}

var collection *mongo.Collection
var notesCollection *mongo.Collection

func main() {
	fmt.Println("Hello world!!")

	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file: ", err)
	}

	MONGODB_URI := os.Getenv("MONGODB_URI")
	clientOptions := options.Client().ApplyURI(MONGODB_URI)
	client, err := mongo.Connect(context.Background(), clientOptions)

	if err != nil {
		log.Fatal("Error connecting: ", err)
	}

	defer client.Disconnect(context.Background())

	err = client.Ping(context.Background(), nil)
	if err != nil {
		log.Fatal("Error pinging: ", err)

	}

	fmt.Println("Connected to MongoDB")

	collection = client.Database("sidenote").Collection("todos")
	notesCollection = client.Database("sidenote").Collection("notes")

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:5173",
		AllowHeaders: "Origin,Content-Type,Accept",
	}))

	//Demo todo endpoints, can be removed eventually.
	app.Get("/api/todos", getTodos)
	app.Post("/api/todos", createTodo)
	app.Put("/api/todos/:id", updateTodo)
	app.Delete("/api/todos/:id", deleteTodo)

	//Note endpoints
	app.Get("/api/notes", getNotes)
	app.Post("/api/notes", createNote)
	app.Put("/api/notes/:id", updateNote)
	app.Delete("/api/notes/:id", deleteNote)

	port := os.Getenv("PORT")
	if port == "" {
		port = "4000"
	}

	log.Fatal(app.Listen("0.0.0.0:" + port))

}

func getTodos(c *fiber.Ctx) error {
	var todos []Todo
	cursor, err := collection.Find(context.Background(), bson.M{})

	if err != nil {
		return err
	}

	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var todo Todo
		if err := cursor.Decode(&todo); err != nil {
			return err
		}
		todos = append(todos, todo)
	}

	return c.JSON(todos)

}

func getNotes(c *fiber.Ctx) error {
	var notes []Note
	cursor, err := notesCollection.Find(context.Background(), bson.M{})

	if err != nil {
		return err
	}

	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var note Note
		if err := cursor.Decode(&note); err != nil {
			return err
		}
		notes = append(notes, note)
	}

	return c.JSON(notes)

}

func createTodo(c *fiber.Ctx) error {
	todo := new(Todo)

	if err := c.BodyParser(todo); err != nil {
		return err
	}

	if todo.Body == "" {
		return c.Status(400).JSON(fiber.Map{"error": "todo body cannot be empty"})
	}

	insertResult, err := collection.InsertOne(context.Background(), todo)
	if err != nil {
		return err
	}

	todo.ID = insertResult.InsertedID.(primitive.ObjectID)

	return c.Status(201).JSON(todo)
}

func createNote(c *fiber.Ctx) error {
	note := new(Note)
	note.Date = time.Now()

	if err := c.BodyParser(note); err != nil {
		return err
	}

	if note.Body == "" {
		return c.Status(400).JSON(fiber.Map{"error": "note body cannot be empty"})
	}

	fmt.Println("Current note: ", note)
	fmt.Println("Current note: ", note.Title)

	insertResult, err := notesCollection.InsertOne(context.Background(), note)
	if err != nil {
		return err
	}

	note.ID = insertResult.InsertedID.(primitive.ObjectID)

	return c.Status(201).JSON(note)
}

func updateTodo(c *fiber.Ctx) error {
	id := c.Params("id")
	ObjectID, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid todo ID"})

	}

	filter := bson.M{"_id": ObjectID}
	update := bson.M{"$set": bson.M{"completed": true}}

	_, err = collection.UpdateOne(context.Background(), filter, update)

	if err != nil {
		return err
	}

	return c.Status(201).JSON(fiber.Map{"Success": "true"})

}

func updateNote(c *fiber.Ctx) error {
	id := c.Params("id")
	body := c.Params("body")
	ObjectID, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid note ID"})

	}

	filter := bson.M{"_id": ObjectID}
	update := bson.M{"$set": bson.M{"body": body}}

	_, err = notesCollection.UpdateOne(context.Background(), filter, update)

	if err != nil {
		return err
	}

	return c.Status(201).JSON(fiber.Map{"Success": "true"})

}

func deleteTodo(c *fiber.Ctx) error {
	id := c.Params("id")
	ObjectID, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid todo ID"})

	}

	filter := bson.M{"_id": ObjectID}
	_, err = collection.DeleteOne(context.Background(), filter)

	if err != nil {
		return err
	}

	return c.Status(201).JSON(fiber.Map{"Success": "true"})

}

func deleteNote(c *fiber.Ctx) error {
	id := c.Params("id")
	ObjectID, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid note ID"})

	}

	filter := bson.M{"_id": ObjectID}
	_, err = notesCollection.DeleteOne(context.Background(), filter)

	if err != nil {
		return err
	}

	return c.Status(201).JSON(fiber.Map{"Success": "true"})

}
