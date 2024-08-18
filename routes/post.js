import express from 'express';
import Post from '../models/Post.js'
import { auth } from '../middleware/auth.js'

const router = express.Router();

//Create a new post

router.post('/', auth, async (req, res) => {
    try {
        const post = new Post({
            title: req.body.title,
            content: req.body.content,
            author: req.user._id,
        });
        await post.save();
        res.status(201).json(post);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Get all posts

router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'name email');
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a post
router.put('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        post.title = req.body.title || post.title;
        post.content = req.body.content || post.content;
        await post.save();
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a post

router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        console.log(post);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        await Post.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'post deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;