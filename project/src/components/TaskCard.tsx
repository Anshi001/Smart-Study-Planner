import React from 'react';
import { Task } from '../types';
import { CheckCircle, Clock, AlertTriangle, Flag } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle, onEdit, onDelete }) => {
  const isOverdue = new Date(task.dueDate) < new Date() && !task.completed;
  const isDueSoon = new Date(task.dueDate) <= new Date(Date.now() + 24 * 60 * 60 * 1000) && !task.completed;

  const priorityColors = {
    low: 'text-green-600 bg-green-50',
    medium: 'text-amber-600 bg-amber-50',
    high: 'text-red-600 bg-red-50',
  };

  const priorityIcons = {
    low: Flag,
    medium: AlertTriangle,
    high: AlertTriangle,
  };

  const PriorityIcon = priorityIcons[task.priority];

  return (
    <div className={`bg-white rounded-lg border p-4 transition-all duration-200 hover:shadow-md ${
      task.completed ? 'opacity-60' : ''
    } ${isOverdue ? 'border-red-200 bg-red-50/50' : 'border-gray-200'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <button
            onClick={() => onToggle(task.id)}
            className={`flex-shrink-0 mt-1 transition-colors ${
              task.completed ? 'text-green-600' : 'text-gray-400 hover:text-green-600'
            }`}
          >
            <CheckCircle className={`h-5 w-5 ${task.completed ? 'fill-current' : ''}`} />
          </button>
          
          <div className="flex-1 min-w-0">
            <h3 className={`font-medium text-gray-900 ${task.completed ? 'line-through' : ''}`}>
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
            )}
            
            <div className="flex items-center space-x-4 mt-2">
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {task.subject}
              </span>
              
              <div className={`flex items-center text-xs px-2 py-1 rounded-full ${priorityColors[task.priority]}`}>
                <PriorityIcon className="h-3 w-3 mr-1" />
                {task.priority}
              </div>
              
              <div className={`flex items-center text-xs ${
                isOverdue ? 'text-red-600' : isDueSoon ? 'text-amber-600' : 'text-gray-500'
              }`}>
                <Clock className="h-3 w-3 mr-1" />
                {new Date(task.dueDate).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => onEdit(task)}
            className="text-gray-400 hover:text-blue-600 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          
          <button
            onClick={() => onDelete(task.id)}
            className="text-gray-400 hover:text-red-600 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};