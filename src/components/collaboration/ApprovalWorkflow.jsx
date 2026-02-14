import { useState } from 'react';

const ApprovalWorkflow = ({ documentId, workflowSteps = [] }) => {
  const [showAddStep, setShowAddStep] = useState(false);
  const [newStepTitle, setNewStepTitle] = useState('');
  const [newStepApprovers, setNewStepApprovers] = useState('');
  
  const handleAddStep = () => {
    if (newStepTitle.trim() === '' || newStepApprovers.trim() === '') return;
    console.log('Adding workflow step:', { 
      title: newStepTitle, 
      approvers: newStepApprovers.split(',').map(email => email.trim()),
      documentId 
    });
    setNewStepTitle('');
    setNewStepApprovers('');
    setShowAddStep(false);
  };

  const getStepStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-gradient-to-br from-chart-success to-chart-success';
      case 'in_progress': return 'bg-gradient-to-br from-foreground to-foreground';
      case 'rejected': return 'bg-gradient-to-br from-red-500 to-red-600';
      default: return 'bg-gradient-to-br from-muted to-card';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Approved';
      case 'in_progress': return 'In Progress';
      case 'rejected': return 'Rejected';
      default: return 'Pending';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-chart-success/20 text-chart-success';
      case 'in_progress': return 'bg-foreground/20 text-dark-primary';
      case 'rejected': return 'bg-red-500/20 text-red-300';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="bg-gradient-to-b from-card to-background rounded-2xl p-5 sm:p-6 ring-1 ring-border shadow-lg">
      <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-6 flex items-center">
        <svg className="w-5 h-5 mr-2 text-dark-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
        </svg>
        Approval Workflow
      </h3>
      
      <div className="space-y-6">
        {workflowSteps.length > 0 ? (
          <div className="relative">
            {workflowSteps.map((step, index) => (
              <div key={step.id} className="flex mb-8 last:mb-0 group">
                <div className="flex flex-col items-center mr-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-foreground font-bold shadow-lg transition-transform duration-300 group-hover:scale-110 ${getStepStatusColor(step.status)}`}>
                    {index + 1}
                  </div>
                  {index < workflowSteps.length - 1 && (
                    <div className="w-1 bg-gradient-to-b from-foreground to-foreground h-16 mt-2 rounded-full"></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="bg-muted rounded-xl p-5 ring-1 ring-border transition-colors duration-300 hover:ring-foreground/20">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold text-foreground text-lg">{step.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {getStatusText(step.status)}
                        </p>
                      </div>
                      <div className={`px-3 py-1.5 rounded-full text-xs font-medium ${getStatusBadgeColor(step.status)}`}>
                        {step.status.replace('_', ' ').toUpperCase()}
                      </div>
                    </div>
                    
                    {step.approvers && step.approvers.length > 0 && (
                      <div className="mt-4">
                        <p className="text-xs text-muted-foreground mb-2">Approvers:</p>
                        <div className="flex flex-wrap gap-2">
                          {step.approvers.map((approver) => (
                            <div key={approver.id} className="flex items-center bg-muted rounded-full px-3 py-1.5">
                              <div className="w-6 h-6 rounded-full bg-foreground flex items-center justify-center text-background text-xs font-bold mr-2">
                                {approver.initials}
                              </div>
                              <span className="text-xs text-foreground">{approver.name}</span>
                              <span className={`ml-2 w-2 h-2 rounded-full ${
                                approver.status === 'approved' ? 'bg-chart-success' :
                                approver.status === 'pending' ? 'bg-foreground' :
                                approver.status === 'rejected' ? 'bg-red-400' :
                                'bg-muted-foreground'
                              }`}></span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted rounded-xl ring-1 ring-dashed ring-border">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <p className="text-muted-foreground mb-4">No approval workflow has been set up for this document.</p>
          </div>
        )}

        {!showAddStep ? (
          <button 
            className="flex items-center text-dark-primary hover:text-foreground text-sm font-medium transition-colors duration-300 group"
            onClick={() => setShowAddStep(true)}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-foreground to-foreground rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-5 h-5 text-background" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
            </div>
            Add approval step
          </button>
        ) : (
          <div className="bg-muted rounded-xl p-5 ring-1 ring-border">
            <h4 className="font-semibold text-foreground text-lg mb-4">Add New Approval Step</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Step Title</label>
                <input 
                  type="text" 
                  className="w-full p-3 text-sm bg-muted ring-1 ring-border rounded-xl focus:ring-2 focus:ring-foreground focus:border-transparent text-foreground placeholder-muted-foreground transition-colors duration-300"
                  placeholder="e.g., Legal Review"
                  value={newStepTitle}
                  onChange={(e) => setNewStepTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Approvers (comma separated emails)</label>
                <input 
                  type="text" 
                  className="w-full p-3 text-sm bg-muted ring-1 ring-border rounded-xl focus:ring-2 focus:ring-foreground focus:border-transparent text-foreground placeholder-muted-foreground transition-colors duration-300"
                  placeholder="e.g., john@example.com, jane@example.com"
                  value={newStepApprovers}
                  onChange={(e) => setNewStepApprovers(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-3 pt-3">
                <button 
                  className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground bg-muted rounded-lg transition-colors duration-300"
                  onClick={() => {
                    setShowAddStep(false);
                    setNewStepTitle('');
                    setNewStepApprovers('');
                  }}
                >
                  Cancel
                </button>
                <button 
                  className="px-4 py-2 bg-foreground hover:bg-foreground/90 text-background font-medium rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleAddStep}
                  disabled={newStepTitle.trim() === '' || newStepApprovers.trim() === ''}
                >
                  Add Step
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApprovalWorkflow;
