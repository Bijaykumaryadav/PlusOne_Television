const Article = require("../models/Article");

// @desc    Get all articles
// @route   GET /api/articles
// @access  Public
const getAllArticles = async (req, res) => {
  try {
    const { category, featured, limit, page = 1 } = req.query;
    
    let query = {};
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    // Filter by featured
    if (featured) {
      query.featured = featured;
    }
    
    // Filter only published articles
    query.status = "published";
    
    const pageSize = limit ? parseInt(limit) : 10;
    const skip = (parseInt(page) - 1) * pageSize;
    
    const articles = await Article.find(query)
      .sort({ publishedDate: -1 })
      .limit(pageSize)
      .skip(skip);
    
    const total = await Article.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: articles,
      pagination: {
        page: parseInt(page),
        limit: pageSize,
        total,
        pages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching articles",
      error: error.message,
    });
  }
};

// @desc    Get single article by ID
// @route   GET /api/articles/:id
// @access  Public
const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }
    
    // Increment views
    article.views += 1;
    await article.save();
    
    res.status(200).json({
      success: true,
      data: article,
    });
  } catch (error) {
    console.error("Error fetching article:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching article",
      error: error.message,
    });
  }
};

// @desc    Create new article
// @route   POST /api/articles
// @access  Private/Admin
const createArticle = async (req, res) => {
  try {
    const {
      image,
      title,
      summary,
      content,
      category,
      author,
      tags,
      featured,
      status,
    } = req.body;
    
    // Validation
    if (!image || !title || !summary || !content || !category || !author) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }
    
    const article = await Article.create({
      image,
      title,
      summary,
      content,
      category,
      author,
      tags: tags || "",
      featured: featured || "no",
      status: status || "published",
      publishedDate: new Date(),
    });
    
    res.status(201).json({
      success: true,
      message: "Article created successfully",
      data: article,
    });
  } catch (error) {
    console.error("Error creating article:", error);
    res.status(500).json({
      success: false,
      message: "Error creating article",
      error: error.message,
    });
  }
};

// @desc    Update article
// @route   PUT /api/articles/:id
// @access  Private/Admin
const updateArticle = async (req, res) => {
  try {
    const {
      image,
      title,
      summary,
      content,
      category,
      author,
      tags,
      featured,
      status,
    } = req.body;
    
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }
    
    // Update fields
    article.image = image || article.image;
    article.title = title || article.title;
    article.summary = summary || article.summary;
    article.content = content || article.content;
    article.category = category || article.category;
    article.author = author || article.author;
    article.tags = tags !== undefined ? tags : article.tags;
    article.featured = featured || article.featured;
    article.status = status || article.status;
    article.updatedDate = new Date();
    
    await article.save();
    
    res.status(200).json({
      success: true,
      message: "Article updated successfully",
      data: article,
    });
  } catch (error) {
    console.error("Error updating article:", error);
    res.status(500).json({
      success: false,
      message: "Error updating article",
      error: error.message,
    });
  }
};

// @desc    Delete article
// @route   DELETE /api/articles/:id
// @access  Private/Admin
const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }
    
    await article.deleteOne();
    
    res.status(200).json({
      success: true,
      message: "Article deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting article:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting article",
      error: error.message,
    });
  }
};

// @desc    Search articles
// @route   GET /api/articles/search
// @access  Public
const searchArticles = async (req, res) => {
  try {
    const { q, category } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }
    
    let query = {
      $text: { $search: q },
      status: "published",
    };
    
    if (category) {
      query.category = category;
    }
    
    const articles = await Article.find(query)
      .sort({ score: { $meta: "textScore" } })
      .limit(20);
    
    res.status(200).json({
      success: true,
      data: articles,
      count: articles.length,
    });
  } catch (error) {
    console.error("Error searching articles:", error);
    res.status(500).json({
      success: false,
      message: "Error searching articles",
      error: error.message,
    });
  }
};

// @desc    Get featured articles
// @route   GET /api/articles/featured
// @access  Public
const getFeaturedArticles = async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    
    const articles = await Article.find({
      featured: "yes",
      status: "published",
    })
      .sort({ publishedDate: -1 })
      .limit(parseInt(limit));
    
    res.status(200).json({
      success: true,
      data: articles,
    });
  } catch (error) {
    console.error("Error fetching featured articles:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching featured articles",
      error: error.message,
    });
  }
};

module.exports = {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  searchArticles,
  getFeaturedArticles,
};
