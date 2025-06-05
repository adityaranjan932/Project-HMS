const PublicNotice = require('../models/PublicNotice');
const User = require('../models/User');
const multer = require('multer');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/notices');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept PDF files and images
  if (file.mimetype === 'application/pdf' ||
    file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Generate PDF from notice content
const generateNoticePDF = async (notice) => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Public Notice</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 20px;
          }
          .header { 
            text-align: center; 
            border-bottom: 2px solid #0d7377; 
            padding-bottom: 20px; 
            margin-bottom: 30px;
          }
          .title { 
            color: #0d7377; 
            font-size: 24px; 
            font-weight: bold; 
            margin-bottom: 10px;
          }
          .meta { 
            color: #666; 
            font-size: 14px; 
            margin-bottom: 20px;
          }
          .category { 
            background: #0d7377; 
            color: white; 
            padding: 5px 15px; 
            border-radius: 20px; 
            font-size: 12px; 
            display: inline-block;
          }
          .important { 
            background: #dc3545; 
            color: white; 
            padding: 5px 15px; 
            border-radius: 20px; 
            font-size: 12px; 
            display: inline-block; 
            margin-left: 10px;
          }
          .content { 
            margin: 30px 0; 
            line-height: 1.8;
          }
          .footer { 
            margin-top: 40px; 
            padding-top: 20px; 
            border-top: 1px solid #ddd; 
            font-size: 12px; 
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>HOSTEL MANAGEMENT SYSTEM</h1>
          <p>Public Notice</p>
        </div>
        
        <div class="title">${notice.title}</div>
        
        <div class="meta">
          <span class="category">${notice.category}</span>
          ${notice.isImportant ? '<span class="important">IMPORTANT</span>' : ''}
          <br><br>
          <strong>Effective Date:</strong> ${new Date(notice.effectiveDate).toLocaleDateString()}<br>
          ${notice.expiryDate ? `<strong>Expiry Date:</strong> ${new Date(notice.expiryDate).toLocaleDateString()}<br>` : ''}
          <strong>Published:</strong> ${new Date(notice.publishedAt || notice.createdAt).toLocaleDateString()}
        </div>
        
        <div class="content">
          ${notice.content.replace(/\n/g, '<br>')}
        </div>
        
        <div class="footer">
          <p>This is an official notice from the Hostel Management System.</p>
          <p>Generated on: ${new Date().toLocaleString()}</p>
        </div>
      </body>
      </html>
    `;

    await page.setContent(html);

    const pdfPath = path.join(__dirname, '../uploads/notices/pdfs');
    if (!fs.existsSync(pdfPath)) {
      fs.mkdirSync(pdfPath, { recursive: true });
    }

    const filename = `notice-${notice._id}-${Date.now()}.pdf`;
    const fullPath = path.join(pdfPath, filename);

    await page.pdf({
      path: fullPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      }
    });

    return `uploads/notices/pdfs/${filename}`;
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error('Failed to generate PDF');
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

// Create a new public notice
const createNotice = async (req, res) => {
  try {
    const { title, content, category, effectiveDate, expiryDate, isImportant, status } = req.body;

    const noticeData = {
      title,
      content,
      category,
      author: req.user.id,
      effectiveDate: new Date(effectiveDate),
      isImportant: isImportant === 'true',
      status: status || 'draft'
    };

    if (expiryDate) {
      noticeData.expiryDate = new Date(expiryDate);
    }

    // Handle file attachments
    if (req.files && req.files.length > 0) {
      noticeData.attachments = req.files.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        path: file.path,
        size: file.size,
        mimetype: file.mimetype
      }));
    }

    const notice = new PublicNotice(noticeData);
    await notice.save();

    // Generate PDF if status is published
    if (status === 'published') {
      try {
        const pdfPath = await generateNoticePDF(notice);
        notice.pdfPath = pdfPath;
        await notice.save();
      } catch (pdfError) {
        console.error('PDF generation failed:', pdfError);
        // Continue without PDF if generation fails
      }
    }

    await notice.populate('author', 'firstName lastName email');

    res.status(201).json({
      success: true,
      message: 'Notice created successfully',
      notice
    });
  } catch (error) {
    console.error('Create notice error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create notice',
      error: error.message
    });
  }
};

// Get all notices (with filters)
const getAllNotices = async (req, res) => {
  try {
    const { status, category, page = 1, limit = 10, search } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const notices = await PublicNotice.find(filter)
      .populate('author', 'firstName lastName email')
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await PublicNotice.countDocuments(filter);

    res.json({
      success: true,
      notices,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalNotices: total
      }
    });
  } catch (error) {
    console.error('Get notices error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notices',
      error: error.message
    });
  }
};

// Get published notices for public view
const getPublishedNotices = async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;

    const filter = {
      status: 'published',
      effectiveDate: { $lte: new Date() }
    };

    if (category) filter.category = category;

    // Only show notices that haven't expired
    filter.$or = [
      { expiryDate: { $exists: false } },
      { expiryDate: null },
      { expiryDate: { $gte: new Date() } }
    ];

    const notices = await PublicNotice.find(filter)
      .populate('author', 'firstName lastName')
      .sort({ isImportant: -1, publishedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await PublicNotice.countDocuments(filter);

    res.json({
      success: true,
      notices,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalNotices: total
      }
    });
  } catch (error) {
    console.error('Get published notices error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch published notices',
      error: error.message
    });
  }
};

// Get a single notice by ID
const getNoticeById = async (req, res) => {
  try {
    const notice = await PublicNotice.findById(req.params.id)
      .populate('author', 'firstName lastName email');

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found'
      });
    }

    // Increment view count for published notices
    if (notice.status === 'published') {
      notice.views += 1;
      await notice.save();
    }

    res.json({
      success: true,
      notice
    });
  } catch (error) {
    console.error('Get notice by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notice',
      error: error.message
    });
  }
};

// Update a notice
const updateNotice = async (req, res) => {
  try {
    const { title, content, category, effectiveDate, expiryDate, isImportant, status } = req.body;

    const notice = await PublicNotice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found'
      });
    }

    // Check if user is the author
    if (notice.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this notice'
      });
    }

    // Update fields
    if (title) notice.title = title;
    if (content) notice.content = content;
    if (category) notice.category = category;
    if (effectiveDate) notice.effectiveDate = new Date(effectiveDate);
    if (expiryDate) notice.expiryDate = new Date(expiryDate);
    if (typeof isImportant !== 'undefined') notice.isImportant = isImportant === 'true';
    if (status) notice.status = status;

    // Handle new file attachments
    if (req.files && req.files.length > 0) {
      const newAttachments = req.files.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        path: file.path,
        size: file.size,
        mimetype: file.mimetype
      }));
      notice.attachments = [...notice.attachments, ...newAttachments];
    }

    await notice.save();

    // Regenerate PDF if status changed to published or if content changed
    if (status === 'published') {
      try {
        const pdfPath = await generateNoticePDF(notice);
        notice.pdfPath = pdfPath;
        await notice.save();
      } catch (pdfError) {
        console.error('PDF generation failed:', pdfError);
      }
    }

    await notice.populate('author', 'firstName lastName email');

    res.json({
      success: true,
      message: 'Notice updated successfully',
      notice
    });
  } catch (error) {
    console.error('Update notice error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update notice',
      error: error.message
    });
  }
};

// Delete a notice
const deleteNotice = async (req, res) => {
  try {
    const notice = await PublicNotice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found'
      });
    }

    // Check if user is the author
    if (notice.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this notice'
      });
    }

    // Delete associated files
    notice.attachments.forEach(attachment => {
      try {
        if (fs.existsSync(attachment.path)) {
          fs.unlinkSync(attachment.path);
        }
      } catch (error) {
        console.error('Error deleting attachment:', error);
      }
    });

    // Delete PDF file
    if (notice.pdfPath) {
      try {
        const fullPdfPath = path.join(__dirname, '..', notice.pdfPath);
        if (fs.existsSync(fullPdfPath)) {
          fs.unlinkSync(fullPdfPath);
        }
      } catch (error) {
        console.error('Error deleting PDF:', error);
      }
    }

    await PublicNotice.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Notice deleted successfully'
    });
  } catch (error) {
    console.error('Delete notice error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notice',
      error: error.message
    });
  }
};

// Publish a draft notice
const publishNotice = async (req, res) => {
  try {
    const notice = await PublicNotice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found'
      });
    }

    // Check if user is the author
    if (notice.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to publish this notice'
      });
    }

    notice.status = 'published';
    notice.publishedAt = new Date();
    await notice.save();

    // Generate PDF
    try {
      const pdfPath = await generateNoticePDF(notice);
      notice.pdfPath = pdfPath;
      await notice.save();
    } catch (pdfError) {
      console.error('PDF generation failed:', pdfError);
    }

    await notice.populate('author', 'firstName lastName email');

    res.json({
      success: true,
      message: 'Notice published successfully',
      notice
    });
  } catch (error) {
    console.error('Publish notice error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to publish notice',
      error: error.message
    });
  }
};

module.exports = {
  upload,
  createNotice,
  getAllNotices,
  getPublishedNotices,
  getNoticeById,
  updateNotice,
  deleteNotice,
  publishNotice
};