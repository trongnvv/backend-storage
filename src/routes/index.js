const router = require('express').Router();
const { Mutation, Query } = require('../controllers');
const { isAuthenticated, uploadMid, permission, verifyToken } = require('../middleware');
router.get('/ping', async (req, res) => {
  res.json({ name: 'Service are running...', ping: 'PONG' });
});

router.post('/upload', [isAuthenticated, uploadMid], Mutation.uploadFiles);

router.get('/download/:id', permission, Query.download);
router.get('/download-by-token/:id', verifyToken, Query.download);
router.get('/token/:id', permission, Query.getToken);

module.exports = router;
