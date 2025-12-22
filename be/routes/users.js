const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { upload, checkFileSize } = require('../middlewares/upload');
const { getMyProfile, getProfileById, updateProfile, updateAvatar, updateCover, searchUsers } = require('../controllers/userController');

router.get('/me', auth, getMyProfile);
router.get('/search', auth, searchUsers);
router.get('/:userId', auth, getProfileById);
router.put('/me', auth, updateProfile);
// Support both single file (legacy) and multiple files (thumbnail + model)
router.post('/avatar', auth, upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'model', maxCount: 1 },
  { name: 'image', maxCount: 1 } // Legacy support
]), checkFileSize, updateAvatar);
router.post('/cover', auth, upload.single('image'), checkFileSize, updateCover);

module.exports = router;
