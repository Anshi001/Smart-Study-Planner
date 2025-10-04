import React from 'react';
import { Task, StudyGoal } from '../types';
import { 
  BookOpen, 
  Clock, 
  Target, 
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Calendar
} from 'lucide-react';

interface DashboardProps {
  tasks: Task[];
  goals: StudyGoal[];
}

export const Dashboard: React.FC<DashboardProps> = ({ tasks, goals }) => {
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const overdueTasks = tasks.filter(task => 
    !task.completed && new Date(task.dueDate) < new Date()
  ).length;

  const dueSoonTasks = tasks.filter(task =>
    !task.completed && 
    new Date(task.dueDate) <= new Date(Date.now() + 24 * 60 * 60 * 1000) &&
    new Date(task.dueDate) >= new Date()
  ).length;

  const activeGoals = goals.filter(goal => goal.progress < 100).length;
  const completedGoals = goals.filter(goal => goal.progress >= 100).length;

  const upcomingTasks = tasks
    .filter(task => !task.completed)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  const subjectStats = tasks.reduce((acc, task) => {
    if (!acc[task.subject]) {
      acc[task.subject] = { total: 0, completed: 0 };
    }
    acc[task.subject].total++;
    if (task.completed) {
      acc[task.subject].completed++;
    }
    return acc;
  }, {} as Record<string, { total: number; completed: number }>);

  const stats = [
    {
      title: 'Task Completion',
      value: `${completedTasks}/${totalTasks}`,
      percentage: completionRate,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Overdue Tasks',
      value: overdueTasks.toString(),
      icon: AlertCircle,
      color: overdueTasks > 0 ? 'text-red-600' : 'text-gray-400',
      bgColor: overdueTasks > 0 ? 'bg-red-50' : 'bg-gray-50',
    },
    {
      title: 'Due Soon',
      value: dueSoonTasks.toString(),
      icon: Clock,
      color: dueSoonTasks > 0 ? 'text-amber-600' : 'text-gray-400',
      bgColor: dueSoonTasks > 0 ? 'bg-amber-50' : 'bg-gray-50',
    },
    {
      title: 'Active Goals',
      value: `${activeGoals}/${goals.length}`,
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome back!</h2>
        <p className="text-blue-100">
          {completionRate >= 80 
            ? "Great job! You're staying on top of your studies."
            : "Let's make today productive. You've got this!"
          }
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  {stat.percentage !== undefined && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${stat.percentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{stat.percentage.toFixed(0)}%</p>
                    </div>
                  )}
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Tasks</h3>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          
          {upcomingTasks.length > 0 ? (
            <div className="space-y-3">
              {upcomingTasks.map(task => {
                const isOverdue = new Date(task.dueDate) < new Date();
                const isDueSoon = new Date(task.dueDate) <= new Date(Date.now() + 24 * 60 * 60 * 1000);
                
                return (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{task.title}</p>
                      <p className="text-sm text-gray-600">{task.subject}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${
                        isOverdue ? 'text-red-600' : isDueSoon ? 'text-amber-600' : 'text-gray-600'
                      }`}>
                        {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                      <p className={`text-xs px-2 py-1 rounded-full ${
                        task.priority === 'high' ? 'bg-red-100 text-red-700' :
                        task.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {task.priority}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No upcoming tasks</p>
          )}
        </div>

        {/* Subject Progress */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Subject Progress</h3>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          
          {Object.keys(subjectStats).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(subjectStats).map(([subject, stats]) => {
                const percentage = (stats.completed / stats.total) * 100;
                return (
                  <div key={subject}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{subject}</span>
                      <span className="text-sm text-gray-600">{stats.completed}/{stats.total}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No tasks created yet</p>
          )}
        </div>
      </div>
    </div>
  );
};