const mongoose = require("mongoose");

const PublicNoticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['Academic', 'Administrative', 'Events', 'Facilities', 'Emergency', 'General'],
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  effectiveDate: {
    type: Date,
    required: true
  },
  expiryDate: {
    type: Date
  },
  isImportant: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  attachments: [{
    filename: {
      type: String,
      required: true
    },
    originalName: {
      type: String,
      required: true
    },
    path: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    },
    mimetype: {
      type: String,
      required: true
    }
  }],
  pdfPath: {
    type: String // Path to generated PDF
  },
  views: {
    type: Number,
    default: 0
  },
  publishedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for efficient queries
PublicNoticeSchema.index({ status: 1, publishedAt: -1 });
PublicNoticeSchema.index({ category: 1, publishedAt: -1 });
PublicNoticeSchema.index({ effectiveDate: 1 });

// Virtual for checking if notice is active
PublicNoticeSchema.virtual('isActive').get(function () {
  const now = new Date();
  return this.status === 'published' &&
    this.effectiveDate <= now &&
    (!this.expiryDate || this.expiryDate >= now);
});

// Pre-save middleware to set publishedAt when status changes to published
PublicNoticeSchema.pre('save', function (next) {
  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

module.exports = mongoose.model("PublicNotice", PublicNoticeSchema);