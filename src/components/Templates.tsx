import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, Copy, Edit, Star, Users, Clock, BarChart3, Eye, Heart, Briefcase, Smartphone, ShoppingCart, Gamepad2, FileText, X } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  studyType: 'online-survey' | '1-on-1-consultation' | 'product-testing';
  estimatedTime: number;
  questions: number;
  rating: number;
  uses: number;
  featured: boolean;
  tags: string[];
  preview: string[];
}

const mockTemplates: Template[] = [
  {
    id: 't1',
    name: 'Customer Satisfaction Survey',
    description: 'Comprehensive survey to measure customer satisfaction across multiple touchpoints',
    category: 'Customer Experience',
    studyType: 'online-survey',
    estimatedTime: 10,
    questions: 25,
    rating: 4.8,
    uses: 1247,
    featured: true,
    tags: ['satisfaction', 'customer experience', 'feedback'],
    preview: [
      'How satisfied are you with our product/service?',
      'How likely are you to recommend us to others?',
      'What aspects of our service could be improved?'
    ]
  },
  {
    id: 't2',
    name: 'Product Feature Validation',
    description: 'Validate new product features before development with targeted user feedback',
    category: 'Product Development',
    studyType: 'product-testing',
    estimatedTime: 30,
    questions: 15,
    rating: 4.7,
    uses: 892,
    featured: true,
    tags: ['features', 'validation', 'product'],
    preview: [
      'How useful would this feature be for your workflow?',
      'Would you pay extra for this feature?',
      'What improvements would you suggest?'
    ]
  },
  {
    id: 't3',
    name: 'User Experience Interview',
    description: 'In-depth interview template for understanding user needs and pain points',
    category: 'User Research',
    studyType: '1-on-1-consultation',
    estimatedTime: 45,
    questions: 20,
    rating: 4.9,
    uses: 534,
    featured: false,
    tags: ['ux', 'interview', 'qualitative'],
    preview: [
      'Can you walk me through your typical workflow?',
      'What are the biggest challenges you face?',
      'How do you currently solve this problem?'
    ]
  }
];

