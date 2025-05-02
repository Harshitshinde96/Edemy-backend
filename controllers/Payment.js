const Course = require("../models/Course");
const CourseProgress = require("../models/CourseProgress");
const User = require("../models/User");

const stripe = require("stripe")(process.env.STRIPE_KEY);

// Simulate the payment process by skipping the Stripe API call
exports.createSession = async (req, res) => {
  const { courseId } = req.body;
  const courseDetails = await Course.findById(courseId);
  if (!courseDetails) {
    return res.status(400).json({
      success: false,
      message: "Course Not Found",
    });
  }

  // Simulate a session ID
  const simulatedSessionId = "test-session-id";

  return res.json({
    success: true,
    id: simulatedSessionId,
  });
};

// Simplify the enrollStudent function to allow direct course access without payment
exports.enrollStudent = async (req, res) => {
  try {
    // const courseId = req.query.courseId; // Retrieve courseId from query parameters
    const courseId = req.body.courseId;
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    // const userId = req.userInfo.userId; // Use the authenticated user's ID
    const userId = req.userInfo?.userId || "67f2cfd3045a3f282c93367f";


    const course = await Course.findOne({ _id: courseId });
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course Not Found",
      });
    }

    if (course.studentsEnrolled.includes(userId)) {
      return res.status(200).json({
        success: true,
        message: "Already Enrolled",
      });
    }

    // Directly enroll the student
    await Course.findByIdAndUpdate(
      courseId,
      {
        $push: { studentsEnrolled: userId },
      },
      { new: true }
    );

    await CourseProgress.create({
      courseId: courseId,
      userId: userId,
      completedVideos: [],
    });

    await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          enrolledCourses: courseId,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Student Enrolled Successfully",
    });
  } catch (error) {
    console.error("Error in enrollStudent:", error);
    console.log("Error in enrollStudent:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Error Occurred",
    });
  }
};
