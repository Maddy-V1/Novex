const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const auth = require('../middleware/auth');

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('author', 'name')
      .populate('comments.user', 'name')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create a project
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, githubLink, linkedinLink, tags } = req.body;
    
    const project = new Project({
      title,
      description,
      githubLink,
      linkedinLink,
      tags,
      author: req.user._id
    });

    await project.save();
    await project.populate('author', 'name');
    
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get project by ID
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('author', 'name')
      .populate('comments.user', 'name');
      
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update project
router.put('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is the author
    if (project.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { title, description, githubLink, linkedinLink, tags } = req.body;
    
    project.title = title || project.title;
    project.description = description || project.description;
    project.githubLink = githubLink || project.githubLink;
    project.linkedinLink = linkedinLink || project.linkedinLink;
    project.tags = tags || project.tags;

    await project.save();
    await project.populate('author', 'name');
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete project
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is the author
    if (project.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await project.deleteOne();
    res.json({ message: 'Project removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add comment
router.post('/:id/comments', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const newComment = {
      text: req.body.text,
      user: req.user._id
    };

    project.comments.unshift(newComment);
    await project.save();
    await project.populate('comments.user', 'name');
    
    res.json(project.comments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Toggle like
router.put('/:id/like', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if project has already been liked by user
    const likeIndex = project.likes.findIndex(
      like => like.toString() === req.user._id.toString()
    );

    if (likeIndex === -1) {
      project.likes.push(req.user._id);
    } else {
      project.likes.splice(likeIndex, 1);
    }

    await project.save();
    res.json(project.likes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add this route to get user's projects
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const projects = await Project.find({ author: req.params.userId })
      .populate('author', 'name')
      .populate('comments.user', 'name')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router; 