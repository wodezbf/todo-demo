'use client';

import { useState, useEffect } from 'react';
import { Todo } from '@/types/todo';
import { ApiService } from '@/services/api';
import TodoList from '@/components/TodoList';
import TodoForm from '@/components/TodoForm';
import Modal from '@/components/Modal';
import ConfirmModal from '@/components/ConfirmModal';

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingTodo, setDeletingTodo] = useState<Todo | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadTodos();
  }, [searchTerm]);

  const loadTodos = async () => {
    try {
      const data = await ApiService.getTodos(searchTerm);
      setTodos(data);
    } catch (error) {
      console.error('Error loading todos:', error);
    }
  };

  const handleCreateTodo = async (todoData: Partial<Todo>) => {
    try {
      const updatedTodos = await ApiService.createTodo({
        title: todoData.title!,
        description: todoData.description!,
        priority: todoData.priority! as 'low' | 'medium' | 'high'
      });
      setTodos(updatedTodos);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  const handleUpdateTodo = async (todoData: Partial<Todo>) => {
    if (!editingTodo) return;
    try {
      const updatedTodo = await ApiService.updateTodo(editingTodo.id, {
        title: todoData.title,
        description: todoData.description,
        completed: todoData.completed,
        priority: todoData.priority
      });
      setTodos(todos.map(todo => 
        todo.id === editingTodo.id ? updatedTodo : todo
      ));
      setEditingTodo(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleToggleComplete = async (id: number) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    try {
      await ApiService.updateTodo(id, { completed: !todo.completed });
      setTodos(todos.map(t => 
        t.id === id ? { ...t, completed: !t.completed } : t
      ));
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const handleDelete = async (id: number) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    setDeletingTodo(todo);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingTodo) return;
    try {
      await ApiService.deleteTodo(deletingTodo.id);
      setTodos(todos.filter(todo => todo.id !== deletingTodo.id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
    setDeletingTodo(null);
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">待办事项</h1>
        <button
          onClick={() => {
            setEditingTodo(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          创建新任务
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTodo(null);
        }}
        title={editingTodo ? "编辑任务" : "创建新任务"}
      >
        <TodoForm
          initialData={editingTodo || undefined}
          onSubmit={editingTodo ? handleUpdateTodo : handleCreateTodo}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingTodo(null);
          }}
        />
      </Modal>

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        title="确认删除"
        message={`确定要删除任务"${deletingTodo?.title}"吗？此操作不可撤销。`}
      />

      <TodoList
        todos={todos}
        onToggleComplete={handleToggleComplete}
        onDelete={handleDelete}
        onEdit={(todo) => {
          setEditingTodo(todo);
          setIsModalOpen(true);
        }}
        onSearch={setSearchTerm}
        searchTerm={searchTerm}
      />
    </main>
  );
} 