const Workspace = require('../models/Workspace');

// @desc    Create a new workspace
// @route   POST /api/workspaces
// @access  Private (ലോഗിൻ ചെയ്തവർക്ക് മാത്രം)
const createWorkspace = async (req, res) => {
    const { name, description } = req.body;

    try {
        // പുതിയ വർക്ക്‌സ്‌പേസ് ഉണ്ടാക്കുന്നു, owner ആയി ലോഗിൻ ചെയ്ത യൂസറുടെ ID കൊടുക്കുന്നു (req.user._id)
        const workspace = await Workspace.create({
            name,
            description,
            owner: req.user._id,
            members: [req.user._id] // ഉണ്ടാക്കുന്ന ആളെ ഡിഫോൾട്ട് ആയി മെമ്പർ ലിസ്റ്റിലും ആഡ് ചെയ്യുന്നു
        });

        res.status(201).json({
            success: true,
            data: workspace
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get all workspaces of the logged-in user
// @route   GET /api/workspaces
// @access  Private
const getWorkspaces = async (req, res) => {
    try {
        // താൻ ഓണറോ അതോ മെമ്പറോ ആയ വർക്ക്‌സ്‌പേസുകൾ മാത്രം കണ്ടുപിടിക്കുന്നു
        const workspaces = await Workspace.find({ members: req.user._id })
            .populate('owner', 'name email') // ഓണറുടെ പേരും ഇമെയിലും മാത്രം എടുത്തു കാണിക്കാൻ
            .populate('members', 'name email');

        res.status(200).json({
            success: true,
            count: workspaces.length,
            data: workspaces
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    createWorkspace,
    getWorkspaces
};