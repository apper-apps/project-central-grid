import { toast } from "react-toastify";
import activityService from "@/services/api/activityService";

class FileService {
  constructor() {
    this.tableName = 'file_attachment_c';
  }

  // Initialize ApperClient
  getApperClient() {
    const { ApperClient } = window.ApperSDK;
    return new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  // Get all files
  async getAll() {
    try {
      const apperClient = this.getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "file_name_c" } },
          { field: { Name: "file_size_c" } },
          { field: { Name: "file_type_c" } },
          { field: { Name: "uploaded_by_c" } },
          { field: { Name: "uploaded_at_c" } },
          { field: { Name: "version_c" } },
          { field: { Name: "is_latest_c" } },
          { field: { Name: "url_c" } },
          { field: { Name: "preview_url_c" } },
          { field: { Name: "task_id_c" } },
          { field: { Name: "project_id_c" } },
          { field: { Name: "comment_id_c" } }
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
        console.error("Error fetching files:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }

  // Get file by ID
  async getById(id) {
    if (!id || typeof id !== 'number') {
      throw new Error('Valid file ID is required');
    }

    try {
      const apperClient = this.getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "file_name_c" } },
          { field: { Name: "file_size_c" } },
          { field: { Name: "file_type_c" } },
          { field: { Name: "uploaded_by_c" } },
          { field: { Name: "uploaded_at_c" } },
          { field: { Name: "version_c" } },
          { field: { Name: "is_latest_c" } },
          { field: { Name: "url_c" } },
          { field: { Name: "preview_url_c" } },
          { field: { Name: "task_id_c" } },
          { field: { Name: "project_id_c" } },
          { field: { Name: "comment_id_c" } }
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response || !response.data) {
        throw new Error('File not found');
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching file with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw new Error('File not found');
    }
  }

