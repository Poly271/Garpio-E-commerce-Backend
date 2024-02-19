 // [Section] Dependecies and Modules
const express = require("express");
const productController = require("../controllers/product");

const {verify, verifyAdmin} = require("../auth"); 

// [Section] Routing Component
const router = express.Router();



// Create / Add a course
// router.post("/", verify, verifyAdmin, (req, res) => {
//     courseController.addCourse(req.body).then(resultFromController => res.send(resultFromController));
// })


// Create / Add a course
router.post("/", verify, verifyAdmin, productController.addProduct);


// Retrieve all course
// router.get("/", (req, res) => {
//     courseController.getAllCourses(req.body).then(resultFromController => res.send(resultFromController));
// })

// Retrieve all course
router.get("/all",verify, verifyAdmin, courseController.getAllCourses);

// Get specific course
router.post("/specific", courseController.getCourse);

// Get all active/available course
router.get("/", courseController.getAllActive);

// Update a course
router.patch("/:courseId", verify, verifyAdmin, courseController.updateCourse);

// Archive a course
router.patch("/:courseId/archive", verify, verifyAdmin, courseController.archiveCourse);

// Activate a course
router.patch("/:courseId/activate", verify, verifyAdmin, courseController.activateCourse);

// Search course by name
router.post("/search", courseController.searchCoursesByName);

// Search course by price
router.post("/search-price", courseController.searchByPrice);


// [Section]Export Route System
// Allows us to export the "router" object that will be accessed in our "index.js" file
module.exports = router; 