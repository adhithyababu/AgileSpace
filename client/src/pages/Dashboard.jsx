import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { LayoutDashboard, Plus, LogOut, CheckCircle2, Clock, ListTodo, Trash2, Edit2, Check, X } from 'lucide-react';

const Dashboard = () => {
    const { logout } = useContext(AuthContext);
    const [workspaces, setWorkspaces] = useState([]);
    const [activeWorkspace, setActiveWorkspace] = useState(null);
    const [tasks, setTasks] = useState([]);
    
    // Form States
    const [wsName, setWsName] = useState('');
    const [wsDesc, setWsDesc] = useState('');
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDesc, setTaskDesc] = useState('');

    // Inline Edit States
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDesc, setEditDesc] = useState('');

    // 1. Fetch Workspaces
    const fetchWorkspaces = async () => {
        try {
            const res = await axios.get('https://agilespace-backend.onrender.com/api/workspaces');
            if (res.data.success) {
                setWorkspaces(res.data.data);
                if (res.data.data.length > 0 && !activeWorkspace) {
                    setActiveWorkspace(res.data.data[0]);
                }
            }
        } catch (err) {
            console.error('Error fetching workspaces', err);
        }
    };

    // 2. Fetch Tasks for Active Workspace
    const fetchTasks = async () => {
        if (!activeWorkspace) return;
        try {
            const res = await axios.get(`https://agilespace-backend.onrender.com/api/tasks/workspace/${activeWorkspace._id}`);
            if (res.data.success) {
                setTasks(res.data.data);
            }
        } catch (err) {
            console.error('Error fetching tasks', err);
        }
    };

    useEffect(() => {
        fetchWorkspaces();
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [activeWorkspace]);

    // 3. Create Workspace
    const handleCreateWorkspace = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('https://agilespace-backend.onrender.com/api/workspaces', { name: wsName, description: wsDesc });
            if (res.data.success) {
                setWsName('');
                setWsDesc('');
                fetchWorkspaces();
            }
        } catch (err) {
            alert('Error creating workspace');
        }
    };

    // 4. Create Task
    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('https://agilespace-backend.onrender.com/api/tasks', {
                title: taskTitle,
                description: taskDesc,
                workspaceId: activeWorkspace._id
            });
            if (res.data.success) {
                setTaskTitle('');
                setTaskDesc('');
                fetchTasks();
            }
        } catch (err) {
            alert('Error creating task');
        }
    };

    // 5. Update Task Status (Move Kanban)
    const moveTask = async (taskId, newStatus) => {
        try {
            const res = await axios.put(`https://agilespace-backend.onrender.com/api/tasks/${taskId}`, { status: newStatus });
            if (res.data.success) {
                fetchTasks();
            }
        } catch (err) {
            console.error('Error moving task', err);
        }
    };

    // 6. Delete Task (New 🔥)
    const deleteTask = async (taskId) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;
        try {
            const res = await axios.delete(`https://agilespace-backend.onrender.com/api/tasks/${taskId}`);
            if (res.data.success) {
                fetchTasks();
            }
        } catch (err) {
            console.error('Error deleting task', err);
            alert('Failed to delete task');
        }
    };

    // 7. Start Editing Task (New 🔥)
    const startEdit = (task) => {
        setEditingTaskId(task._id);
        setEditTitle(task.title);
        setEditDesc(task.description);
    };

    // 8. Save Edited Task (New 🔥)
    const saveEdit = async (taskId) => {
        try {
            const res = await axios.put(`https://agilespace-backend.onrender.com/api/tasks/${taskId}`, {
                title: editTitle,
                description: editDesc
            });
            if (res.data.success) {
                setEditingTaskId(null);
                fetchTasks();
            }
        } catch (err) {
            console.error('Error updating task', err);
            alert('Failed to update task');
        }
    };

    // Helper Component to render each Task Card to avoid code duplication
    const renderTaskCard = (task, arrowButton) => {
        const isEditing = editingTaskId === task._id;

        return (
            <div key={task._id} className={`bg-slate-800 p-4 rounded-xl border ${task.status === 'DONE' ? 'border-slate-800 opacity-75' : 'border-slate-700/60'} shadow-sm space-y-3 relative group`}>
                {isEditing ? (
                    <div className="space-y-2">
                        <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full p-1.5 text-xs bg-slate-950 border border-slate-700 rounded text-white focus:outline-none" />
                        <textarea value={editDesc} onChange={(e) => setEditDesc(e.target.value)} className="w-full p-1.5 text-xs bg-slate-950 border border-slate-700 rounded text-white focus:outline-none" rows="2" />
                        <div className="flex gap-2 justify-end">
                            <button onClick={() => setEditingTaskId(null)} className="p-1 bg-slate-700 hover:bg-slate-600 rounded text-white"><X size={14}/></button>
                            <button onClick={() => saveEdit(task._id)} className="p-1 bg-emerald-600 hover:bg-emerald-500 rounded text-white"><Check size={14}/></button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-start">
                            <h4 className={`font-medium ${task.status === 'DONE' ? 'text-slate-500 line-through' : 'text-white'}`}>{task.title}</h4>
                            {/* Action Buttons: Show on Hover */}
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition duration-150">
                                <button onClick={() => startEdit(task)} className="p-1 text-slate-400 hover:text-indigo-400 rounded transition"><Edit2 size={13}/></button>
                                <button onClick={() => deleteTask(task._id)} className="p-1 text-slate-400 hover:text-red-400 rounded transition"><Trash2 size={13}/></button>
                            </div>
                        </div>
                        <p className={`text-xs ${task.status === 'DONE' ? 'text-slate-600 line-through' : 'text-slate-400'}`}>{task.description}</p>
                        {arrowButton}
                    </>
                )}
            </div>
        );
    };

    return (
        <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
            {/* LEFT SIDEBAR */}
            <div className="w-64 bg-slate-900 border-r border-slate-800 p-4 flex flex-col justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-6 px-2">
                        <LayoutDashboard className="text-indigo-500" />
                        <h1 className="text-xl font-bold tracking-wider text-indigo-400">AgileSpace</h1>
                    </div>

                    <form onSubmit={handleCreateWorkspace} className="mb-6 space-y-2 bg-slate-950 p-3 rounded-lg border border-slate-800">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">New Workspace</p>
                        <input type="text" placeholder="Workspace Name" value={wsName} onChange={(e) => setWsName(e.target.value)} className="w-full text-xs p-2 bg-slate-900 border border-slate-700 rounded text-white focus:outline-none" required />
                        <input type="text" placeholder="Description" value={wsDesc} onChange={(e) => setWsDesc(e.target.value)} className="w-full text-xs p-2 bg-slate-900 border border-slate-700 rounded text-white focus:outline-none" required />
                        <button type="submit" className="w-full text-xs p-2 bg-indigo-600 hover:bg-indigo-500 rounded font-medium flex items-center justify-center gap-1 transition"><Plus size={14}/> Create</button>
                    </form>

                    <div className="space-y-1">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 mb-2">My Workspaces</p>
                        {workspaces.map((ws) => (
                            <button key={ws._id} onClick={() => setActiveWorkspace(ws)} className={`w-full text-left text-sm p-2.5 rounded-lg transition duration-150 ${activeWorkspace?._id === ws._id ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}>
                                📁 {ws.name}
                            </button>
                        ))}
                    </div>
                </div>

                <button onClick={logout} className="w-full p-2.5 bg-slate-800 hover:bg-red-950/40 hover:text-red-400 rounded-lg text-sm flex items-center justify-center gap-2 transition border border-slate-700 hover:border-red-900/50">
                    <LogOut size={16} /> Log Out
                </button>
            </div>

            {/* MAIN CONTENT */}
            <div className="flex-1 flex flex-col overflow-y-auto p-6">
                {activeWorkspace ? (
                    <>
                        <div className="flex justify-between items-start mb-6 border-b border-slate-800 pb-4">
                            <div>
                                <h2 className="text-2xl font-bold text-white">{activeWorkspace.name}</h2>
                                <p className="text-sm text-slate-400 mt-1">{activeWorkspace.description}</p>
                            </div>

                            <form onSubmit={handleCreateTask} className="flex gap-2 bg-slate-900 p-3 rounded-xl border border-slate-800 shadow-md">
                                <input type="text" placeholder="New Task Title" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} className="p-2 text-sm bg-slate-950 border border-slate-700 rounded-lg focus:outline-none text-white" required />
                                <input type="text" placeholder="Task Details" value={taskDesc} onChange={(e) => setTaskDesc(e.target.value)} className="p-2 text-sm bg-slate-950 border border-slate-700 rounded-lg focus:outline-none text-white" required />
                                <button type="submit" className="p-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-medium text-sm flex items-center gap-1 transition"><Plus size={16}/> Add Task</button>
                            </form>
                        </div>

                        {/* KANBAN COLUMNS */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
                            {/* TO DO */}
                            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 flex flex-col">
                                <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-2 text-slate-400">
                                    <ListTodo size={18} />
                                    <h3 className="font-semibold text-sm uppercase tracking-wider">To Do</h3>
                                    <span className="ml-auto text-xs bg-slate-800 px-2 py-0.5 rounded-full text-slate-400">{tasks.filter(t => t.status === 'TODO').length}</span>
                                </div>
                                <div className="space-y-3 overflow-y-auto flex-1">
                                    {tasks.filter(t => t.status === 'TODO').map(task => 
                                        renderTaskCard(task, <button onClick={() => moveTask(task._id, 'IN_PROGRESS')} className="w-full text-xs p-1.5 bg-slate-950 hover:bg-slate-750 text-indigo-400 rounded border border-slate-700 transition">Start Work →</button>)
                                    )}
                                </div>
                            </div>

                            {/* IN PROGRESS */}
                            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 flex flex-col">
                                <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-2 text-amber-400">
                                    <Clock size={18} />
                                    <h3 className="font-semibold text-sm uppercase tracking-wider">In Progress</h3>
                                    <span className="ml-auto text-xs bg-slate-800 px-2 py-0.5 rounded-full text-amber-400/80">{tasks.filter(t => t.status === 'IN_PROGRESS').length}</span>
                                </div>
                                <div className="space-y-3 overflow-y-auto flex-1">
                                    {tasks.filter(t => t.status === 'IN_PROGRESS').map(task => 
                                        renderTaskCard(task, 
                                            <div className="flex gap-2">
                                                <button onClick={() => moveTask(task._id, 'TODO')} className="w-1/2 text-xs p-1.5 bg-slate-950 hover:bg-slate-750 text-slate-400 rounded border border-slate-700 transition">← Revert</button>
                                                <button onClick={() => moveTask(task._id, 'DONE')} className="w-1/2 text-xs p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded transition">Complete ✓</button>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>

                            {/* DONE */}
                            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 flex flex-col">
                                <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-2 text-emerald-400">
                                    <CheckCircle2 size={18} />
                                    <h3 className="font-semibold text-sm uppercase tracking-wider">Done</h3>
                                    <span className="ml-auto text-xs bg-slate-800 px-2 py-0.5 rounded-full text-emerald-400/80">{tasks.filter(t => t.status === 'DONE').length}</span>
                                </div>
                                <div className="space-y-3 overflow-y-auto flex-1">
                                    {tasks.filter(t => t.status === 'DONE').map(task => 
                                        renderTaskCard(task, <button onClick={() => moveTask(task._id, 'IN_PROGRESS')} className="w-full text-xs p-1.5 bg-slate-950 hover:bg-slate-850 text-amber-500 rounded border border-slate-800 transition">Reopen Task</button>)
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                        <p className="text-lg">Welcome to AgileSpace! Create a workspace from the sidebar to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;