  // Get files by task ID
  async getByTaskId(taskId) {
    if (!taskId || typeof taskId !== 'number') {
      throw new Error('Valid task ID is required');
    }

    try {
      const apperClient = this.getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "file_name_c" } },
          { field: { Name: "file_size_c" } },
          { field: { Name: "file_type_c" } },
          { field: { Name: "uploaded_by_c" } },
          { field: { Name: "uploaded_at_c" } },
          { field: { Name: "version_c" } },
          { field: { Name: "is_latest_c" } },
          { field: { Name: "url_c" } },
          { field: { Name: "preview_url_c" } },
          { field: { Name: "task_id_c" } },
          { field: { Name: "project_id_c" } },
          { field: { Name: "comment_id_c" } }
        ],
        where: [
          {
            FieldName: "task_id_c",
            Operator: "EqualTo",
            Values: [parseInt(taskId)]
          }
        ],
        orderBy: [
          { fieldName: "uploaded_at_c", sorttype: "DESC" }
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
        console.error("Error fetching files by task:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }

  // Get files by project ID
  async getByProjectId(projectId) {
    if (!projectId || typeof projectId !== 'number') {
      throw new Error('Valid project ID is required');
    }

    try {
      const apperClient = this.getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "file_name_c" } },
          { field: { Name: "file_size_c" } },
          { field: { Name: "file_type_c" } },
          { field: { Name: "uploaded_by_c" } },
          { field: { Name: "uploaded_at_c" } },
          { field: { Name: "version_c" } },
          { field: { Name: "is_latest_c" } },
          { field: { Name: "url_c" } },
          { field: { Name: "preview_url_c" } },
          { field: { Name: "task_id_c" } },
          { field: { Name: "project_id_c" } },
          { field: { Name: "comment_id_c" } }
        ],
        where: [
          {
            FieldName: "project_id_c",
            Operator: "EqualTo",
            Values: [parseInt(projectId)]
          }
        ],
        orderBy: [
          { fieldName: "uploaded_at_c", sorttype: "DESC" }
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
        console.error("Error fetching files by project:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }

  // Get files by comment ID
  async getByCommentId(commentId) {
    if (!commentId || typeof commentId !== 'number') {
      throw new Error('Valid comment ID is required');
    }

    try {
      const apperClient = this.getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "file_name_c" } },
          { field: { Name: "file_size_c" } },
          { field: { Name: "file_type_c" } },
          { field: { Name: "uploaded_by_c" } },
          { field: { Name: "uploaded_at_c" } },
          { field: { Name: "version_c" } },
          { field: { Name: "is_latest_c" } },
          { field: { Name: "url_c" } },
          { field: { Name: "preview_url_c" } },
          { field: { Name: "task_id_c" } },
          { field: { Name: "project_id_c" } },
          { field: { Name: "comment_id_c" } }
        ],
        where: [
          {
            FieldName: "comment_id_c",
            Operator: "EqualTo",
            Values: [parseInt(commentId)]
          }
        ],
        orderBy: [
          { fieldName: "uploaded_at_c", sorttype: "DESC" }
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
        console.error("Error fetching files by comment:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }

  // Upload a new file
  async upload(fileData) {
    if (!fileData || typeof fileData !== 'object') {
      throw new Error('Valid file data is required');
    }

    const { taskId, projectId, commentId, file, uploadedBy } = fileData;

    if (!uploadedBy || typeof uploadedBy !== 'number') {
      throw new Error('Uploader ID is required');
    }
    if (!file || !file.name) {
      throw new Error('File object is required');
    }
    if (!taskId && !projectId) {
      throw new Error('Either task ID or project ID is required');
    }

    try {
      const apperClient = this.getApperClient();

      // Generate file URLs (in real app, these would be actual storage URLs)
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();
      const baseFileName = fileName.replace(/\.[^/.]+$/, '');
      const version = 1; // Simplified versioning for demo

      // Only include updateable fields
      const params = {
        records: [{
          Name: fileName,
          Tags: "",
          file_name_c: fileName,
          file_size_c: file.size || 0,
          file_type_c: file.type || 'application/octet-stream',
          uploaded_by_c: uploadedBy,
          uploaded_at_c: new Date().toISOString(),
          version_c: version,
          is_latest_c: true,
          url_c: `/uploads/${baseFileName}-v${version}.${fileExtension}`,
          preview_url_c: this.canPreview(file.type) ? `/previews/${baseFileName}-v${version}.jpg` : "",
          task_id_c: taskId || null,
          project_id_c: projectId || null,
          comment_id_c: commentId || null
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
          console.error(`Failed to upload files ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
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
        console.error("Error uploading file:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  // Delete file
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
          console.error(`Failed to delete files ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting file:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return false;
    }
  }

  // Get file versions
  getVersions(fileName, taskId = null, projectId = null) {
    if (!fileName || typeof fileName !== 'string') {
      throw new Error('Valid file name is required');
    }

    // This would normally query the database for file versions
    // For now, return empty array as this is a simplified implementation
    return Promise.resolve([]);
  }

  // Check if file can be previewed
  canPreview(fileType) {
    const previewableTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'text/plain', 'text/html', 'text/markdown'
    ];
    return previewableTypes.includes(fileType);
  }

  // Get file type icon
  getFileIcon(fileType) {
    if (fileType.startsWith('image/')) return 'Image';
    if (fileType === 'application/pdf') return 'FileText';
    if (fileType.includes('document') || fileType.includes('word')) return 'FileText';
    if (fileType.includes('spreadsheet') || fileType.includes('excel')) return 'FileSpreadsheet';
    if (fileType.includes('presentation') || fileType.includes('powerpoint')) return 'Presentation';
    if (fileType.includes('zip') || fileType.includes('rar') || fileType.includes('archive')) return 'Archive';
    if (fileType.includes('video')) return 'Video';
    if (fileType.includes('audio')) return 'Music';
    return 'File';
  }

  // Format file size
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Create instance
const fileService = new FileService();

// Override upload method to track activity
const originalUpload = fileService.upload;
fileService.upload = async function(fileData) {
  const newFile = await originalUpload.call(this, fileData);
  
  if (newFile) {
    try {
      // Track file upload activity
      await activityService.create({
        type: activityService.ACTIVITY_TYPES.FILE_UPLOADED,
        userId: newFile.uploaded_by_c,
        projectId: newFile.project_id_c,
        taskId: newFile.task_id_c,
        fileId: newFile.Id,
        description: `uploaded file "${newFile.file_name_c}"${newFile.task_id_c ? ' to a task' : ''}${newFile.project_id_c ? ' in project' : ''}`
      });
    } catch (error) {
      console.error('Failed to log file upload activity:', error);
    }
  }
  
  return newFile;
};

// Override delete method to track activity
const originalFileDelete = fileService.delete;
fileService.delete = async function(id) {
  let file = null;
  try {
    file = await this.getById(id);
  } catch (error) {
    console.error('Could not fetch file for activity tracking:', error);
  }
  
  const result = await originalFileDelete.call(this, id);
  
  if (result && file) {
    try {
      // Track file deletion activity
      await activityService.create({
        type: activityService.ACTIVITY_TYPES.FILE_DELETED,
        userId: file.uploaded_by_c,
        projectId: file.project_id_c,
        taskId: file.task_id_c,
        fileId: file.Id,
        description: `deleted file "${file.file_name_c}"${file.task_id_c ? ' from a task' : ''}${file.project_id_c ? ' in project' : ''}`
      });
    } catch (error) {
      console.error('Failed to log file deletion activity:', error);
    }
  }
  
  return result;
};

export default fileService;