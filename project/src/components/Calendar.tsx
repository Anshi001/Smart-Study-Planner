import React, { useState } from 'react';
import { Task } from '../types';
import { ChevronLeft, ChevronRight, Clock, AlertTriangle } from 'lucide-react';

interface CalendarProps {
  tasks: Task[];
}

export const Calendar: React.FC<CalendarProps> = ({ tasks }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getTasksForDate = (date: number) => {
    const dateString = new Date(currentDate.getFullYear(), currentDate.getMonth(), date)
      .toISOString().split('T')[0];
    return tasks.filter(task => task.dueDate === dateString);
  };

  const isToday = (date: number) => {
    const today = new Date();
    return today.getDate() === date &&
           today.getMonth() === currentDate.getMonth() &&
           today.getFullYear() === currentDate.getFullYear();
  };

  const renderCalendarDays = () => {
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayTasks = getTasksForDate(day);
      const overdueTasks = dayTasks.filter(task => !task.completed && new Date(task.dueDate) < new Date());
      const pendingTasks = dayTasks.filter(task => !task.completed);
      const completedTasks = dayTasks.filter(task => task.completed);
      
      days.push(
        <div
          key={day}
          className={`p-2 min-h-[80px] border border-gray-200 bg-white relative ${
            isToday(day) ? 'bg-blue-50 border-blue-300' : ''
          }`}
        >
          <div className={`text-sm font-medium mb-1 ${
            isToday(day) ? 'text-blue-600' : 'text-gray-700'
          }`}>
            {day}
          </div>
          
          <div className="space-y-1">
            {dayTasks.slice(0, 3).map(task => (
              <div
                key={task.id}
                className={`text-xs px-1 py-0.5 rounded truncate ${
                  task.completed
                    ? 'bg-green-100 text-green-800'
                    : overdueTasks.includes(task)
                    ? 'bg-red-100 text-red-800'
                    : task.priority === 'high'
                    ? 'bg-red-100 text-red-800'
                    : task.priority === 'medium'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
                title={task.title}
              >
                {task.title}
              </div>
            ))}
            
            {dayTasks.length > 3 && (
              <div className="text-xs text-gray-500 px-1">
                +{dayTasks.length - 3} more
              </div>
            )}
          </div>
          
          {overdueTasks.length > 0 && (
            <AlertTriangle className="h-3 w-3 text-red-500 absolute top-1 right-1" />
          )}
        </div>
      );
    }
    
    return days;
  };

  const upcomingTasks = tasks
    .filter(task => !task.completed)
    .filter(task => {
      const taskDate = new Date(task.dueDate);
      const today = new Date();
      const inTwoWeeks = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
      return taskDate >= today && taskDate <= inTwoWeeks;
    })
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Calendar</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Today
                </button>
                <button
                  onClick={() => navigateMonth('next')}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-px mb-2">
              {dayNames.map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-700">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-px bg-gray-200">
              {renderCalendarDays()}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Legend */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h4 className="font-medium text-gray-900 mb-3">Legend</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                <span className="text-gray-700">Completed</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
                <span className="text-gray-700">Overdue/High Priority</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-amber-100 border border-amber-300 rounded"></div>
                <span className="text-gray-700">Medium Priority</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div>
                <span className="text-gray-700">Low Priority</span>
              </div>
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Next 2 Weeks
            </h4>
            {upcomingTasks.length > 0 ? (
              <div className="space-y-2">
                {upcomingTasks.slice(0, 8).map(task => {
                  const isOverdue = new Date(task.dueDate) < new Date();
                  return (
                    <div key={task.id} className="text-sm">
                      <div className="flex items-center justify-between">
                        <span className={`font-medium ${
                          isOverdue ? 'text-red-600' : 'text-gray-900'
                        }`}>
                          {task.title}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{task.subject}</span>
                        <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  );
                })}
                {upcomingTasks.length > 8 && (
                  <div className="text-xs text-gray-500 text-center pt-2">
                    +{upcomingTasks.length - 8} more tasks
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No upcoming tasks</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};