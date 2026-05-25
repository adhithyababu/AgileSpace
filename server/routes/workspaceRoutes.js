const express = require('express');
const { createWorkspace, getWorkspaces } = require('../controllers/workspaceController');
const { protect } = require('../middleware/auth'); // സെക്യൂരിറ്റി ചെക്ക് ഇമ്പോർട്ട് ചെയ്യുന്നു

const router = express.Router();

// ഈ രണ്ട് റൂട്ടുകളും പ്രൊട്ടക്റ്റഡ് ആണ് (protect വഴി കടന്നു പോയാലേ വർക്ക് ആവൂ)
router.route('/')
    .post(protect, createWorkspace)
    .get(protect, getWorkspaces);

module.exports = router;