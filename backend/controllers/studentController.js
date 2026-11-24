import Student from "../models/Student.js";

export const getStudents = async (req, res) => {
  try {
    const { search } = req.query;
    const filter = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { course: { $regex: search, $options: "i" } }
          ]
        }
      : {};
    const students = await Student.find(filter).sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch students" });
  }
};

export const getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (error) {
    res.status(400).json({ message: "Invalid student ID" });
  }
};

export const createStudent = async (req, res) => {
  try {
    const { name, email, phone, course } = req.body;
    if (!name || !email || !phone || !course) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const student = await Student.create({ name, email, phone, course });
    res.status(201).json(student);
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "Email already exists" });
    res.status(400).json({ message: error.message || "Failed to create student" });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const { name, email, phone, course } = req.body;
    if (!name || !email || !phone || !course) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, course },
      { new: true, runValidators: true }
    );
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "Email already exists" });
    res.status(400).json({ message: error.message || "Failed to update student" });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Invalid student ID" });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const courseGroups = await Student.aggregate([
      { $group: { _id: "$course", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json({ totalStudents, totalCourses: courseGroups.length, courseGroups });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch dashboard statistics" });
  }
};
