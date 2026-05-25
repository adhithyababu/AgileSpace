const Task = require('../models/Task');
const Workspace = require('../models/Workspace');

// @desc    Create a new task in a workspace
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
    const { title, description, status, priority, workspaceId, assignedTo, dueDate } = req.body;

    try {
        // 1. ആ വർക്ക്‌സ്‌പേസ് നിലവിലുണ്ടോ എന്ന് നോക്കുന്നു
        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) {
            return res.status(404).json({ success: false, error: 'Workspace not found' });
        }

        // 2. പുതിയ ടാസ്ക് ഉണ്ടാക്കുന്നു
        const task = await Task.create({
            title,
            description,
            status,
            priority,
            workspace: workspaceId,
            assignedTo,
            dueDate
        });

        res.status(201).json({ success: true, data: task });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get all tasks for a specific workspace
// @route   GET /api/tasks/workspace/:workspaceId
// @access  Private
const getWorkspaceTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ workspace: req.params.workspaceId })
            .populate('assignedTo', 'name email');

        res.status(200).json({ success: true, count: tasks.length, data: tasks });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Update a task (Status, Title etc.)
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ success: false, error: 'Task not found' });
        }

        // ടാസ്ക് അപ്ഡേറ്റ് ചെയ്യുന്നു (ഉദാഹരണത്തിന് TODO-ൽ നിന്ന് IN_PROGRESS-ലേക്ക് മാറ്റാൻ)
        task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: task });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
// ടാസ്ക് ഡിലീറ്റ് ചെയ്യാനുള്ള ഫങ്ഷൻ 🔥
const deleteTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        
        // നിങ്ങളുടെ മോഡലിന്റെ പേര് Task എന്നാണെങ്കിൽ:
        const task = await Task.findById(taskId);
        
        if (!task) {
            return res.status(404).json({ success: false, error: 'Task not found' });
        }

        await Task.findByIdAndDelete(taskId);
        res.status(200).json({ success: true, message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
module.exports = {
    createTask,
    getWorkspaceTasks,
    updateTask,
    deleteTask
};