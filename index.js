const express = require("express");

require("dotenv").config({
  path: "./" + ".env",
});

// Input Validator npm package, it is used to validate client inputs
const Joi = require("joi");

const courses = [
  {
    id: 1,
    name: "course1",
  },
  {
    id: 2,
    name: "course2",
  },
  {
    id: 3,
    name: "course3",
  },
];

const app = express();

// middleware, used in request processsing pipeline
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/api/courses", (req, res) => {
  res.send(courses);
});

app.get("/api/courses/:id", (req, res) => {
  let course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    res.status(404).send("Course with given id was not found");
  } else {
    res.send(course);
  }
});

app.get("/api/posts/:year/:month", (req, res) => {
  res.send(req.params);
});

app.post("/api/courses", (req, res) => {
  // JOI SCHEMA

  const { error } = validateCourse(req.body);
  // Request should always be validated,
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };
  courses.push(course);

  res.send(course);
});

app.put("/api/courses/:id", (req, res) => {
  // Look up the course,
  // if not found return 404
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    return res.status(404).send("Course cannot be found");
  }

  // Validate
  // Invalid 400

  const { error } = validateCourse(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // Update course
  // Return the update value
  course.name = req.body.name;
  res.send(course);
});

app.delete("/api/courses/:id", (req, res) => {
  // Look up the course
  // If Not found return 404
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    return res
      .status(404)
      .send("Course with the specified id cannot be found!");
  }

  // Upon finding delete
  const index = courses.indexOf(course);
  courses.splice(index, 1);

  // Return restult
  res.send(course);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listenting on port ${port}`);
});

function validateCourse(course) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  return schema.validate(course);
}
