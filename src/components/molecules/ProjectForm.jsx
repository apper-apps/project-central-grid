import React, { useEffect, useState } from "react";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";

const ProjectForm = ({ project, clients, onSubmit, onCancel }) => {
const [formData, setFormData] = useState({
    Name: "",
    client_id_c: "",
    description_c: "",
    status_c: "Planning",
    startDate: "",
    deadline_c: "",
    deliverables_c: ""
  });

  const [errors, setErrors] = useState({});

useEffect(() => {
    if (project) {
      setFormData({
        Name: project.Name || "",
        client_id_c: project.client_id_c || "",
        description_c: project.description_c || "",
        status_c: project.status_c || "Planning",
        startDate: project.startDate || "",
        deadline_c: project.deadline_c || "",
        deliverables_c: project.deliverables_c || ""
      });
    }
  }, [project]);

const validateForm = () => {
    const newErrors = {};
if (!formData.Name.trim()) {
      newErrors.Name = "Project name is required";
    }
    
    if (!formData.client_id_c) {
      newErrors.client_id_c = "Please select a client";
    }
    
if (!formData.description_c.trim()) {
      newErrors.description_c = "Description is required";
    }
    
    if (!formData.deadline_c) {
      newErrors.deadline_c = "Deadline is required";
    }
    
    if (!formData.deliverables_c.trim()) {
      newErrors.deliverables_c = "Deliverables are required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  return (
<form onSubmit={handleSubmit} className="space-y-4">
      <Input
label="Project Name"
        name="Name"
        value={formData.Name}
        onChange={handleChange}
        error={errors.Name}
        placeholder="Enter project name"
        required
      />
      
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Client *
        </label>
        <select
name="client_id_c"
          value={formData.client_id_c}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400"
        >
          <option value="">Select a client</option>
{clients.map(client => (
            <option key={client.Id} value={client.Id}>
              {client.Name} - {client.company_c}
            </option>
          ))}
        </select>
{errors.client_id_c && (
          <p className="text-xs text-red-600 mt-1">{errors.client_id_c}</p>
        )}
      </div>
      
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status *
        </label>
        <select
name="status_c"
          value={formData.status_c}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400"
        >
          <option value="Planning">Planning</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="On Hold">On Hold</option>
        </select>
{errors.status_c && (
          <p className="text-xs text-red-600 mt-1">{errors.status_c}</p>
        )}
      </div>
      
      <Input
label="Deadline"
        name="deadline_c"
        type="date"
        value={formData.deadline_c}
        onChange={handleChange}
        error={errors.deadline_c}
        required
/>
      
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description *
        </label>
        <textarea
          name="description_c"
          value={formData.description_c}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 resize-none"
          placeholder="Describe the project details..."
        />
        {errors.description_c && (
          <p className="text-xs text-red-600 mt-1">{errors.description_c}</p>
        )}
      </div>
      
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Deliverables *
        </label>
        <textarea
          name="deliverables_c"
          value={formData.deliverables_c}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 resize-none"
          placeholder="List project deliverables and outcomes..."
        />
        {errors.deliverables_c && (
          <p className="text-xs text-red-600 mt-1">{errors.deliverables_c}</p>
        )}
      </div>
      
      <div className="flex space-x-3 pt-4">
        <Button type="submit" variant="primary" className="flex-1">
          {project ? "Update Project" : "Create Project"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default ProjectForm;