const Policy = require("../models/Policy");
const Acknowledgement = require("../models/Acknowledgement");
const AuditLog = require("../models/AuditLog");
const Notification = require("../models/Notification");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const fs = require("fs").promises;
const path = require("path");

const uploadPolicy = async (req, res) => {
  try {
    const { title, description, assignedDepartments, assignedRoles } = req.body;

    // Validate required fields
    if (!title || title.trim().length < 5 || title.trim().length > 100) {
      return res
        .status(400)
        .json({ msg: "Title must be between 5-100 characters" });
    }

    if (
      !description ||
      description.trim().length < 10 ||
      description.trim().length > 500
    ) {
      return res
        .status(400)
        .json({ msg: "Description must be between 10-500 characters" });
    }

    const parsedDepartments = assignedDepartments
      ? JSON.parse(assignedDepartments)
      : [];
    const parsedRoles = assignedRoles
      ? JSON.parse(assignedRoles)
      : ["employee"];

    if (parsedDepartments.length === 0) {
      return res
        .status(400)
        .json({ msg: "At least one department must be selected" });
    }

    // Validate file if provided
    if (req.file) {
      if (req.file.mimetype !== "application/pdf") {
        return res.status(400).json({ msg: "Only PDF files are allowed" });
      }

      if (req.file.size > 10 * 1024 * 1024) {
        // 10MB limit
        return res
          .status(400)
          .json({ msg: "File size must be less than 10MB" });
      }
    }

    const policy = new Policy({
      title: title.trim(),
      description: description.trim(),
      fileUrl: req.file ? `/uploads/policies/${req.file.filename}` : null,
      fileName: req.file ? req.file.originalname : null,
      fileSize: req.file ? req.file.size : null,
      assignedDepartments: parsedDepartments,
      assignedRoles: parsedRoles,
      createdBy: req.user.id,
    });

    await policy.save();
    await new AuditLog({
      userId: req.user.id,
      action: "policy_uploaded",
      details: `Policy uploaded: ${title}`,
    }).save();

    // Send notifications
    try {
      const transporter = nodemailer.createTransporter({
        service: "gmail",
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      });

      for (const dept of parsedDepartments) {
        const users = await User.find({ department: dept, role: "employee" });
        for (const user of users) {
          await new Notification({
            userId: user._id,
            type: "policy_update",
            message: `New policy: ${title}`,
          }).save();

          if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            transporter.sendMail({
              from: process.env.EMAIL_USER,
              to: user.username + "@example.com",
              subject: "New Policy Update",
              text: `Please acknowledge the new policy: ${title}`,
            });
          }
        }
      }
    } catch (notificationError) {
      console.error("Error sending notifications:", notificationError);
    }

    res.status(201).json(policy);
  } catch (error) {
    console.error("Error uploading policy:", error);
    res.status(500).json({ msg: "Server error while uploading policy" });
  }
};

const getPolicies = async (req, res) => {
  try {
    const policies = await Policy.findAccessibleToUser(req.user);
    res.json(policies);
  } catch (error) {
    console.error("Error fetching policies:", error);
    res.status(500).json({ msg: "Server error while fetching policies" });
  }
};

const getAllPolicies = async (req, res) => {
  try {
    const policies = await Policy.find({ isActive: true })
      .populate("createdBy", "username")
      .sort({ createdAt: -1 });
    res.json(policies);
  } catch (error) {
    console.error("Error fetching all policies:", error);
    res.status(500).json({ msg: "Server error while fetching policies" });
  }
};

const acknowledgePolicy = async (req, res) => {
  try {
    const { policyId, signature } = req.body;

    const policy = await Policy.findById(policyId);
    if (!policy || !policy.isActive) {
      return res.status(404).json({ msg: "Policy not found" });
    }

    // Check if user has access to this policy
    if (!policy.isAccessibleToUser(req.user)) {
      return res.status(403).json({ msg: "Access denied" });
    }

    // Check if already acknowledged
    const existingAck = await Acknowledgement.findOne({
      userId: req.user.id,
      policyId: policyId,
    });

    if (existingAck) {
      return res.status(400).json({ msg: "Policy already acknowledged" });
    }

    const ack = new Acknowledgement({
      userId: req.user.id,
      policyId,
      signature,
    });
    await ack.save();

    await new AuditLog({
      userId: req.user.id,
      action: "policy_acknowledged",
      details: `Policy acknowledged: ${policy.title}`,
    }).save();

    res.json({ msg: "Policy acknowledged successfully" });
  } catch (error) {
    console.error("Error acknowledging policy:", error);
    res.status(500).json({ msg: "Server error while acknowledging policy" });
  }
};

const deletePolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const policy = await Policy.findById(id);

    if (!policy || !policy.isActive) {
      return res.status(404).json({ msg: "Policy not found" });
    }

    // Soft delete - mark as inactive instead of actually deleting
    policy.isActive = false;
    policy.updatedBy = req.user.id;
    await policy.save();

    // Delete associated file if exists
    if (policy.fileUrl) {
      try {
        const filePath = path.join(
          __dirname,
          "../../uploads/policies",
          path.basename(policy.fileUrl)
        );
        await fs.unlink(filePath);
      } catch (fileError) {
        console.error("Error deleting file:", fileError);
      }
    }

    await new AuditLog({
      userId: req.user.id,
      action: "policy_deleted",
      details: `Policy deleted: ${policy.title}`,
    }).save();

    res.json({ msg: "Policy deleted successfully" });
  } catch (error) {
    console.error("Error deleting policy:", error);
    res.status(500).json({ msg: "Server error while deleting policy" });
  }
};

const getPolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const policy = await Policy.findById(id).populate("createdBy", "username");

    if (!policy || !policy.isActive) {
      return res.status(404).json({ msg: "Policy not found" });
    }

    // Check if user has access to this policy
    if (!policy.isAccessibleToUser(req.user)) {
      return res.status(403).json({ msg: "Access denied" });
    }

    res.json(policy);
  } catch (error) {
    console.error("Error fetching policy:", error);
    res.status(500).json({ msg: "Server error while fetching policy" });
  }
};

const updatePolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, assignedDepartments, assignedRoles } = req.body;

    const policy = await Policy.findById(id);
    if (!policy || !policy.isActive) {
      return res.status(404).json({ msg: "Policy not found" });
    }

    // Validate required fields
    if (!title || title.trim().length < 5 || title.trim().length > 100) {
      return res
        .status(400)
        .json({ msg: "Title must be between 5-100 characters" });
    }

    if (
      !description ||
      description.trim().length < 10 ||
      description.trim().length > 500
    ) {
      return res
        .status(400)
        .json({ msg: "Description must be between 10-500 characters" });
    }

    const parsedDepartments = assignedDepartments
      ? JSON.parse(assignedDepartments)
      : policy.assignedDepartments;
    const parsedRoles = assignedRoles
      ? JSON.parse(assignedRoles)
      : policy.assignedRoles;

    if (parsedDepartments.length === 0) {
      return res
        .status(400)
        .json({ msg: "At least one department must be selected" });
    }

    // Update policy
    policy.title = title.trim();
    policy.description = description.trim();
    policy.assignedDepartments = parsedDepartments;
    policy.assignedRoles = parsedRoles;
    policy.updatedBy = req.user.id;
    policy.version += 1;

    // Handle file update
    if (req.file) {
      if (req.file.mimetype !== "application/pdf") {
        return res.status(400).json({ msg: "Only PDF files are allowed" });
      }

      if (req.file.size > 10 * 1024 * 1024) {
        return res
          .status(400)
          .json({ msg: "File size must be less than 10MB" });
      }

      // Delete old file if exists
      if (policy.fileUrl) {
        try {
          const oldFilePath = path.join(
            __dirname,
            "../../uploads/policies",
            path.basename(policy.fileUrl)
          );
          await fs.unlink(oldFilePath);
        } catch (fileError) {
          console.error("Error deleting old file:", fileError);
        }
      }

      policy.fileUrl = `/uploads/policies/${req.file.filename}`;
      policy.fileName = req.file.originalname;
      policy.fileSize = req.file.size;
    }

    await policy.save();
    await new AuditLog({
      userId: req.user.id,
      action: "policy_updated",
      details: `Policy updated: ${title}`,
    }).save();

    res.json(policy);
  } catch (error) {
    console.error("Error updating policy:", error);
    res.status(500).json({ msg: "Server error while updating policy" });
  }
};

module.exports = {
  uploadPolicy,
  getPolicies,
  getAllPolicies,
  getPolicy,
  updatePolicy,
  acknowledgePolicy,
  deletePolicy,
};
