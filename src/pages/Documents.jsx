import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import { Upload, Search, Filter, FileText, Download, Share2, Clock } from 'lucide-react';
import { db } from '../firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useUserAuth } from '../context/UserAuthContext';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

const Documents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: 'Service Agreement - TechCorp',
      description: 'IT services agreement with TechCorp Inc. covering software development and maintenance.',
      type: 'Contract',
      status: 'Active',
      tags: ['IT', 'Services', 'High Value'],
      lastUpdated: 'Updated 2 days ago',
      version: 'v3.2',
      fileType: 'PDF',
      size: '2.4 MB',
      ocrProcessed: true
    },
    {
      id: 2,
      name: 'Privacy Policy v2.1',
      description: 'Updated privacy policy reflecting latest data protection regulations.',
      type: 'Policy',
      status: 'Under Review',
      tags: ['Compliance', 'GDPR', 'Privacy'],
      lastUpdated: 'Updated 1 week ago',
      version: 'v2.1',
      fileType: 'DOCX',
      size: '1.1 MB',
      ocrProcessed: false
    },
    {
      id: 3,
      name: 'Vendor Contract - SupplyChain Inc',
      description: 'Supply agreement for raw materials with quarterly delivery.',
      type: 'Contract',
      status: 'Active',
      tags: ['Supply Chain', 'Procurement'],
      lastUpdated: 'Updated 2 weeks ago',
      version: 'v1.0',
      fileType: 'PDF',
      size: '3.7 MB',
      ocrProcessed: true
    },
  ]);
  
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const { user } = useUserAuth();
  
  const documentTypes = ['All', 'Contract', 'Agreement', 'Policy', 'Legal Brief', 'NDA'];
  const statusOptions = ['All', 'Active', 'Draft', 'Expired', 'Under Review', 'Expiring Soon'];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || doc.type === filterType;
    const matchesStatus = filterStatus === 'All' || doc.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleFileSelect = (files) => {
    const validFiles = Array.from(files);
    if (validFiles.length > 0) {
      setSelectedFiles(validFiles);
      handleUpload(validFiles);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const handleUpload = async (files) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const progress = ((i + 1) / files.length) * 100;
      setUploadProgress(progress);
      
      const newDoc = {
        id: documents.length + i + 1,
        name: file.name,
        description: 'Processing document...',
        type: 'Document',
        status: 'Under Review',
        tags: ['New'],
        lastUpdated: 'Just now',
        version: 'v1.0',
        fileType: file.name.split('.').pop().toUpperCase(),
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        ocrProcessed: false
      };
      
      setDocuments(prev => [newDoc, ...prev]);
    }
    
    setIsUploading(false);
    setUploadProgress(100);
    setSelectedFiles([]);
    
    setTimeout(() => setUploadProgress(0), 2000);
  };

  const DocumentCard = ({ document }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case 'Active': return 'bg-green-500/20 text-green-400 border-green-500/30';
        case 'Draft': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
        case 'Under Review': return 'bg-blue-500/20 text-blue-400 border-accent/30';
        case 'Expiring Soon': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
        case 'Expired': return 'bg-red-500/20 text-red-400 border-red-500/30';
        default: return 'bg-black/20 text-gray-400 border-gray-500/30';
      }
    };

    return (
      <motion.div
        className="p-6 rounded-3xl bg-card backdrop-blur-xl border border-border hover:border-border/80 transition-all duration-300 group"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-start space-x-3 flex-1">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-foreground text-base mb-1 truncate">{document.name}</h3>
              <p className="text-sm text-muted-foreground font-light line-clamp-2">{document.description}</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(document.status)} flex-shrink-0 ml-3`}>
            {document.status}
          </span>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-muted text-foreground px-2 py-1 rounded-lg text-xs border border-border">
            {document.type}
          </span>
          <span className="bg-muted text-muted-foreground px-2 py-1 rounded-lg text-xs border border-border">
            {document.fileType} • {document.size}
          </span>
          {document.ocrProcessed && (
            <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-lg text-xs border border-green-500/30">
              OCR Processed
            </span>
          )}
        </div>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {document.tags && document.tags.map((tag, index) => (
            <span key={index} className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-md text-xs border border-emerald-500/30">
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t border-border">
          <div className="flex items-center text-muted-foreground text-xs font-light">
            <Clock className="w-4 h-4 mr-1" />
            {document.lastUpdated}
          </div>
          <div className="flex space-x-2">
            <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-emerald-500" title="Download">
              <Download className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-emerald-500" title="Share">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-light tracking-tighter mb-2">Document Management</h1>
          <p className="text-muted-foreground font-light">Upload, organize, and manage all your legal documents</p>
        </motion.div>
        
        {/* Search and Filter */}
        <div className="p-6 rounded-3xl bg-card backdrop-blur-xl border border-border mb-6">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Search className="w-5 h-5 text-muted-foreground" />
              </div>
              <input 
                type="text" 
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-background backdrop-blur-xl border border-border text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-emerald-500/40 focus:border-transparent transition-all duration-300 font-light" 
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <select 
                className="px-4 py-3 rounded-2xl bg-background backdrop-blur-xl border border-border text-foreground focus:ring-2 focus:ring-emerald-500/40 focus:border-transparent transition-all duration-300 font-light"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                {documentTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              
              <select 
                className="px-4 py-3 rounded-2xl bg-background backdrop-blur-xl border border-border text-foreground focus:ring-2 focus:ring-emerald-500/40 focus:border-transparent transition-all duration-300 font-light"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              
              <button 
                className="px-6 py-3 rounded-2xl bg-emerald-600 text-white font-medium hover:scale-105 transition-transform duration-300 flex items-center justify-center gap-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-5 h-5" />
                Upload Document
              </button>

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                accept=".pdf,.doc,.docx,.txt"
                onChange={(e) => handleFileSelect(e.target.files)}
              />
            </div>
          </div>
        </div>

        {/* Drag and Drop Area */}
        <div 
          className={`p-8 rounded-3xl border-2 border-dashed mb-8 transition-all duration-300 ${
            isDragging 
              ? 'border-emerald-500 bg-emerald-500/10 backdrop-blur-xl' 
              : 'border-border bg-card backdrop-blur-xl hover:border-border/80'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">Drag & Drop Files Here</h3>
            <p className="text-muted-foreground mb-4 font-light">Supported formats: PDF, DOC, DOCX, TXT</p>
            <button 
              className="px-6 py-3 rounded-2xl bg-muted hover:bg-muted/80 text-foreground font-medium transition-all duration-300"
              onClick={() => fileInputRef.current?.click()}
            >
              Select Files
            </button>
          </div>
        </div>
        
        {/* Documents Grid */}
        {isUploading && (
          <div className="mb-6 p-4 rounded-2xl bg-card backdrop-blur-xl border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-light text-foreground">Uploading documents...</span>
              <span className="text-sm font-medium text-emerald-500">{Math.round(uploadProgress)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-emerald-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filteredDocuments.length > 0 ? (
            filteredDocuments.map((document) => (
              <DocumentCard key={document.id} document={document} />
            ))
          ) : (
            <div className="xl:col-span-2 p-12 rounded-3xl bg-card backdrop-blur-xl border border-border text-center">
              <div className="w-20 h-20 rounded-2xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10 text-emerald-500" />
              </div>
              <h3 className="text-xl font-medium text-foreground mb-3">No documents found</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6 font-light">
                We couldn't find any documents matching your search. Try adjusting your filters or upload a new document.
              </p>
              <button 
                className="px-6 py-3 rounded-2xl bg-emerald-600 text-white font-medium hover:scale-105 transition-transform duration-300 inline-flex items-center gap-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-5 h-5" />
                Upload Document
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Documents;


