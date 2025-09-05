// Team Member Service - Apper Backend Integration
// Uses team_member_c table from the database

// Table: team_member_c
// Fields: Name, email_c, role_c, department_c, status_c, avatar_c, phone_c, location_c, 
//         start_date_c, skills_c, current_workload_c, max_capacity_c, 
//         completed_tasks_this_month_c, total_tasks_this_month_c, average_task_completion_time_c

const TABLE_NAME = 'team_member_c';

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

// Define fields to fetch (all available fields)
const getAllFields = () => [
  { field: { Name: "Name" } },
  { field: { Name: "email_c" } },
  { field: { Name: "role_c" } },
  { field: { Name: "department_c" } },
  { field: { Name: "status_c" } },
  { field: { Name: "avatar_c" } },
  { field: { Name: "phone_c" } },
  { field: { Name: "location_c" } },
  { field: { Name: "start_date_c" } },
  { field: { Name: "skills_c" } },
  { field: { Name: "current_workload_c" } },
  { field: { Name: "max_capacity_c" } },
  { field: { Name: "completed_tasks_this_month_c" } },
  { field: { Name: "total_tasks_this_month_c" } },
  { field: { Name: "average_task_completion_time_c" } },
  { field: { Name: "Tags" } }
];

// Helper function to prepare data for create/update (only Updateable fields)
const prepareTeamMemberData = (data) => {
  const updateableData = {};
  
  // Only include Updateable fields based on the schema
  if (data.Name !== undefined) updateableData.Name = String(data.Name || '');
  if (data.email_c !== undefined) updateableData.email_c = String(data.email_c || '');
  if (data.role_c !== undefined) updateableData.role_c = String(data.role_c || '');
  if (data.department_c !== undefined) updateableData.department_c = String(data.department_c || '');
  if (data.status_c !== undefined) updateableData.status_c = String(data.status_c || '');
  if (data.avatar_c !== undefined) updateableData.avatar_c = String(data.avatar_c || '');
  if (data.phone_c !== undefined) updateableData.phone_c = String(data.phone_c || '');
  if (data.location_c !== undefined) updateableData.location_c = String(data.location_c || '');
  if (data.start_date_c !== undefined) updateableData.start_date_c = data.start_date_c; // Date format
  if (data.skills_c !== undefined) updateableData.skills_c = String(data.skills_c || '');
  if (data.current_workload_c !== undefined) updateableData.current_workload_c = Number(data.current_workload_c) || 0;
  if (data.max_capacity_c !== undefined) updateableData.max_capacity_c = Number(data.max_capacity_c) || 0;
  if (data.completed_tasks_this_month_c !== undefined) updateableData.completed_tasks_this_month_c = Number(data.completed_tasks_this_month_c) || 0;
  if (data.total_tasks_this_month_c !== undefined) updateableData.total_tasks_this_month_c = Number(data.total_tasks_this_month_c) || 0;
  if (data.average_task_completion_time_c !== undefined) updateableData.average_task_completion_time_c = parseFloat(data.average_task_completion_time_c) || 0;
  if (data.Tags !== undefined) updateableData.Tags = String(data.Tags || '');

  return updateableData;
};

// Get all team members
export const getAll = async () => {
  try {
    const apperClient = getApperClient();
    const params = {
      fields: getAllFields(),
      orderBy: [
        { fieldName: "Name", sorttype: "ASC" }
      ]
    };
    
    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return response.data || [];
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching team members:", error.response.data.message);
    } else {
      console.error("Error fetching team members:", error);
    }
    throw error;
  }
};

// Get team member by ID
export const getById = async (id) => {
  try {
    const memberId = parseInt(id);
    if (isNaN(memberId)) {
      throw new Error('Invalid team member ID');
    }
    
    const apperClient = getApperClient();
    const params = { fields: getAllFields() };
    
    const response = await apperClient.getRecordById(TABLE_NAME, memberId, params);
    
    if (!response.success) {
      console.error(response.message);
      return null;
    }
    
    return response.data;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error(`Error fetching team member with ID ${id}:`, error.response.data.message);
    } else {
      console.error("Error fetching team member:", error);
    }
    return null;
  }
};

// Create new team member
export const create = async (memberData) => {
  try {
    const apperClient = getApperClient();
    const preparedData = prepareTeamMemberData(memberData);
    
    const params = {
      records: [preparedData]
    };
    
    const response = await apperClient.createRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create ${failedRecords.length} team member records: ${JSON.stringify(failedRecords)}`);
        
        failedRecords.forEach(record => {
          record.errors?.forEach(error => {
            throw new Error(`${error.fieldLabel}: ${error.message}`);
          });
          if (record.message) throw new Error(record.message);
        });
      }
      
      return successfulRecords.length > 0 ? successfulRecords[0].data : null;
    }
    
    return null;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error creating team member:", error.response.data.message);
    } else {
      console.error("Error creating team member:", error);
    }
    throw error;
  }
};

// Update team member
export const update = async (id, memberData) => {
  try {
    const memberId = parseInt(id);
    if (isNaN(memberId)) {
      throw new Error('Invalid team member ID');
    }
    
    const apperClient = getApperClient();
    const preparedData = prepareTeamMemberData(memberData);
    preparedData.Id = memberId;
    
    const params = {
      records: [preparedData]
    };
    
    const response = await apperClient.updateRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to update ${failedRecords.length} team member records: ${JSON.stringify(failedRecords)}`);
        
        failedRecords.forEach(record => {
          record.errors?.forEach(error => {
            throw new Error(`${error.fieldLabel}: ${error.message}`);
          });
          if (record.message) throw new Error(record.message);
        });
      }
      
      return successfulRecords.length > 0 ? successfulRecords[0].data : null;
    }
    
    return null;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error updating team member:", error.response.data.message);
    } else {
      console.error("Error updating team member:", error);
    }
    throw error;
  }
};

