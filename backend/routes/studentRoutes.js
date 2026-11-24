import express from "express";
import {
  createStudent,
  deleteStudent,
  getDashboardStats,
  getStudent,
  getStudents,
  updateStudent
} from "../controllers/studentController.js";

const router = express.Router();

router.get("/stats", getDashboardStats);
router.route("/").get(getStudents).post(createStudent);
router.route("/:id").get(getStudent).put(updateStudent).delete(deleteStudent);

export default router;
