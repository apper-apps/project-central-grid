import { toast } from 'react-toastify';

class ClientService {
  constructor() {
    this.tableName = 'client_c';
  }

  // Initialize ApperClient
  getApperClient() {
    const { ApperClient } = window.ApperSDK;
    return new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  // Get all clients
  async getAll() {
    try {
      const apperClient = this.getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "company_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "website_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "industry_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "created_at_c" } }
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
        console.error("Error fetching clients:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }

  // Get client by ID
  async getById(id) {
    if (!id) {
      throw new Error("Client ID is required");
    }

    try {
      const apperClient = this.getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "company_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "website_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "industry_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "created_at_c" } }
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response || !response.data) {
        throw new Error("Client not found");
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching client with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw new Error("Client not found");
    }
  }

  // Get projects by client ID
  async getProjectsByClientId(clientId) {
    try {
      const { default: projectService } = await import("./projectService.js");
      const allProjects = await projectService.getAll();
      return allProjects.filter(project => 
        project.client_id_c?.Id === parseInt(clientId) || 
        project.client_id_c === parseInt(clientId)
      );
    } catch (error) {
      console.error("Error fetching projects by client:", error);
      return [];
    }
  }

  // Create new client
  async create(clientData) {
    try {
      const apperClient = this.getApperClient();
      
      // Only include updateable fields
      const params = {
        records: [{
          Name: clientData.Name || clientData.name,
          Tags: clientData.Tags || "",
          company_c: clientData.company_c || clientData.company || "",
          email_c: clientData.email_c || clientData.email || "",
          phone_c: clientData.phone_c || clientData.phone || "",
          website_c: clientData.website_c || clientData.website || "",
          address_c: clientData.address_c || clientData.address || "",
          industry_c: clientData.industry_c || clientData.industry || "",
          status_c: clientData.status_c || clientData.status || "Active",
          created_at_c: new Date().toISOString()
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
          console.error(`Failed to create clients ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
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
        console.error("Error creating client:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  // Update client
  async update(id, clientData) {
    try {
      const apperClient = this.getApperClient();
      
      // Only include updateable fields
      const updateData = {
        Id: parseInt(id)
      };
      
      if (clientData.Name !== undefined) updateData.Name = clientData.Name;
      if (clientData.name !== undefined) updateData.Name = clientData.name;
      if (clientData.Tags !== undefined) updateData.Tags = clientData.Tags;
      if (clientData.company_c !== undefined) updateData.company_c = clientData.company_c;
      if (clientData.company !== undefined) updateData.company_c = clientData.company;
      if (clientData.email_c !== undefined) updateData.email_c = clientData.email_c;
      if (clientData.email !== undefined) updateData.email_c = clientData.email;
      if (clientData.phone_c !== undefined) updateData.phone_c = clientData.phone_c;
      if (clientData.phone !== undefined) updateData.phone_c = clientData.phone;
      if (clientData.website_c !== undefined) updateData.website_c = clientData.website_c;
      if (clientData.website !== undefined) updateData.website_c = clientData.website;
      if (clientData.address_c !== undefined) updateData.address_c = clientData.address_c;
      if (clientData.address !== undefined) updateData.address_c = clientData.address;
      if (clientData.industry_c !== undefined) updateData.industry_c = clientData.industry_c;
      if (clientData.industry !== undefined) updateData.industry_c = clientData.industry;
      if (clientData.status_c !== undefined) updateData.status_c = clientData.status_c;
      if (clientData.status !== undefined) updateData.status_c = clientData.status;
      
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
          console.error(`Failed to update clients ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
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
        console.error("Error updating client:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  // Delete client
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
          console.error(`Failed to delete clients ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting client:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return false;
    }
  }
}

export default new ClientService();