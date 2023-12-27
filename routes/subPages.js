const express = require('express');
const router = express.Router();

const {
  createSubPage,
  updateSubPage,
  deleteSubPage,
  deleteBulkSubPages,
  getSubPage,
  getAllSubPages,
  subPages
} = require('../controller/subPages');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

router.post('/createSubPage', isAuthenticatedUser, authorizeRoles("admin"), createSubPage);

router.put('/updateSubPage', isAuthenticatedUser, authorizeRoles("admin"), updateSubPage);

router.delete('/deleteSubPage', isAuthenticatedUser, authorizeRoles("admin"), deleteSubPage);

router.post('/deleteBulkSubPages', isAuthenticatedUser, authorizeRoles("admin"), deleteBulkSubPages);

router.get('/getSubPage/:id', getSubPage);

router.get('/subPages/:pageId', subPages);

router.get('/getAllSubPages', getAllSubPages);

module.exports = router;
