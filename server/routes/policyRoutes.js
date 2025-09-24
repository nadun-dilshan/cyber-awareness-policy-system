const express = require("express");
const {
  uploadPolicy,
  getPolicies,
  getAllPolicies,
  getPolicy,
  updatePolicy,
  acknowledgePolicy,
  deletePolicy,
} = require("../controllers/policyController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const multer = require("multer");
const path = require("path");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/policies/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

const router = express.Router();

// Upload new policy (Admin only)
router.post(
  "/upload",
  authMiddleware,
  roleMiddleware(["admin"]),
  upload.single("file"),
  uploadPolicy
);

// Get policies accessible to current user
router.get("/", authMiddleware, getPolicies);

// Get all policies (Admin only)
router.get("/all", authMiddleware, roleMiddleware(["admin"]), getAllPolicies);

// Get specific policy by ID
router.get("/:id", authMiddleware, getPolicy);

// Update policy (Admin only)
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  upload.single("file"),
  updatePolicy
);

// Acknowledge policy
router.post("/acknowledge", authMiddleware, acknowledgePolicy);

// Delete policy (Admin only)
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), deletePolicy);

module.exports = router;