// Delete team member by ID
export const deleteById = async (id) => {
  try {
    const memberId = parseInt(id);
    if (isNaN(memberId)) {
      throw new Error('Invalid team member ID');
    }
    
    const apperClient = getApperClient();
    const params = {
      RecordIds: [memberId]
    };
    
    const response = await apperClient.deleteRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to delete ${failedRecords.length} team member records: ${JSON.stringify(failedRecords)}`);
        
        failedRecords.forEach(record => {
          if (record.message) throw new Error(record.message);
        });
      }
      
      return response.results.every(result => result.success);
    }
    
    return true;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error deleting team member:", error.response.data.message);
    } else {
      console.error("Error deleting team member:", error);
    }
    throw error;
  }
};

// Get team members by status
export const getByStatus = async (status) => {
  try {
    const apperClient = getApperClient();
    const params = {
      fields: getAllFields(),
      where: [
        {
          FieldName: "status_c",
          Operator: "EqualTo",
          Values: [status]
        }
      ],
      orderBy: [
        { fieldName: "Name", sorttype: "ASC" }
      ]
    };
    
    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    
    if (!response.success) {
      console.error(response.message);
      return [];
    }
    
    return response.data || [];
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching team members by status:", error.response.data.message);
    } else {
      console.error("Error fetching team members by status:", error);
    }
    return [];
  }
};

// Get team members by department
export const getByDepartment = async (department) => {
  try {
    const apperClient = getApperClient();
    const params = {
      fields: getAllFields(),
      where: [
        {
          FieldName: "department_c",
          Operator: "EqualTo",
          Values: [department]
        }
      ],
      orderBy: [
        { fieldName: "Name", sorttype: "ASC" }
      ]
    };
    
    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    
    if (!response.success) {
      console.error(response.message);
      return [];
    }
    
    return response.data || [];
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching team members by department:", error.response.data.message);
    } else {
      console.error("Error fetching team members by department:", error);
    }
    return [];
  }
};

// Search team members
export const search = async (query) => {
  try {
    const apperClient = getApperClient();
    const searchTerm = query.toLowerCase();
    
    const params = {
      fields: getAllFields(),
      whereGroups: [
        {
          operator: "OR",
          subGroups: [
            {
              conditions: [
                {
                  fieldName: "Name",
                  operator: "Contains",
                  values: [searchTerm]
                }
              ],
              operator: "OR"
            },
            {
              conditions: [
                {
                  fieldName: "email_c",
                  operator: "Contains",
                  values: [searchTerm]
                }
              ],
              operator: "OR"
            },
            {
              conditions: [
                {
                  fieldName: "role_c",
                  operator: "Contains",
                  values: [searchTerm]
                }
              ],
              operator: "OR"
            },
            {
              conditions: [
                {
                  fieldName: "department_c",
                  operator: "Contains",
                  values: [searchTerm]
                }
              ],
              operator: "OR"
            }
          ]
        }
      ],
      orderBy: [
        { fieldName: "Name", sorttype: "ASC" }
      ]
    };
    
    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    
    if (!response.success) {
      console.error(response.message);
      return [];
    }
    
    return response.data || [];
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error searching team members:", error.response.data.message);
    } else {
      console.error("Error searching team members:", error);
    }
    return [];
  }
};

// Get workload statistics
export const getWorkloadStats = async () => {
  try {
    const apperClient = getApperClient();
    
    // Get all team members
    const allMembersParams = {
      fields: [
        { field: { Name: "status_c" } },
        { field: { Name: "current_workload_c" } },
        { field: { Name: "max_capacity_c" } }
      ]
    };
    
    const allMembersResponse = await apperClient.fetchRecords(TABLE_NAME, allMembersParams);
    
    if (!allMembersResponse.success) {
      console.error(allMembersResponse.message);
      return {
        totalMembers: 0,
        activeMembers: 0,
        averageWorkload: 0,
        capacityUtilization: 0,
        overloadedMembers: 0
      };
    }
    
    const allMembers = allMembersResponse.data || [];
    const activeMembers = allMembers.filter(member => member.status_c === 'Active');
    
    const totalCapacity = activeMembers.reduce((sum, member) => sum + (member.max_capacity_c || 0), 0);
    const totalWorkload = activeMembers.reduce((sum, member) => sum + (member.current_workload_c || 0), 0);
    const overloadedMembers = activeMembers.filter(member => 
      (member.current_workload_c || 0) > (member.max_capacity_c || 0)
    );
    
    return {
      totalMembers: allMembers.length,
      activeMembers: activeMembers.length,
      averageWorkload: activeMembers.length > 0 ? Math.round(totalWorkload / activeMembers.length) : 0,
      capacityUtilization: totalCapacity > 0 ? Math.round((totalWorkload / totalCapacity) * 100) : 0,
      overloadedMembers: overloadedMembers.length
    };
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching workload stats:", error.response.data.message);
    } else {
      console.error("Error fetching workload stats:", error);
    }
    return {
      totalMembers: 0,
      activeMembers: 0,
      averageWorkload: 0,
      capacityUtilization: 0,
      overloadedMembers: 0
    };
  }
};

export default {
  getAll,
  getById,
  create,
  update,
  delete: deleteById,
  getByStatus,
  getByDepartment,
  search,
  getWorkloadStats
};