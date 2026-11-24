import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    phone: { type: String, required: true, trim: true },
    course: { type: String, required: true, trim: true },
    enrollmentDate: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
