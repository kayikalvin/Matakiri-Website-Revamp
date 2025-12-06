import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Dropzone from 'react-dropzone';
import { motion } from 'framer-motion';
import { FaUpload, FaTrash, FaPlus } from 'react-icons/fa';

const projectSchema = yup.object({
  title: yup.string().required('Title is required').max(200),
  shortDescription: yup.string().max(300),
  description: yup.string().required('Description is required'),
  category: yup.string().required('Category is required'),
  status: yup.string().required('Status is required'),
  location: yup.string().required('Location is required'),
  isFeatured: yup.boolean(),
  isAIPowered: yup.boolean()
});

const ProjectForm = ({ onSubmit, initialData, isLoading }) => {
  const [startDate, setStartDate] = useState(initialData?.startDate ? new Date(initialData.startDate) : new Date());
  const [endDate, setEndDate] = useState(initialData?.endDate ? new Date(initialData.endDate) : null);
  const [images, setImages] = useState(initialData?.images || []);
  const [teamMembers, setTeamMembers] = useState(initialData?.team || []);
  const [aiComponents, setAiComponents] = useState(initialData?.aiComponents || []);

  const { register, handleSubmit, formState: { errors }, control, setValue } = useForm({
    resolver: yupResolver(projectSchema),
    defaultValues: initialData || {
      title: '',
      shortDescription: '',
      description: '',
      category: 'community',
      status: 'planning',
      location: '',
      isFeatured: false,
      isAIPowered: false
    }
  });

  const onDrop = (acceptedFiles) => {
    const newImages = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      caption: ''
    }));
    setImages([...images, ...newImages]);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const addTeamMember = () => {
    setTeamMembers([...teamMembers, { name: '', role: '', avatar: '' }]);
  };

  const removeTeamMember = (index) => {
    const newMembers = [...teamMembers];
    newMembers.splice(index, 1);
    setTeamMembers(newMembers);
  };

  const addAIComponent = () => {
    setAiComponents([...aiComponents, { name: '', description: '', technology: '' }]);
  };

  const removeAIComponent = (index) => {
    const newComponents = [...aiComponents];
    newComponents.splice(index, 1);
    setAiComponents(newComponents);
  };

  const onSubmitForm = (data) => {
    const formData = new FormData();
    
    // Append basic fields
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });

    // Append dates
    formData.append('startDate', startDate.toISOString());
    if (endDate) {
      formData.append('endDate', endDate.toISOString());
    }

    // Append images
    images.forEach((image, index) => {
      if (image.file) {
        formData.append(`images[${index}]`, image.file);
      }
      if (image.caption) {
        formData.append(`imageCaptions[${index}]`, image.caption);
      }
    });

    // Append team members
    teamMembers.forEach((member, index) => {
      if (member.name) {
        formData.append(`team[${index}][name]`, member.name);
        formData.append(`team[${index}][role]`, member.role);
        if (member.avatar) {
          formData.append(`team[${index}][avatar]`, member.avatar);
        }
      }
    });

    // Append AI components
    aiComponents.forEach((component, index) => {
      if (component.name) {
        formData.append(`aiComponents[${index}][name]`, component.name);
        formData.append(`aiComponents[${index}][description]`, component.description);
        formData.append(`aiComponents[${index}][technology]`, component.technology);
      }
    });

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
      {/* Basic Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow p-6"
      >
        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Title *
            </label>
            <input
              {...register('title')}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter project title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              {...register('category')}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="agriculture">Agriculture</option>
              <option value="education">Education</option>
              <option value="health">Health</option>
              <option value="water">Water & Sanitation</option>
              <option value="ai">AI & Innovation</option>
              <option value="community">Community Development</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status *
            </label>
            <select
              {...register('status')}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="paused">Paused</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location *
            </label>
            <input
              {...register('location')}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter project location"
            />
          </div>
        </div>
      </motion.div>

      {/* Dates */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow p-6"
      >
        <h3 className="text-lg font-semibold mb-4">Project Timeline</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date *
            </label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              dateFormat="yyyy-MM-dd"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date (Optional)
            </label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              dateFormat="yyyy-MM-dd"
              isClearable
              placeholderText="Select end date"
            />
          </div>
        </div>
      </motion.div>

      {/* Images Upload */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow p-6"
      >
        <h3 className="text-lg font-semibold mb-4">Project Images</h3>
        <Dropzone onDrop={onDrop} accept={{ 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] }}>
          {({ getRootProps, getInputProps }) => (
            <div
              {...getRootProps()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary-500 transition-colors"
            >
              <input {...getInputProps()} />
              <FaUpload className="mx-auto text-3xl text-gray-400 mb-2" />
              <p className="text-gray-600">Drag & drop images here, or click to select</p>
              <p className="text-sm text-gray-500 mt-1">Supports JPG, PNG, WebP (Max 5MB each)</p>
            </div>
          )}
        </Dropzone>

        {/* Preview Images */}
        {images.length > 0 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image.preview || image.url}
                  alt={`Preview ${index}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FaTrash size={14} />
                </button>
                <input
                  type="text"
                  value={image.caption}
                  onChange={(e) => {
                    const newImages = [...images];
                    newImages[index].caption = e.target.value;
                    setImages(newImages);
                  }}
                  placeholder="Caption"
                  className="mt-2 w-full px-2 py-1 text-sm border rounded"
                />
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Submit Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex justify-end space-x-4"
      >
        <button
          type="button"
          className="px-6 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : initialData ? 'Update Project' : 'Create Project'}
        </button>
      </motion.div>
    </form>
  );
};

export default ProjectForm;