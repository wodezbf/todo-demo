'use client';

import React, { useState } from 'react';
import { Todo } from '../types/todo';

interface TodoListProps {
  todos: Todo[];
  onToggleComplete: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (todo: Todo) => void;
  onSearch: (term: string) => void;
  searchTerm: string;
}

export default function TodoList({ 
  todos, 
  onToggleComplete, 
  onDelete, 
  onEdit,
  onSearch,
  searchTerm
}: TodoListProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-4 border-red-500';
      case 'medium':
        return 'border-l-4 border-yellow-500';
      case 'low':
        return 'border-l-4 border-green-500';
      default:
        return '';
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-4">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          全部
        </button>
        <button
          type="button"
          onClick={() => setFilter('active')}
          className={`px-4 py-2 rounded ${filter === 'active' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          未完成
        </button>
        <button
          type="button"
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded ${filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          已完成
        </button>

        <div className="relative flex-1 max-w-xs ml-4">
          <input
            type="text"
            placeholder="快速搜索关键字"
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchTerm && (
            <button
              onClick={() => onSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {filteredTodos.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">
            {searchTerm 
              ? '没有找到匹配的待办事项' 
              : filter === 'active' 
                ? '没有未完成的待办事项'
                : filter === 'completed'
                  ? '没有已完成的待办事项'
                  : '暂无待办事项，点击右上角添加新任务'}
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {filteredTodos.map(todo => (
            <li 
              key={todo.id} 
              className={`flex items-center gap-4 p-4 bg-white rounded shadow ${getPriorityColor(todo.priority)}`}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => onToggleComplete(todo.id)}
                className="w-5 h-5"
              />
              <div className="flex-1">
                <h3 className={`font-medium ${todo.completed ? 'line-through text-gray-400' : ''}`}>
                  {todo.title}
                </h3>
                <p className="text-gray-600 mb-1">{todo.description}</p>
                <p className="text-xs text-gray-400">
                  更新于: {formatDateTime(todo.updated_at)}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(todo)}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  编辑
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(todo.id)}
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                >
                  删除
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 