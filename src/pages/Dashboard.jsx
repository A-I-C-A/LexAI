import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Calendar, BarChart3, MessageSquare, Play, MessageCircle, Mic, Search, FileText } from 'lucide-react';
import { useUserAuth } from '../context/UserAuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useUserAuth();

  const agents = [
    {
      title: 'Compliance Guardian',
      description: 'Monitor regulatory changes and ensure document compliance across jurisdictions.',
      icon: <Shield className="w-6 h-6" />,
      actionText: 'View',
      metrics: [
        { label: 'Compliance Score', value: '94%' },
        { label: 'Monitored Regulations', value: '1,243' },
      ],
      onAction: () => navigate('/compliance')
    },
    {
      title: 'Obligation & Deadline Tracker',
      description: 'Track contract deadlines, payment schedules, and renewal dates automatically.',
      icon: <Calendar className="w-6 h-6" />,
      actionText: 'View',
      metrics: [
        { label: 'Upcoming Deadlines', value: '12' },
        { label: 'Tracked Obligations', value: '87' },
      ],
      onAction: () => navigate('/obligations')
    },
    {
      title: 'Risk & Fairness Analyzer',
      description: 'Identify and assess contractual risks with interactive heatmaps and scoring.',
      icon: <BarChart3 className="w-6 h-6" />,
      actionText: 'View',
      metrics: [
        { label: 'Risk Score', value: '32 (Low)' },
        { label: 'Fairness Rating', value: '8.5/10' },
      ],
      onAction: () => navigate('/risk')
    },
    {
      title: 'Negotiation Strategist',
      description: 'Generate counter-proposals and negotiation strategies based on contract analysis.',
      icon: <MessageSquare className="w-6 h-6" />,
      actionText: 'View',
      metrics: [
        { label: 'Success Rate', value: '78%' },
        { label: 'Avg. Improvement', value: '23%' },
      ],
      onAction: () => navigate('/negotiation')
    },
    {
      title: 'Scenario Simulation',
      description: 'Model different contract scenarios and visualize potential outcomes.',
      icon: <Play className="w-6 h-6" />,
      actionText: 'View',
      metrics: [
        { label: 'Scenarios Created', value: '24' },
        { label: 'Simulations Run', value: '156' },
      ],
      onAction: () => navigate('/scenarios')
    },
    {
      title: 'AI Chatbot',
      description: 'Chat with LegalAxis AI for instant legal insights and support.',
      icon: <MessageCircle className="w-6 h-6" />,
      actionText: 'Chat',
      metrics: [
        { label: 'AI Model', value: 'Gemini 1.5' },
        { label: 'Realtime', value: 'Yes' },
      ],
      onAction: () => navigate('/chatbot')
    },
    {
      title: 'Voice Assistant',
      description: 'Use your voice to interact with LegalAxis AI for hands-free help.',
      icon: <Mic className="w-6 h-6" />,
      actionText: 'Speak',
      metrics: [
        { label: 'AI Model', value: 'Gemini 1.5' },
        { label: 'Voice', value: 'Enabled' },
      ],
      onAction: () => navigate('/voice-assistant')
    },
    {
      title: 'Legal Research & Citation',
      description: 'Access case law, regulations, and generate legal briefs with proper citations.',
      icon: <Search className="w-6 h-6" />,
      actionText: 'View',
      metrics: [
        { label: 'Sources Accessed', value: '1,892' },
        { label: 'Citations Generated', value: '342' },
      ],
      onAction: () => navigate('/research')
    },
    {
      title: 'Document Management',
      description: 'Upload, organize, and manage all your legal documents in one place.',
      icon: <FileText className="w-6 h-6" />,
      actionText: 'View',
      metrics: [
        { label: 'Total Documents', value: '247' },
        { label: 'Recent Uploads', value: '12' },
      ],
      onAction: () => navigate('/documents')
    },
  ];

  const recentActivity = [
    { action: 'Document Uploaded', item: 'Service Agreement - TechCorp', time: '2 hours ago' },
    { action: 'Compliance Check', item: 'Privacy Policy v2.1', time: '4 hours ago' },
    { action: 'Risk Analysis', item: 'Vendor Contract - SupplyChain Inc', time: '1 day ago' },
    { action: 'Deadline Added', item: 'Renewal - Office Lease', time: '2 days ago' },
  ];

  const upcomingDeadlines = [
    { title: 'Contract Renewal', description: 'Software License - CloudTech', date: 'Sep 15, 2026', urgent: true },
    { title: 'Payment Due', description: 'Legal Research Subscription', date: 'Sep 22, 2026', urgent: false },
    { title: 'Compliance Review', description: 'Updated Data Protection Policy', date: 'Oct 1, 2026', urgent: false },
    { title: 'Contract Expiration', description: 'Office Equipment Lease', date: 'Oct 10, 2026', urgent: false },
  ];

  return (
    <div className="min-h-screen bg-dark-background text-dark-foreground p-4 sm:p-6">
      {/* Header Section */}
      <motion.div 
        className="mb-8 sm:mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl sm:text-5xl font-light tracking-tighter text-dark-foreground mb-2">
          Dashboard
        </h1>
        <p className="text-dark-muted-foreground font-light">Welcome back, {user?.displayName || 'User'}</p>
      </motion.div>

      {/* Agent Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {agents.map((agent, index) => (
          <motion.div
            key={index}
            className="p-6 rounded-3xl bg-[#0E0E0E] backdrop-blur-xl border border-white/10 border-white/20 hover:border-white/30 transition-all duration-300 cursor-pointer group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            onClick={agent.onAction}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-dark-primary/20 flex items-center justify-center text-dark-primary group-hover:scale-110 transition-transform duration-300">
                {agent.icon}
              </div>
            </div>

            <h3 className="text-lg font-medium tracking-tight mb-2 text-dark-foreground group-hover:text-dark-primary transition-colors duration-300">
              {agent.title}
            </h3>
            <p className="text-sm text-dark-muted-foreground font-light mb-4 line-clamp-2">
              {agent.description}
            </p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {agent.metrics.map((metric, idx) => (
                <div key={idx} className="p-2 rounded-xl bg-[#0E0E0E] border border-white/10">
                  <p className="text-xs text-dark-muted-foreground font-light">{metric.label}</p>
                  <p className="text-sm font-medium text-dark-foreground">{metric.value}</p>
                </div>
              ))}
            </div>

            <button className="w-full px-4 py-2 rounded-full bg-dark-primary text-dark-background text-sm font-medium hover:scale-105 transition-transform duration-300">
              {agent.actionText}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity & Deadlines */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          className="p-6 rounded-3xl bg-[#0E0E0E] backdrop-blur-xl border border-white/10"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h3 className="text-xl font-medium tracking-tight mb-6 text-dark-foreground">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start pb-4 border-b border-white/10 last:border-0">
                <div className="w-10 h-10 rounded-full bg-dark-primary/20 flex items-center justify-center mr-3 flex-shrink-0">
                  <FileText className="w-5 h-5 text-dark-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-dark-foreground truncate">
                    {activity.action}: {activity.item}
                  </p>
                  <p className="text-xs text-dark-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Deadlines */}
        <motion.div
          className="p-6 rounded-3xl bg-[#0E0E0E] backdrop-blur-xl border border-white/10"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h3 className="text-xl font-medium tracking-tight mb-6 text-dark-foreground">
            Upcoming Deadlines
          </h3>
          <div className="space-y-4">
            {upcomingDeadlines.map((deadline, index) => (
              <div key={index} className="flex items-start pb-4 border-b border-white/10 last:border-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                  deadline.urgent ? 'bg-red-500/20' : 'bg-yellow-500/20'
                }`}>
                  <Calendar className={`w-5 h-5 ${deadline.urgent ? 'text-red-400' : 'text-yellow-400'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-dark-foreground">{deadline.title}</p>
                    <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${
                      deadline.urgent ? 'bg-red-500/20 text-red-300' : 'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      {deadline.date}
                    </span>
                  </div>
                  <p className="text-xs text-dark-muted-foreground mt-1 truncate">{deadline.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;


