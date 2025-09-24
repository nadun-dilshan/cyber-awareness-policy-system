const mongoose = require("mongoose");

const policySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 100,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 500,
  },
  fileUrl: { type: String },
  fileName: { type: String },
  fileSize: { type: Number },
  assignedDepartments: [
    {
      type: String,
      enum: ["service", "finance", "hr", "it", "operations", "marketing"],
    },
  ],
  assignedRoles: [
    {
      type: String,
      enum: ["admin", "employee"],
      default: ["employee"],
    },
  ],
  version: { type: Number, default: 1 },
  isActive: { type: Boolean, default: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Pre-save middleware to update updatedAt
policySchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Instance method to check if policy is accessible to user
policySchema.methods.isAccessibleToUser = function (user) {
  const departmentMatch =
    this.assignedDepartments.length === 0 ||
    this.assignedDepartments.includes(user.department);
  const roleMatch =
    this.assignedRoles.length === 0 || this.assignedRoles.includes(user.role);

  return departmentMatch && roleMatch && this.isActive;
};

// Static method to find policies accessible to user
policySchema.statics.findAccessibleToUser = function (user) {
  const query = {
    isActive: true,
    $and: [
      {
        $or: [
          { assignedDepartments: { $size: 0 } },
          { assignedDepartments: user.department },
        ],
      },
      {
        $or: [{ assignedRoles: { $size: 0 } }, { assignedRoles: user.role }],
      },
    ],
  };

  return this.find(query)
    .populate("createdBy", "username")
    .sort({ createdAt: -1 });
};

module.exports = mongoose.model("Policy", policySchema);
