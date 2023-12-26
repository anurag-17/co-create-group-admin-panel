const express = require('express');
const router = express.Router();

const {
  createSubPage,
  updateSubPage,
  deleteSubPage,
  deleteBulkSubPages,
  getSubPage,
  getAllSubPages,
} = require('../controller/subPages');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

router.post('/createSubPage', createSubPage);

router.put('/updateSubPage', updateSubPage);

router.delete('/deleteSubPage', deleteSubPage);

router.post('/deleteBulkSubPages', deleteBulkSubPages);

router.get('/getSubPage/:id', getSubPage);

router.get('/getAllSubPages', getAllSubPages);

module.exports = router;
