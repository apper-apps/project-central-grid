import { toast } from 'react-toastify';

class TaskListService {
  constructor() {
    this.tableName = 'task_list_c';
  }

  // Initialize ApperClient
  getApperClient() {
    const { ApperClient } = window.ApperSDK;
    return new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  // Get all task lists
  async getAll() {
    try {
      const apperClient = this.getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "description_c" } },
          { field: { Name: "tasks_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "milestone_id_c" } },
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
        console.error("Error fetching task lists:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }

  // Get task list by ID
  async getById(id) {
    try {
      const apperClient = this.getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "description_c" } },
          { field: { Name: "tasks_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "milestone_id_c" } },
          { field: { Name: "project_id_c" } }
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response || !response.data) {
        throw new Error("Task list not found");
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching task list with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw new Error("Task list not found");
    }
  }

  // Create new task list
  async create(taskListData) {
    try {
      const apperClient = this.getApperClient();
      
      // Only include updateable fields
      const params = {
        records: [{
          Name: taskListData.Name || taskListData.name,
          Tags: taskListData.Tags || "",
          description_c: taskListData.description_c || taskListData.description || "",
          tasks_c: taskListData.tasks_c || "",
          created_at_c: new Date().toISOString(),
          milestone_id_c: taskListData.milestone_id_c ? parseInt(taskListData.milestone_id_c) : (taskListData.milestoneId ? parseInt(taskListData.milestoneId) : null),
          project_id_c: taskListData.project_id_c ? parseInt(taskListData.project_id_c) : (taskListData.projectId ? parseInt(taskListData.projectId) : null)
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
          console.error(`Failed to create task lists ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
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
        console.error("Error creating task list:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  // Update task list
  async update(id, taskListData) {
    try {
      const apperClient = this.getApperClient();
      
      // Only include updateable fields
      const updateData = {
        Id: parseInt(id)
      };
      
      if (taskListData.Name !== undefined) updateData.Name = taskListData.Name;
      if (taskListData.name !== undefined) updateData.Name = taskListData.name;
      if (taskListData.Tags !== undefined) updateData.Tags = taskListData.Tags;
      if (taskListData.description_c !== undefined) updateData.description_c = taskListData.description_c;
      if (taskListData.description !== undefined) updateData.description_c = taskListData.description;
      if (taskListData.tasks_c !== undefined) updateData.tasks_c = taskListData.tasks_c;
      if (taskListData.milestone_id_c !== undefined) updateData.milestone_id_c = parseInt(taskListData.milestone_id_c);
      if (taskListData.milestoneId !== undefined) updateData.milestone_id_c = parseInt(taskListData.milestoneId);
      if (taskListData.project_id_c !== undefined) updateData.project_id_c = parseInt(taskListData.project_id_c);
      if (taskListData.projectId !== undefined) updateData.project_id_c = parseInt(taskListData.projectId);
      
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
          console.error(`Failed to update task lists ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
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
        console.error("Error updating task list:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  // Delete task list
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
          console.error(`Failed to delete task lists ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting task list:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return false;
    }
  }

  // Get task lists by milestone ID
  async getByMilestoneId(milestoneId) {
    try {
      const apperClient = this.getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "description_c" } },
          { field: { Name: "tasks_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "milestone_id_c" } },
          { field: { Name: "project_id_c" } }
        ],
        where: [
          {
            FieldName: "milestone_id_c",
            Operator: "EqualTo",
            Values: [parseInt(milestoneId)]
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
        console.error("Error fetching task lists by milestone:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }

  // Get task lists by project ID
  async getByProjectId(projectId) {
    try {
      const apperClient = this.getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "description_c" } },
          { field: { Name: "tasks_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "milestone_id_c" } },
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
        console.error("Error fetching task lists by project:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }
}

export default new TaskListService();