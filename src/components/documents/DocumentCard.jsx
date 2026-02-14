const DocumentCard = ({ document }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-dashboard-accent/20 text-dashboard-accent border-dashboard-accent/30';
      case 'Draft':
        return 'bg-muted text-muted-foreground border-border';
      case 'Expired':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Under Review':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Expiring Soon':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getDocumentTypeIcon = (type) => {
    const iconClasses = "w-6 h-6 sm:w-8 sm:h-8 text-dashboard-accent bg-muted rounded-full p-1.5";
    switch (type) {
      case 'Contract':
      case 'Legal Brief':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        );
      case 'Agreement':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
          </svg>
        );
      case 'Policy':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
          </svg>
        );
      default:
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
          </svg>
        );
    }
  };

  return (
    <div className="bg-card backdrop-blur-xl rounded-2xl p-5 border border-border hover:border-dashboard-accent/30 transition-all duration-300 group shadow-lg hover:shadow-xl">
      <div className="flex items-start">
        <div className="p-2 sm:p-3 bg-muted rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
          {getDocumentTypeIcon(document.type)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-3 gap-2">
            <h3 className="text-lg sm:text-xl font-semibold text-foreground group-hover:text-dashboard-accent transition-colors duration-300 truncate">
              {document.name}
            </h3>
            <span className={`text-xs font-medium px-3 py-1.5 rounded-full flex-shrink-0 border ${getStatusColor(document.status)}`}>
              {document.status}
            </span>
          </div>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed">{document.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {document.tags.map((tag, index) => (
              <span key={index} className="bg-muted text-dashboard-accent text-xs px-3 py-1.5 rounded-full border border-border">
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm text-muted-foreground gap-2">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-dashboard-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span className="truncate">{document.lastUpdated}</span>
            </div>
            
            <div className="flex space-x-3 self-end sm:self-center">
              <button className="text-muted-foreground hover:text-dashboard-accent transition-colors duration-300 transform hover:scale-110 p-1.5" title="Edit">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                </svg>
              </button>
              <button className="text-muted-foreground hover:text-dashboard-accent transition-colors duration-300 transform hover:scale-110 p-1.5" title="Download">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
              </button>
              <button className="text-muted-foreground hover:text-dashboard-accent transition-colors duration-300 transform hover:scale-110 p-1.5" title="More options">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;