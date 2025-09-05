import { toast } from "react-toastify";
import React from "react";
import { create, getAll, getById, update } from "@/services/api/teamMemberService";
import Error from "@/components/ui/Error";
// Team member data is fetched from database using ApperClient when needed

class TimeEntryService {
  constructor() {
    this.tableName = 'time_entry_c';
  }

  // Initialize ApperClient
  getApperClient() {
    const { ApperClient } = window.ApperSDK;
    return new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  // Get all time entries
  async getAll() {
    try {
      const apperClient = this.getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "description_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "duration_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "project_id_c" } },
          { field: { Name: "task_id_c" } }
        ],
        orderBy: [
          { fieldName: "date_c", sorttype: "DESC" }
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
        console.error("Error fetching time entries:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }

  // Get time entry by ID
  async getById(id) {
    try {
      const apperClient = this.getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "description_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "duration_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "project_id_c" } },
          { field: { Name: "task_id_c" } }
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response || !response.data) {
        throw new Error("Time entry not found");
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching time entry with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw new Error("Time entry not found");
    }
  }

  // Get time entries by project ID
  async getByProjectId(projectId) {
    try {
      const apperClient = this.getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "description_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "duration_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "project_id_c" } },
          { field: { Name: "task_id_c" } }
        ],
        where: [
          {
            FieldName: "project_id_c",
            Operator: "EqualTo",
            Values: [parseInt(projectId)]
          }
        ],
        orderBy: [
          { fieldName: "date_c", sorttype: "DESC" }
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
        console.error("Error fetching time entries by project:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }

  // Get time entries by task ID
  async getByTaskId(taskId) {
    try {
      const apperClient = this.getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "description_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "duration_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "project_id_c" } },
          { field: { Name: "task_id_c" } }
        ],
        where: [
          {
            FieldName: "task_id_c",
            Operator: "EqualTo",
            Values: [parseInt(taskId)]
          }
        ],
        orderBy: [
          { fieldName: "date_c", sorttype: "DESC" }
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
        console.error("Error fetching time entries by task:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }

  // Create new time entry
  async create(timeEntryData) {
    try {
      const apperClient = this.getApperClient();
      
      // Only include updateable fields
      const params = {
        records: [{
          Name: timeEntryData.Name || "Time Entry",
          Tags: timeEntryData.Tags || "",
          description_c: timeEntryData.description_c || timeEntryData.description || "",
          date_c: timeEntryData.date_c || timeEntryData.date || new Date().toISOString().split('T')[0],
          duration_c: parseFloat(timeEntryData.duration_c || timeEntryData.duration || 0),
          created_at_c: new Date().toISOString(),
          project_id_c: timeEntryData.project_id_c ? parseInt(timeEntryData.project_id_c) : (timeEntryData.projectId ? parseInt(timeEntryData.projectId) : null),
          task_id_c: timeEntryData.task_id_c ? parseInt(timeEntryData.task_id_c) : (timeEntryData.taskId ? parseInt(timeEntryData.taskId) : null)
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
          console.error(`Failed to create time entries ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
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
        console.error("Error creating time entry:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  // Create from timer (specialized method)
  async createFromTimer(timeEntryData) {
    return this.create(timeEntryData);
  }

  // Update time entry
  async update(id, timeEntryData) {
    try {
      const apperClient = this.getApperClient();
      
      // Only include updateable fields
      const updateData = {
        Id: parseInt(id)
      };
      
      if (timeEntryData.Name !== undefined) updateData.Name = timeEntryData.Name;
      if (timeEntryData.Tags !== undefined) updateData.Tags = timeEntryData.Tags;
      if (timeEntryData.description_c !== undefined) updateData.description_c = timeEntryData.description_c;
      if (timeEntryData.description !== undefined) updateData.description_c = timeEntryData.description;
      if (timeEntryData.date_c !== undefined) updateData.date_c = timeEntryData.date_c;
      if (timeEntryData.date !== undefined) updateData.date_c = timeEntryData.date;
      if (timeEntryData.duration_c !== undefined) updateData.duration_c = parseFloat(timeEntryData.duration_c);
      if (timeEntryData.duration !== undefined) updateData.duration_c = parseFloat(timeEntryData.duration);
      if (timeEntryData.project_id_c !== undefined) updateData.project_id_c = parseInt(timeEntryData.project_id_c);
      if (timeEntryData.projectId !== undefined) updateData.project_id_c = parseInt(timeEntryData.projectId);
      if (timeEntryData.task_id_c !== undefined) updateData.task_id_c = timeEntryData.task_id_c ? parseInt(timeEntryData.task_id_c) : null;
      if (timeEntryData.taskId !== undefined) updateData.task_id_c = timeEntryData.taskId ? parseInt(timeEntryData.taskId) : null;
      
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
          console.error(`Failed to update time entries ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
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
        console.error("Error updating time entry:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  // Delete time entry
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
          console.error(`Failed to delete time entries ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting time entry:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return false;
    }
  }

  // Bulk delete time entries
  async bulkDelete(entryIds) {
    try {
      const apperClient = this.getApperClient();
      const params = {
        RecordIds: entryIds.map(id => parseInt(id))
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
          console.error(`Failed to delete time entries ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length === entryIds.length;
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error bulk deleting time entries:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return false;
    }
  }

  // Export to CSV (utility method)
  async exportToCSV(entries, projects = []) {
    const projectMap = projects.reduce((acc, project) => {
      acc[project.Id] = project.Name;
      return acc;
    }, {});

    const csvHeaders = ['Date', 'Project', 'Description', 'Duration (hours)', 'Created At'];
    const csvRows = entries.map(entry => [
      entry.date_c,
      projectMap[entry.project_id_c?.Id || entry.project_id_c] || 'Unknown Project',
      `"${(entry.description_c || '').replace(/"/g, '""')}"`,
      entry.duration_c,
      entry.created_at_c
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `time-entries-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return true;
  }

  // Get times by project with date range
  async getTimesByProject(projectId, startDate, endDate) {
    try {
      const apperClient = this.getApperClient();
      const whereConditions = [
        {
          FieldName: "project_id_c",
          Operator: "EqualTo",
          Values: [parseInt(projectId)]
        }
      ];

      if (startDate) {
        whereConditions.push({
          FieldName: "date_c",
          Operator: "GreaterThanOrEqualTo",
          Values: [startDate]
        });
      }

      if (endDate) {
        whereConditions.push({
          FieldName: "date_c",
          Operator: "LessThanOrEqualTo",
          Values: [endDate]
        });
      }

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "description_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "duration_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "project_id_c" } },
          { field: { Name: "task_id_c" } }
        ],
        where: whereConditions,
        orderBy: [
          { fieldName: "date_c", sorttype: "DESC" }
        ]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching times by project:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }

  // Get times by date range
  async getTimesByDateRange(startDate, endDate) {
    try {
      const apperClient = this.getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "description_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "duration_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "project_id_c" } },
          { field: { Name: "task_id_c" } }
        ],
        where: [
          {
            FieldName: "date_c",
            Operator: "GreaterThanOrEqualTo",
            Values: [startDate]
          },
          {
            FieldName: "date_c",
            Operator: "LessThanOrEqualTo",
            Values: [endDate]
          }
        ],
        orderBy: [
          { fieldName: "date_c", sorttype: "DESC" }
        ]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching times by date range:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }

  // Get time summary by project
  async getTimeSummaryByProject() {
    try {
      const entries = await this.getAll();
      
      const summary = entries.reduce((acc, entry) => {
        const projectId = entry.project_id_c?.Id || entry.project_id_c;
        if (!acc[projectId]) {
          acc[projectId] = {
            projectId,
            totalHours: 0,
            totalEntries: 0,
            dates: []
          };
        }
        
        acc[projectId].totalHours += entry.duration_c || 0;
        acc[projectId].totalEntries += 1;
        acc[projectId].dates.push(entry.date_c);
        
        return acc;
      }, {});

      Object.values(summary).forEach(project => {
        project.dates = [...new Set(project.dates)].sort();
        project.totalHours = Math.round(project.totalHours * 100) / 100;
      });

      return Object.values(summary);
    } catch (error) {
      console.error("Error getting time summary by project:", error);
      return [];
    }
  }

  // Search entries
  async searchEntries(searchTerm) {
    try {
      if (!searchTerm || searchTerm.trim() === '') {
        return this.getAll();
      }

      const apperClient = this.getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "description_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "duration_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "project_id_c" } },
          { field: { Name: "task_id_c" } }
        ],
        where: [
          {
            FieldName: "description_c",
            Operator: "Contains",
            Values: [searchTerm.trim()]
          }
        ],
        orderBy: [
          { fieldName: "date_c", sorttype: "DESC" }
        ]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error searching time entries:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
}
  }
}

export default new TimeEntryService();