export const Templates: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUseModal, setShowUseModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    category: 'Customer Experience',
    studyType: 'online-survey' as 'online-survey' | '1-on-1-consultation' | 'product-testing',
    estimatedTime: 10,
    tags: ''
  });

  const categories = ['All Categories', 'Customer Experience', 'Product Development', 'User Research', 'Market Research', 'Brand Study'];

  const filteredTemplates = mockTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateTemplate = () => {
    // Simulate creating template
    console.log('Creating template:', newTemplate);
    alert('Template created successfully!');
    setShowCreateModal(false);
    setNewTemplate({
      name: '',
      description: '',
      category: 'Customer Experience',
      studyType: 'online-survey',
      estimatedTime: 10,
      tags: ''
    });
  };

  const handleUseTemplate = (template: Template) => {
    // Navigate to study creation with pre-filled template
    navigate('/create-study', { 
      state: { 
        template: template,
        preselectedType: template.studyType,
        prompt: template.description
      } 
    });
  };

  const handlePreviewTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setShowUseModal(true);
  };

  return (
    <div className="space-y-8 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Study Templates</h1>
          <p className="text-gray-600 mt-1">Start with proven templates or create your own</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn-primary"
        >
          <Plus size={16} className="mr-2" />
          Create Template
        </button>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-input text-sm max-w-xs"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Featured Templates */}
      {selectedCategory === 'All Categories' && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Featured Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {mockTemplates.filter(t => t.featured).map((template) => (
              <div key={template.id} className="card-hover">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
                    <p className="text-sm text-gray-600">{template.category}</p>
                  </div>
                  <Star className="text-yellow-400 fill-current" size={16} />
                </div>

                <p className="text-gray-600 text-sm mb-4">{template.description}</p>

                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock size={14} />
                    <span>{template.estimatedTime}m</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BarChart3 size={14} />
                    <span>{template.questions} questions</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star size={14} />
                    <span>{template.rating}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button 
                    onClick={() => handlePreviewTemplate(template)}
                    className="btn-secondary flex-1 text-sm"
                  >
                    <Eye size={14} className="mr-1" />
                    Preview
                  </button>
                  <button 
                    onClick={() => handleUseTemplate(template)}
                    className="btn-primary flex-1 text-sm"
                  >
                    Use Template
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Templates */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {selectedCategory === 'All Categories' ? 'All Templates' : selectedCategory}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div key={template.id} className="card-hover">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
                  <p className="text-sm text-gray-600">{template.category}</p>
                </div>
                {template.featured && (
                  <Star className="text-yellow-400 fill-current" size={16} />
                )}
              </div>

              <p className="text-gray-600 text-sm mb-4">{template.description}</p>

              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-1">
                  <Clock size={14} />
                  <span>{template.estimatedTime}m</span>
                </div>
                <div className="flex items-center space-x-1">
                  <BarChart3 size={14} />
                  <span>{template.questions} questions</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star size={14} />
                  <span>{template.rating}</span>
                </div>
              </div>

              <div className="flex items-center space-x-1 mb-4">
                <Users size={14} className="text-gray-400" />
                <span className="text-sm text-gray-500">{template.uses} uses</span>
              </div>

              <div className="flex space-x-2">
                <button 
                  onClick={() => handlePreviewTemplate(template)}
                  className="btn-secondary flex-1 text-sm"
                >
                  <Eye size={14} className="mr-1" />
                  Preview
                </button>
                <button 
                  onClick={() => handleUseTemplate(template)}
                  className="btn-primary flex-1 text-sm"
                >
                  Use Template
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-16">
          <FileText className="text-gray-400 mx-auto mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No templates found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search to find templates.</p>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            Create New Template
          </button>
        </div>
      )}

      {/* Create Template Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Create New Template</h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Template Name</label>
                <input
                  type="text"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                  placeholder="Enter template name..."
                  className="form-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate({...newTemplate, description: e.target.value})}
                  placeholder="Describe what this template is for..."
                  rows={3}
                  className="form-textarea"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select 
                    value={newTemplate.category}
                    onChange={(e) => setNewTemplate({...newTemplate, category: e.target.value})}
                    className="form-input"
                  >
                    {categories.filter(c => c !== 'All Categories').map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Study Type</label>
                  <select 
                    value={newTemplate.studyType}
                    onChange={(e) => setNewTemplate({...newTemplate, studyType: e.target.value as any})}
                    className="form-input"
                  >
                    <option value="online-survey">Online Survey</option>
                    <option value="1-on-1-consultation">1-on-1 Consultation</option>
                    <option value="product-testing">Product Testing</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Time (minutes)</label>
                  <input
                    type="number"
                    value={newTemplate.estimatedTime}
                    onChange={(e) => setNewTemplate({...newTemplate, estimatedTime: parseInt(e.target.value)})}
                    className="form-input"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={newTemplate.tags}
                    onChange={(e) => setNewTemplate({...newTemplate, tags: e.target.value})}
                    placeholder="research, feedback, customer"
                    className="form-input"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreateTemplate}
                  className="btn-primary flex-1"
                  disabled={!newTemplate.name || !newTemplate.description}
                >
                  Create Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Template Preview Modal */}
      {showUseModal && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Template Preview</h3>
              <button 
                onClick={() => setShowUseModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">{selectedTemplate.name}</h4>
                <p className="text-gray-600">{selectedTemplate.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="text-gray-400" size={16} />
                  <span>{selectedTemplate.estimatedTime} minutes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="text-gray-400" size={16} />
                  <span>{selectedTemplate.questions} questions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="text-gray-400" size={16} />
                  <span>{selectedTemplate.rating} rating</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="text-gray-400" size={16} />
                  <span>{selectedTemplate.uses} uses</span>
                </div>
              </div>

              <div>
                <h5 className="font-medium text-gray-900 mb-3">Sample Questions:</h5>
                <div className="space-y-2">
                  {selectedTemplate.preview.map((question, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-700">{index + 1}. {question}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Tags:</span>
                {selectedTemplate.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button 
                  onClick={() => setShowUseModal(false)}
                  className="btn-secondary flex-1"
                >
                  Close Preview
                </button>
                <button 
                  onClick={() => handleUseTemplate(selectedTemplate)}
                  className="btn-primary flex-1"
                >
                  Use This Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 