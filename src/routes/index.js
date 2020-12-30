const router = require('express').Router();
const { Mutation, Query } = require('../controllers');
const { isAuthenticated, uploadMid } = require('../middleware');
router.get('/ping', async (req, res) => {
  res.json({ name: 'Service are running...', ping: 'PONG' });
});

router.post('/upload', [isAuthenticated, uploadMid], Mutation.uploadFiles);

// router.post('/download/:id', [isAuthenticated], Query.download);

module.exports = router;
