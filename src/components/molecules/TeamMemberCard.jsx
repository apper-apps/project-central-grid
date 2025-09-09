import React from 'react';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';

function TeamMemberCard({ member, onEdit, onDelete, className = '' }) {
  const navigate = useNavigate();

  const getStatusBadge = (status) => {
const statusColors = {
      Active: 'status-completed',
      Away: 'status-in-progress', 
      Inactive: 'status-on-hold'
    };
    
    return statusColors[status] || statusColors.Inactive;
  };

  const getWorkloadColor = (workload, maxCapacity) => {
    const percentage = (workload / maxCapacity) * 100;
    if (percentage >= 100) return 'text-red-600';
    if (percentage >= 80) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getWorkloadBarColor = (workload, maxCapacity) => {
    const percentage = (workload / maxCapacity) * 100;
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

const workloadPercentage = Math.min(((member.current_workload_c || 0) / (member.max_capacity_c || 1)) * 100, 100);

  const handleViewDetails = () => {
    navigate(`/team/${member.Id}`);
  };

  return (
    <Card className={`hover:card-shadow-hover transition-all duration-200 ${className}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
src={member.avatar_c || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.Name || 'User')}&background=2563eb&color=fff`}
                alt={member.Name}
                className="w-12 h-12 rounded-full object-cover"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.Name || 'User')}&background=2563eb&color=fff`;
                }}
              />
<div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                member.status_c === 'Active' ? 'bg-green-500' : 
                member.status_c === 'Away' ? 'bg-yellow-500' : 'bg-gray-400'
              }`} style={{
                backgroundColor: member.status_c === 'Active' ? '#4CAF50' : 
                                member.status_c === 'Away' ? '#F1C40F' : '#9E9E9E'
              }} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{member.Name}</h3>
              <p className="text-sm text-gray-600">{member.role_c}</p>
              <p className="text-xs text-gray-500">{member.department_c}</p>
            </div>
          </div>
<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(member.status_c)}`}>
            {member.status_c}
          </span>
        </div>

        {/* Workload */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Current Workload</span>
<span className={`text-sm font-semibold ${getWorkloadColor(member.current_workload_c, member.max_capacity_c)}`}>
              {member.current_workload_c || 0}h / {member.max_capacity_c || 0}h
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
className={`h-2 rounded-full transition-all duration-300 ${getWorkloadBarColor(member.current_workload_c, member.max_capacity_c)}`}
              style={{ width: `${workloadPercentage}%` }}
            />
          </div>
        </div>

        {/* Projects */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Active Projects</span>
<span className="text-sm text-gray-600">{member.currentProjects?.length || 0}</span>
          </div>
          {(member.currentProjects?.length || 0) > 0 ? (
            <div className="space-y-1">
              {(member.currentProjects || []).slice(0, 2).map((project, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 truncate">{project.projectName}</span>
                  <span className="text-gray-500 ml-2">{project.hoursAllocated}h</span>
                </div>
              ))}
              {(member.currentProjects?.length || 0) > 2 && (
                <div className="text-xs text-gray-500">
                  +{(member.currentProjects?.length || 0) - 2} more projects
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-gray-500">No active projects</p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">
{(member.total_tasks_this_month_c || 0) > 0 ? Math.round(((member.completed_tasks_this_month_c || 0) / (member.total_tasks_this_month_c || 0)) * 100) : 0}%
            </div>
            <div className="text-xs text-gray-600">Task Completion</div>
          </div>
          <div className="text-center">
<div className="text-lg font-semibold text-gray-900">
              {member.average_task_completion_time_c || 0}d
            </div>
            <div className="text-xs text-gray-600">Avg. Completion</div>
          </div>
        </div>

        {/* Contact */}
        <div className="mb-4">
          <div className="flex items-center text-sm text-gray-600 mb-1">
            <ApperIcon name="Mail" size={14} className="mr-2" />
<span className="truncate">{member.email_c}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <ApperIcon name="MapPin" size={14} className="mr-2" />
            <span>{member.location_c}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleViewDetails}
style={{color: '#4A90E2'}} className="hover:opacity-80"
          >
            <ApperIcon name="Eye" size={16} className="mr-1" />
            View Details
          </Button>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(member)}
              className="text-gray-600 hover:text-gray-700"
            >
              <ApperIcon name="Edit" size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(member)}
              className="text-red-600 hover:text-red-700"
            >
              <ApperIcon name="Trash2" size={16} />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default TeamMemberCard;