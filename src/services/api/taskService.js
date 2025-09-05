import { toast } from 'react-toastify';

class TaskService {
  constructor() {
    this.tableName = 'task_c';
    this.lookupFields = ['project_id_c'];
  }

  // Initialize ApperClient
  getApperClient() {
    const { ApperClient } = window.ApperSDK;
    return new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  // Get all tasks
  async getAll() {
    try {
      const apperClient = this.getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "description_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "start_date_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "project_id_c" } }
        ]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching tasks:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }

  // Get task by ID
  async getById(id) {
    try {
      const apperClient = this.getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "description_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "start_date_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "project_id_c" } }
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response || !response.data) {
        return null;
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching task with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  // Create new task
  async create(taskData) {
    try {
      const apperClient = this.getApperClient();
      
      // Only include updateable fields
      const params = {
        records: [{
          Name: taskData.Name || taskData.title || taskData.name,
          Tags: taskData.Tags || "",
          description_c: taskData.description_c || taskData.description || "",
          completed_c: taskData.completed_c || false,
          priority_c: taskData.priority_c || taskData.priority || "Medium",
          start_date_c: taskData.start_date_c || taskData.startDate || new Date().toISOString().split('T')[0],
          due_date_c: taskData.due_date_c || taskData.dueDate || "",
          created_at_c: new Date().toISOString(),
          status_c: taskData.status_c || taskData.status || "To Do",
          project_id_c: taskData.project_id_c ? parseInt(taskData.project_id_c) : (taskData.projectId ? parseInt(taskData.projectId) : null)
        }]
      };

      const response = await apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create tasks ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating task:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  // Update task
  async update(id, taskData) {
    try {
      const apperClient = this.getApperClient();
      
      // Only include updateable fields
      const updateData = {
        Id: parseInt(id)
      };
      
      if (taskData.Name !== undefined) updateData.Name = taskData.Name;
      if (taskData.name !== undefined) updateData.Name = taskData.name;
      if (taskData.title !== undefined) updateData.Name = taskData.title;
      if (taskData.Tags !== undefined) updateData.Tags = taskData.Tags;
      if (taskData.description_c !== undefined) updateData.description_c = taskData.description_c;
      if (taskData.description !== undefined) updateData.description_c = taskData.description;
      if (taskData.completed_c !== undefined) updateData.completed_c = taskData.completed_c;
      if (taskData.completed !== undefined) updateData.completed_c = taskData.completed;
      if (taskData.priority_c !== undefined) updateData.priority_c = taskData.priority_c;
      if (taskData.priority !== undefined) updateData.priority_c = taskData.priority;
      if (taskData.start_date_c !== undefined) updateData.start_date_c = taskData.start_date_c;
      if (taskData.startDate !== undefined) updateData.start_date_c = taskData.startDate;
      if (taskData.due_date_c !== undefined) updateData.due_date_c = taskData.due_date_c;
      if (taskData.dueDate !== undefined) updateData.due_date_c = taskData.dueDate;
      if (taskData.status_c !== undefined) updateData.status_c = taskData.status_c;
      if (taskData.status !== undefined) updateData.status_c = taskData.status;
      if (taskData.project_id_c !== undefined) updateData.project_id_c = parseInt(taskData.project_id_c);
      if (taskData.projectId !== undefined) updateData.project_id_c = parseInt(taskData.projectId);
      
      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update tasks ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating task:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  // Delete task
  async delete(id) {
    try {
      const apperClient = this.getApperClient();
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete tasks ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting task:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return false;
    }
  }

  // Get tasks by project ID
  async getByProjectId(projectId) {
    try {
      const apperClient = this.getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "description_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "start_date_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "project_id_c" } }
        ],
        where: [
          {
            FieldName: "project_id_c",
            Operator: "EqualTo",
            Values: [parseInt(projectId)]
          }
        ]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching tasks by project:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }

  // Mark task as complete
  async markComplete(id) {
    return this.update(id, { completed_c: true });
  }

  // Update task status
  async updateStatus(id, status) {
    return this.update(id, { 
      status_c: status,
      completed_c: status === 'Done' || status === 'Completed'
    });
  }
}

const taskService = new TaskService();
export default taskService;