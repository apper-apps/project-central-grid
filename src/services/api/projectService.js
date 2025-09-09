import { toast } from "react-toastify";
import React from "react";
import Error from "@/components/ui/Error";
import { create, getAll, getById, update } from "@/services/api/teamMemberService";

class ProjectService {
  constructor() {
    this.tableName = 'project_c';
    this.lookupFields = ['client_id_c'];
  }

  // Initialize ApperClient
  getApperClient() {
    const { ApperClient } = window.ApperSDK;
    return new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  // Identify and prepare lookup fields
  identifyLookupFields(tableSchema) {
    this.lookupFields = tableSchema?.fields
      ?.filter(field => field.type === 'Lookup')
      ?.map(field => field.name) || ['client_id_c'];
  }

  prepareLookupFields(data) {
    const prepared = { ...data };
    this.lookupFields.forEach(fieldName => {
      if (prepared[fieldName] !== undefined && prepared[fieldName] !== null) {
        prepared[fieldName] = prepared[fieldName]?.Id || prepared[fieldName];
      }
    });
    return prepared;
  }
// Get all projects
  async getAll() {
    try {
      const apperClient = this.getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "description_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "deadline_c" } },
          { field: { Name: "deliverables_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "chat_enabled_c" } },
          { field: { Name: "client_id_c" } }
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
        console.error("Error fetching projects:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }
// Get project by ID
  async getById(id) {
    if (!id || id === null || id === undefined || id === '') {
      throw new Error("Valid project ID is required");
    }
    
    const numericId = parseInt(id);
    if (isNaN(numericId) || numericId <= 0) {
      throw new Error("Valid project ID is required");
    }
    
    try {
      const apperClient = this.getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "description_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "deadline_c" } },
          { field: { Name: "deliverables_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "chat_enabled_c" } },
          { field: { Name: "client_id_c" } }
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, numericId, params);
      
      if (!response || !response.data) {
        throw new Error("Project not found");
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching project with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw new Error("Project not found");
    }
  }

// Create new project
  async create(projectData) {
    try {
      const apperClient = this.getApperClient();
      
      // Only include updateable fields
      const params = {
        records: [{
          Name: projectData.Name || projectData.name,
          Tags: projectData.Tags || "",
          description_c: projectData.description_c || projectData.description || "",
          status_c: projectData.status_c || projectData.status || "Planning",
          deadline_c: projectData.deadline_c || projectData.deadline || "",
          deliverables_c: projectData.deliverables_c || projectData.deliverables || "",
          created_at_c: new Date().toISOString(),
          chat_enabled_c: projectData.chat_enabled_c !== undefined ? projectData.chat_enabled_c : true,
          client_id_c: projectData.client_id_c ? parseInt(projectData.client_id_c) : (projectData.clientId ? parseInt(projectData.clientId) : null)
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
          console.error(`Failed to create projects ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
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
        console.error("Error creating project:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

// Update project
  async update(id, projectData) {
    try {
      const apperClient = this.getApperClient();
      
      // Only include updateable fields
      const updateData = {
        Id: parseInt(id)
      };
      
      if (projectData.Name !== undefined) updateData.Name = projectData.Name;
      if (projectData.name !== undefined) updateData.Name = projectData.name;
      if (projectData.Tags !== undefined) updateData.Tags = projectData.Tags;
      if (projectData.description_c !== undefined) updateData.description_c = projectData.description_c;
      if (projectData.description !== undefined) updateData.description_c = projectData.description;
      if (projectData.status_c !== undefined) updateData.status_c = projectData.status_c;
      if (projectData.status !== undefined) updateData.status_c = projectData.status;
      if (projectData.deadline_c !== undefined) updateData.deadline_c = projectData.deadline_c;
      if (projectData.deadline !== undefined) updateData.deadline_c = projectData.deadline;
      if (projectData.deliverables_c !== undefined) updateData.deliverables_c = projectData.deliverables_c;
      if (projectData.deliverables !== undefined) updateData.deliverables_c = projectData.deliverables;
      if (projectData.chat_enabled_c !== undefined) updateData.chat_enabled_c = projectData.chat_enabled_c;
      if (projectData.chatEnabled !== undefined) updateData.chat_enabled_c = projectData.chatEnabled;
      if (projectData.client_id_c !== undefined) updateData.client_id_c = parseInt(projectData.client_id_c);
      if (projectData.clientId !== undefined) updateData.client_id_c = parseInt(projectData.clientId);
      
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
          console.error(`Failed to update projects ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
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
        console.error("Error updating project:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

// Delete project
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
          console.error(`Failed to delete projects ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting project:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return false;
    }
  }

}

export default new ProjectService();