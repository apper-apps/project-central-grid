// Initialize ApperClient for database operations
const { ApperClient } = window.ApperSDK;

class ChatService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'chat_message_c';
    
    // Mock data for channels (since no channel table exists in schema)
    this.channels = [
      { Id: 1, name: 'Team Chat', type: 'team', projectId: null, createdAt: new Date().toISOString(), memberCount: 5 },
      { Id: 2, name: 'E-commerce Platform', type: 'project', projectId: 1, createdAt: new Date().toISOString(), memberCount: 3 },
      { Id: 3, name: 'Mobile App Dev', type: 'project', projectId: 2, createdAt: new Date().toISOString(), memberCount: 2 },
      { Id: 4, name: 'Marketing Website', type: 'project', projectId: 3, createdAt: new Date().toISOString(), memberCount: 2 }
    ];
    this.nextChannelId = 5;
    
    // Mock reactions (no reaction table in schema)
    this.reactions = [];
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "content_c" } },
          { field: { Name: "author_id_c" } },
          { field: { Name: "project_id_c" } },
          { field: { Name: "channel_type_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } }
        ],
        orderBy: [
          { fieldName: "created_at_c", sorttype: "ASC" }
        ],
        pagingInfo: { limit: 100, offset: 0 }
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching chat messages:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "content_c" } },
          { field: { Name: "author_id_c" } },
          { field: { Name: "project_id_c" } },
          { field: { Name: "channel_type_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching chat message with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async getChannelsByType(channelType = 'team') {
    // Mock implementation since no channel table exists
    return this.channels.filter(channel => channel.type === channelType);
  }

  async createChannel(channelData) {
    // Mock implementation since no channel table exists
    const newChannel = {
      Id: this.nextChannelId++,
      name: channelData.name,
      type: channelData.type || 'team',
      projectId: channelData.projectId || null,
      description: channelData.description || '',
      createdAt: new Date().toISOString(),
      memberCount: 1
    };
    this.channels.push(newChannel);
    return newChannel;
  }

  async getMessagesByChannel(projectId = null, channelType = 'team') {
    try {
      const whereConditions = [];

      // Filter by channel type
      whereConditions.push({
        FieldName: "channel_type_c",
        Operator: "EqualTo",
        Values: [channelType]
      });

      // Filter by project if specified
      if (channelType === 'project' && projectId) {
        whereConditions.push({
          FieldName: "project_id_c",
          Operator: "EqualTo",
          Values: [parseInt(projectId)]
        });
      } else if (channelType === 'team') {
        // For team channels, project_id_c should be null or empty
        whereConditions.push({
          FieldName: "project_id_c",
          Operator: "DoesNotHaveValue",
          Values: []
        });
      }

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "content_c" } },
          { field: { Name: "author_id_c" } },
          { field: { Name: "project_id_c" } },
          { field: { Name: "channel_type_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } }
        ],
        where: whereConditions,
        orderBy: [
          { fieldName: "created_at_c", sorttype: "ASC" }
        ],
        pagingInfo: { limit: 100, offset: 0 }
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      const messages = response.data || [];

      // Add mock reactions and thread info (since no dedicated tables exist)
      return messages.map(message => ({
        ...message,
        // Map database fields to expected frontend fields
        Id: message.Id,
        content: message.content_c,
        authorId: message.author_id_c,
        projectId: message.project_id_c,
        channelType: message.channel_type_c,
        createdAt: message.created_at_c || message.CreatedOn,
        updatedAt: message.updated_at_c || message.ModifiedOn,
        reactions: this.getMessageReactions(message.Id),
        threadCount: 0, // Mock since no parent/child relationship implemented yet
        hasThread: false
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching messages by channel:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async create(messageData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Name: `Message from ${messageData.author_id_c || messageData.authorId}`,
          content_c: messageData.content,
          author_id_c: parseInt(messageData.authorId || messageData.author_id_c),
          project_id_c: messageData.projectId ? parseInt(messageData.projectId) : null,
          channel_type_c: messageData.channelType || 'team',
          created_at_c: new Date().toISOString(),
          updated_at_c: new Date().toISOString()
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create chat message ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              console.error(`${error.fieldLabel}: ${error}`);
            });
          });
        }

        if (successfulRecords.length > 0) {
          const createdMessage = successfulRecords[0].data;
          // Map back to frontend format
          return {
            ...createdMessage,
            content: createdMessage.content_c,
            authorId: createdMessage.author_id_c,
            projectId: createdMessage.project_id_c,
            channelType: createdMessage.channel_type_c,
            createdAt: createdMessage.created_at_c,
            updatedAt: createdMessage.updated_at_c
          };
        }
      }

      throw new Error('No successful records created');
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating chat message:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async update(id, messageData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          content_c: messageData.content,
          updated_at_c: new Date().toISOString()
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update chat message ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        }

        if (successfulUpdates.length > 0) {
          const updatedMessage = successfulUpdates[0].data;
          return {
            ...updatedMessage,
            content: updatedMessage.content_c,
            authorId: updatedMessage.author_id_c,
            projectId: updatedMessage.project_id_c,
            channelType: updatedMessage.channel_type_c,
            createdAt: updatedMessage.created_at_c,
            updatedAt: updatedMessage.updated_at_c
          };
        }
      }

      throw new Error('No successful updates');
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating chat message:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete chat message ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error('Failed to delete message');
        }

        return { success: true };
      }

      return { success: true };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting chat message:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  // Thread functionality (mock implementation since no parent_id field in current schema)
  async getThreadReplies(parentId) {
    // Mock implementation - would need parent_id_c field in schema
    return [];
  }

  getThreadCount(messageId) {
    return 0; // Mock since no thread support yet
  }

  hasThread(messageId) {
    return false; // Mock since no thread support yet
  }

  async addMemberToChannel(channelId, memberId) {
    // Mock implementation since no channel table exists
    const channel = this.channels.find(c => c.Id === parseInt(channelId));
    if (channel) {
      channel.memberCount = (channel.memberCount || 0) + 1;
      return true;
    }
    return false;
  }

  async addReaction(messageId, emoji, userId) {
    // Mock implementation since no reaction table exists
    const reaction = {
      Id: Date.now(),
      messageId: parseInt(messageId),
      emoji,
      userId: parseInt(userId),
      createdAt: new Date().toISOString()
    };
    this.reactions.push(reaction);
    return reaction;
  }

  async removeReaction(messageId, emoji, userId) {
    // Mock implementation
    const index = this.reactions.findIndex(r => 
      r.messageId === parseInt(messageId) && 
      r.emoji === emoji && 
      r.userId === parseInt(userId)
    );
    if (index !== -1) {
      this.reactions.splice(index, 1);
    }
    return { success: true };
  }

  getMessageReactions(messageId) {
    // Mock implementation
    const messageReactions = this.reactions.filter(r => r.messageId === parseInt(messageId));
    const grouped = {};
    
    messageReactions.forEach(reaction => {
      if (!grouped[reaction.emoji]) {
        grouped[reaction.emoji] = {
          emoji: reaction.emoji,
          count: 0,
          users: []
        };
      }
      grouped[reaction.emoji].count++;
      grouped[reaction.emoji].users.push(reaction.userId);
    });
    
    return Object.values(grouped);
  }

  // Search functionality
  async searchMessages(query, channelType = 'team', projectId = null) {
    try {
      const messages = await this.getMessagesByChannel(projectId, channelType);
      return messages.filter(message => 
        message.content.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching messages:', error);
      return [];
    }
  }

  // File attachment handling (mock since no file attachment integration)
  async uploadFile(file, messageId) {
    const attachment = {
      Id: Date.now(),
      messageId: parseInt(messageId),
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      url: URL.createObjectURL(file), // Mock URL
      uploadedAt: new Date().toISOString()
    };
    return attachment;
  }
}

export default new ChatService();