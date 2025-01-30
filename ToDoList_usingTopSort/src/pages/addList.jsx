import React, { useState } from 'react';

const TodoApp = () => {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [dependencies, setDependencies] = useState('');

  // Add a new task
  const addTask = () => {
    if (!taskName) return;
    setTasks([...tasks, { name: taskName, dependencies: dependencies.split(',').map(dep => dep.trim()).filter(Boolean) }]);
    setTaskName('');
    setDependencies('');
  };

  // Delete a task
  const deleteTask = (name) => {
    setTasks(tasks.filter(task => task.name !== name));
  };

  // Topological sort using DFS
  const topologicalSort = () => {
    let visited = new Set();
    let stack = [];

    const dfs = (taskName) => {
      if (visited.has(taskName)) return;

      visited.add(taskName);
      const task = tasks.find(task => task.name === taskName);
      if (task) {
        task.dependencies.forEach(dep => dfs(dep));
      }
      stack.push(taskName);
    };

    tasks.forEach(task => {
      if (!visited.has(task.name)) {
        dfs(task.name);
      }
    });

    return stack.reverse();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="max-w-2xl w-full p-6 bg-gray-100 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-4">Daily To-Do List</h1>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Task Name"
            className="w-full p-2 mb-2 border border-gray-300 rounded"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Dependencies (comma-separated)"
            className="w-full p-2 mb-2 border border-gray-300 rounded"
            value={dependencies}
            onChange={(e) => setDependencies(e.target.value)}
          />
          <button 
            onClick={addTask} 
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            Add Task
          </button>
        </div>
        <ul className="space-y-2">
          {tasks.map(task => (
            <li key={task.name} className="p-2 bg-white rounded shadow-md flex justify-between items-center">
              <span>{task.name} (depends on: {task.dependencies.join(', ') || 'None'})</span>
              <button 
                onClick={() => deleteTask(task.name)} 
                className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600">
                Delete
              </button>
            </li>
          ))}
        </ul>
        <h2 className="text-xl font-semibold mt-6">The Prefered Order:</h2>
        <p className="p-2 bg-white rounded shadow-md mt-2">{topologicalSort().join(' -> ')}</p>
      </div>
    </div>
  );
};

export default TodoApp;
