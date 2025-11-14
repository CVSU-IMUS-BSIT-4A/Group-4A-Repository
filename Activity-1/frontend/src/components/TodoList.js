import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TodoForm from './TodoForm';

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [refreshFlag, setRefreshFlag] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:3000/tasks');
      const incompleteTasks = res.data.filter(task => !task.completed);
      setTasks(incompleteTasks);
    } catch (error) {
      console.error(error);
    }
  };

  const handleTaskAdded = () => setRefreshFlag(!refreshFlag);

  useEffect(() => {
    fetchTasks();
  }, [refreshFlag]);

  return (
    <div className="container mt-5">
      <TodoForm onTaskAdded={handleTaskAdded} fetchTasks={fetchTasks} tasks={tasks} />
    </div>
  );
};

export default TodoList;
