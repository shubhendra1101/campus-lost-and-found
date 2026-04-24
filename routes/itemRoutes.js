const express = require('express');
const router = express.Router();
const { 
    createItem, 
    getItems, 
    searchItems, 
    findMatches, 
    updateItemStatus 
} = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../config/cloudinary');

router.post('/', protect, upload.single('image'), createItem); 
router.get('/', getItems);
router.get('/search', searchItems);
router.get('/match/:id', findMatches);
router.patch('/:id/status', protect, updateItemStatus);

module.exports = router;