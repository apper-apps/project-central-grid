import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import StatCard from "@/components/molecules/StatCard";
import TodaysTasks from "@/components/molecules/TodaysTasks";
import Card from "@/components/atoms/Card";
import Projects from "@/components/pages/Projects";
import Tasks from "@/components/pages/Tasks";
import projectService from "@/services/api/projectService";
import taskService from "@/services/api/taskService";
import clientService from "@/services/api/clientService";
import { getAll } from "@/services/api/teamMemberService";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalActiveClients: 0,
    activeProjects: 0,
    tasksDueToday: 0,
    overdueTasks: 0
  });
const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [clients, projects, tasks] = await Promise.all([
        clientService.getAll(),
        projectService.getAll(),
        taskService.getAll()
      ]);
      
      // Calculate metrics using database field names
      const activeClients = clients.filter(client => client.status_c === "Active").length;
      const activeProjects = projects.filter(project => 
        project.status_c === "In Progress" || project.status_c === "Planning"
      ).length;
      
      const today = new Date().toISOString().split('T')[0];
      const tasksDueToday = tasks.filter(task => 
        !task.completed_c && task.due_date_c === today
      ).length;
      
      const overdueTasks = tasks.filter(task => {
        if (task.completed_c || !task.due_date_c) return false;
        return new Date(task.due_date_c) < new Date(today);
      }).length;
      
      setStats({
        totalActiveClients: activeClients,
        activeProjects,
        tasksDueToday,
        overdueTasks
      });
      
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
      toast.error("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Trigger refresh of Today's Tasks when dashboard data changes
  useEffect(() => {
    setRefreshKey(prev => prev + 1);
  }, [stats]);
  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Overview of your business management</p>
        </div>
        <Loading type="stats" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Overview of your business management</p>
        </div>
        <Error message={error} onRetry={loadDashboardData} />
      </div>
    );
  }

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold gradient-text mb-3">
          Welcome to Your Dashboard
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Track your progress, manage your work, and stay on top of your business metrics
        </p>
      </div>

      {/* Business Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Clients"
          value={stats.totalActiveClients}
          icon="Users"
          color="blue"
        />
        <StatCard
          title="Active Projects"
          value={stats.activeProjects}
          icon="Briefcase"
          color="green"
        />
        <StatCard
          title="Due Today"
          value={stats.tasksDueToday}
          icon="Clock"
          color="orange"
        />
        <StatCard
          title="Overdue Tasks"
          value={stats.overdueTasks}
          icon="AlertTriangle"
          color="red"
        />
      </div>

      {/* Personal Workspace Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* My Milestones */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <ApperIcon name="Target" size={20} className="text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">My Milestones</h2>
                <p className="text-sm text-gray-500">Track your key achievements</p>
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
<div className="space-y-4 max-h-80 overflow-y-auto">
              <div className="text-center py-6 text-gray-500">
                <ApperIcon name="Target" size={32} className="mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No upcoming milestones</p>
                <p className="text-xs mt-1">Milestones will appear here as they approach their due dates</p>
              </div>
            </div>
          )}
        </Card>

        {/* My Projects */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <ApperIcon name="Briefcase" size={20} className="text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">My Projects</h2>
                <p className="text-sm text-gray-500">Active project overview</p>
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-2 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
<div className="space-y-4 max-h-80 overflow-y-auto">
              <div className="text-center py-6 text-gray-500">
                <ApperIcon name="Briefcase" size={32} className="mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Recent project activity</p>
                <p className="text-xs mt-1">Project updates and progress will appear here</p>
              </div>
            </div>
        </Card>

        {/* My Tasks */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <ApperIcon name="CheckSquare" size={20} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">My Tasks</h2>
                <p className="text-sm text-gray-500">Your upcoming work</p>
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
))}
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              <div className="text-center py-6 text-gray-500">
                <ApperIcon name="CheckSquare" size={32} className="mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Recent task activity</p>
                <p className="text-xs mt-1">Task completions and updates will appear here</p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Today's Tasks Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-100">
              <ApperIcon name="Calendar" size={20} className="text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Today's Focus</h2>
              <p className="text-sm text-gray-500">Tasks scheduled for today</p>
            </div>
          </div>
        </div>
        <TodaysTasks key={refreshKey} />
      </Card>
</div>
  );
};

export default Dashboard;