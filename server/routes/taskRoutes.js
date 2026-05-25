const express = require('express');
const { createTask, getWorkspaceTasks, updateTask, deleteTask } = require('../controllers/taskController'); // 👈 deleteTask ഇവിടെ ചേർത്തു
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/').post(protect, createTask);

// 👈 ഇതേ റൂട്ടിൽ തന്നെ PUT-ഉം DELETE-ഉം നമ്മൾ സെറ്റ് ചെയ്തു!
router.route('/:id')
    .put(protect, updateTask)
    .delete(protect, deleteTask); 

router.route('/workspace/:workspaceId').get(protect, getWorkspaceTasks);

module.exports = router;