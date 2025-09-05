import { toast } from "react-toastify";

// Initialize ApperClient
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Get all issues
const getAll = async () => {
  try {
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "Tags" } },
        { field: { Name: "Owner" } },
        { field: { Name: "CreatedOn" } },
        { field: { Name: "CreatedBy" } },
        { field: { Name: "ModifiedOn" } },
        { field: { Name: "ModifiedBy" } },
        { field: { Name: "title_c" } },
        { field: { Name: "type_c" } },
        { field: { Name: "description_c" } },
        { field: { Name: "priority_c" } },
        { field: { Name: "status_c" } },
        { field: { Name: "reporter_c" } },
        { field: { Name: "assignee_c" } },
        { field: { Name: "environment_c" } },
        { field: { Name: "due_date_c" } },
        { field: { Name: "created_at_c" } },
        { field: { Name: "updated_at_c" } },
        { field: { Name: "project_id_c" } }
      ],
      orderBy: [
        {
          fieldName: "CreatedOn",
          sorttype: "DESC"
        }
      ]
    };
    
    const response = await apperClient.fetchRecords('issue_c', params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return [];
    }
    
    return response.data || [];
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching issues:", error?.response?.data?.message);
      toast.error(error.response.data.message);
    } else {
      console.error("Error fetching issues:", error);
      toast.error("Failed to fetch issues");
    }
    return [];
  }
};

// Get issue by ID
const getById = async (id) => {
  try {
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "Tags" } },
        { field: { Name: "Owner" } },
        { field: { Name: "CreatedOn" } },
        { field: { Name: "CreatedBy" } },
        { field: { Name: "ModifiedOn" } },
        { field: { Name: "ModifiedBy" } },
        { field: { Name: "title_c" } },
        { field: { Name: "type_c" } },
        { field: { Name: "description_c" } },
        { field: { Name: "priority_c" } },
        { field: { Name: "status_c" } },
        { field: { Name: "reporter_c" } },
        { field: { Name: "assignee_c" } },
        { field: { Name: "environment_c" } },
        { field: { Name: "due_date_c" } },
        { field: { Name: "created_at_c" } },
        { field: { Name: "updated_at_c" } },
        { field: { Name: "project_id_c" } }
      ]
    };
    
    const response = await apperClient.getRecordById('issue_c', id, params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return null;
    }
    
    return response.data;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error(`Error fetching issue with ID ${id}:`, error?.response?.data?.message);
      toast.error(error.response.data.message);
    } else {
      console.error(`Error fetching issue with ID ${id}:`, error);
      toast.error("Failed to fetch issue");
    }
    return null;
  }
};

// Create new issues
const create = async (issueData) => {
  try {
    // Filter to only updateable fields
    const updateableData = {
      Name: issueData.Name,
      Tags: issueData.Tags,
      title_c: issueData.title_c,
      type_c: issueData.type_c,
      description_c: issueData.description_c,
      priority_c: issueData.priority_c,
      status_c: issueData.status_c,
      reporter_c: issueData.reporter_c,
      assignee_c: issueData.assignee_c,
      environment_c: issueData.environment_c,
      due_date_c: issueData.due_date_c,
      created_at_c: issueData.created_at_c,
      updated_at_c: issueData.updated_at_c,
      project_id_c: issueData.project_id_c ? parseInt(issueData.project_id_c) : undefined
    };

    // Remove undefined fields
    Object.keys(updateableData).forEach(key => {
      if (updateableData[key] === undefined) {
        delete updateableData[key];
      }
    });
    
    const params = {
      records: [updateableData]
    };
    
    const response = await apperClient.createRecord('issue_c', params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return null;
    }
    
    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create ${failedRecords.length} issues:${JSON.stringify(failedRecords)}`);
        failedRecords.forEach(record => {
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successfulRecords.length > 0) {
        toast.success("Issue created successfully");
        return successfulRecords[0].data;
      }
    }
    
    return null;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error creating issue:", error?.response?.data?.message);
      toast.error(error.response.data.message);
    } else {
      console.error("Error creating issue:", error);
      toast.error("Failed to create issue");
    }
    return null;
  }
};

// Update issues
const update = async (id, issueData) => {
  try {
    // Filter to only updateable fields and include ID
    const updateableData = {
      Id: id,
      Name: issueData.Name,
      Tags: issueData.Tags,
      title_c: issueData.title_c,
      type_c: issueData.type_c,
      description_c: issueData.description_c,
      priority_c: issueData.priority_c,
      status_c: issueData.status_c,
      reporter_c: issueData.reporter_c,
      assignee_c: issueData.assignee_c,
      environment_c: issueData.environment_c,
      due_date_c: issueData.due_date_c,
      created_at_c: issueData.created_at_c,
      updated_at_c: issueData.updated_at_c,
      project_id_c: issueData.project_id_c ? parseInt(issueData.project_id_c) : undefined
    };

    // Remove undefined fields (keep null for clearing fields)
    Object.keys(updateableData).forEach(key => {
      if (updateableData[key] === undefined) {
        delete updateableData[key];
      }
    });
    
    const params = {
      records: [updateableData]
    };
    
    const response = await apperClient.updateRecord('issue_c', params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return null;
    }
    
    if (response.results) {
      const successfulUpdates = response.results.filter(result => result.success);
      const failedUpdates = response.results.filter(result => !result.success);
      
      if (failedUpdates.length > 0) {
        console.error(`Failed to update ${failedUpdates.length} issues:${JSON.stringify(failedUpdates)}`);
        failedUpdates.forEach(record => {
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successfulUpdates.length > 0) {
        toast.success("Issue updated successfully");
        return successfulUpdates[0].data;
      }
    }
    
    return null;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error updating issue:", error?.response?.data?.message);
      toast.error(error.response.data.message);
    } else {
      console.error("Error updating issue:", error);
      toast.error("Failed to update issue");
    }
    return null;
  }
};

// Delete issues
const remove = async (ids) => {
  try {
    const recordIds = Array.isArray(ids) ? ids : [ids];
    
    const params = {
      RecordIds: recordIds
    };
    
    const response = await apperClient.deleteRecord('issue_c', params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return false;
    }
    
    if (response.results) {
      const successfulDeletions = response.results.filter(result => result.success);
      const failedDeletions = response.results.filter(result => !result.success);
      
      if (failedDeletions.length > 0) {
        console.error(`Failed to delete ${failedDeletions.length} issues:${JSON.stringify(failedDeletions)}`);
        failedDeletions.forEach(record => {
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successfulDeletions.length > 0) {
        toast.success(`${successfulDeletions.length} issue(s) deleted successfully`);
        return successfulDeletions.length === recordIds.length;
      }
    }
    
    return false;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error deleting issues:", error?.response?.data?.message);
      toast.error(error.response.data.message);
    } else {
      console.error("Error deleting issues:", error);
      toast.error("Failed to delete issues");
    }
    return false;
  }
};

// Search issues
const searchIssues = async (searchTerm, filters = {}) => {
  try {
    const whereConditions = [];
    
    // Add search term conditions
    if (searchTerm && searchTerm.trim()) {
      whereConditions.push({
        FieldName: "title_c",
        Operator: "Contains",
        Values: [searchTerm.trim()]
      });
    }
    
    // Add filter conditions
    if (filters.status_c) {
      whereConditions.push({
        FieldName: "status_c",
        Operator: "EqualTo",
        Values: [filters.status_c]
      });
    }
    
    if (filters.priority_c) {
      whereConditions.push({
        FieldName: "priority_c",
        Operator: "EqualTo",
        Values: [filters.priority_c]
      });
    }
    
    if (filters.type_c) {
      whereConditions.push({
        FieldName: "type_c",
        Operator: "EqualTo",
        Values: [filters.type_c]
      });
    }
    
    if (filters.project_id_c) {
      whereConditions.push({
        FieldName: "project_id_c",
        Operator: "EqualTo",
        Values: [parseInt(filters.project_id_c)]
      });
    }
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "Tags" } },
        { field: { Name: "title_c" } },
        { field: { Name: "type_c" } },
        { field: { Name: "description_c" } },
        { field: { Name: "priority_c" } },
        { field: { Name: "status_c" } },
        { field: { Name: "reporter_c" } },
        { field: { Name: "assignee_c" } },
        { field: { Name: "environment_c" } },
        { field: { Name: "due_date_c" } },
        { field: { Name: "created_at_c" } },
        { field: { Name: "updated_at_c" } },
        { field: { Name: "project_id_c" } }
      ],
      where: whereConditions,
      orderBy: [
        {
          fieldName: "CreatedOn",
          sorttype: "DESC"
        }
      ]
    };
    
    const response = await apperClient.fetchRecords('issue_c', params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return [];
    }
    
    return response.data || [];
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error searching issues:", error?.response?.data?.message);
      toast.error(error.response.data.message);
    } else {
      console.error("Error searching issues:", error);
      toast.error("Failed to search issues");
    }
    return [];
  }
};

// Get comments for an issue
const getCommentsByIssueId = async (issueId) => {
  try {
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "Tags" } },
        { field: { Name: "author_id_c" } },
        { field: { Name: "content_c" } },
        { field: { Name: "created_at_c" } },
        { field: { Name: "updated_at_c" } },
        { field: { Name: "mentions_c" } },
        { field: { Name: "is_edited_c" } },
        { field: { Name: "parent_id_c" } }
      ],
      where: [
        {
          FieldName: "task_id_c",
          Operator: "EqualTo",
          Values: [parseInt(issueId)]
        }
      ],
      orderBy: [
        {
          fieldName: "created_at_c",
          sorttype: "ASC"
        }
      ]
    };
    
    const response = await apperClient.fetchRecords('comment_c', params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return [];
    }
    
    return response.data || [];
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching issue comments:", error?.response?.data?.message);
      toast.error(error.response.data.message);
    } else {
      console.error("Error fetching issue comments:", error);
      toast.error("Failed to fetch comments");
    }
    return [];
  }
};

// Create comment for issue
const createComment = async (commentData) => {
  try {
    const updateableData = {
      Name: commentData.Name,
      Tags: commentData.Tags,
      author_id_c: commentData.author_id_c,
      content_c: commentData.content_c,
      created_at_c: commentData.created_at_c,
      updated_at_c: commentData.updated_at_c,
      mentions_c: commentData.mentions_c,
      is_edited_c: commentData.is_edited_c || false,
      task_id_c: commentData.task_id_c ? parseInt(commentData.task_id_c) : undefined,
      parent_id_c: commentData.parent_id_c ? parseInt(commentData.parent_id_c) : undefined
    };

    Object.keys(updateableData).forEach(key => {
      if (updateableData[key] === undefined) {
        delete updateableData[key];
      }
    });
    
    const params = {
      records: [updateableData]
    };
    
    const response = await apperClient.createRecord('comment_c', params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return null;
    }
    
    if (response.results && response.results[0] && response.results[0].success) {
      toast.success("Comment added successfully");
      return response.results[0].data;
    }
    
    return null;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error creating comment:", error?.response?.data?.message);
      toast.error(error.response.data.message);
    } else {
      console.error("Error creating comment:", error);
      toast.error("Failed to create comment");
    }
    return null;
  }
};

// Update comment
const updateComment = async (commentId, commentData) => {
  try {
    const updateableData = {
      Id: commentId,
      Name: commentData.Name,
      Tags: commentData.Tags,
      author_id_c: commentData.author_id_c,
      content_c: commentData.content_c,
      updated_at_c: new Date().toISOString(),
      mentions_c: commentData.mentions_c,
      is_edited_c: true
    };

    Object.keys(updateableData).forEach(key => {
      if (updateableData[key] === undefined) {
        delete updateableData[key];
      }
    });
    
    const params = {
      records: [updateableData]
    };
    
    const response = await apperClient.updateRecord('comment_c', params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return null;
    }
    
    if (response.results && response.results[0] && response.results[0].success) {
      toast.success("Comment updated successfully");
      return response.results[0].data;
    }
    
    return null;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error updating comment:", error?.response?.data?.message);
      toast.error(error.response.data.message);
    } else {
      console.error("Error updating comment:", error);
      toast.error("Failed to update comment");
    }
    return null;
  }
};

// Delete comment
const deleteComment = async (commentId) => {
  try {
    const params = {
      RecordIds: [commentId]
    };
    
    const response = await apperClient.deleteRecord('comment_c', params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return false;
    }
    
    if (response.results && response.results[0] && response.results[0].success) {
      toast.success("Comment deleted successfully");
      return true;
    }
    
    return false;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error deleting comment:", error?.response?.data?.message);
      toast.error(error.response.data.message);
    } else {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
    }
    return false;
  }
};

// Extract mentions from content (utility function)
function extractMentions(content) {
  const mentionRegex = /@(\w+)/g;
  const mentions = [];
  let match;
  
  while ((match = mentionRegex.exec(content)) !== null) {
    mentions.push(match[1]);
  }
  
  return mentions;
}

export default {
  getAll,
  getById,
  create,
  update,
  remove,
  searchIssues,
  getCommentsByIssueId,
  createComment,
  updateComment,
  deleteComment
};

// Issue types configuration
export const issueTypes = [
  {
    id: 'Bug',
    name: 'Bug',
    icon: 'Bug',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200'
  },
  {
    id: 'Task',
    name: 'Task',
    icon: 'CheckSquare',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  {
    id: 'Feature Request',
    name: 'Feature Request',
    icon: 'Lightbulb',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  {
    id: 'Improvement',
    name: 'Improvement',
    icon: 'TrendingUp',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200'
  }
];

// Priority levels
export const priorityLevels = ['Highest', 'High', 'Medium', 'Low', 'Lowest'];

// Status workflow
export const statusWorkflow = ['To Do', 'In Progress', 'In Review', 'Done'];

// Environment options
export const environments = ['Production', 'Staging', 'Development'];

export default {
  getAll,
  getById,
  create,
  update,
  remove,
  searchIssues,
  getCommentsByIssueId,
  createComment,
  updateComment,
  deleteComment
};

export {
  create,
  createComment,
  deleteComment,
  getAll,
  getById,
  getCommentsByIssueId,
  remove,
  searchIssues,
  update,
  updateComment
};