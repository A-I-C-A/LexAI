import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Calendar,
  BarChart3,
  MessageSquare,
  Play,
  MessageCircle,
  Mic,
  Search,
  FileText
} from 'lucide-react';
import { useUserAuth } from '../context/UserAuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useUserAuth();

  const agents = [
    {
      title: 'Compliance Guardian',
      description:
        'Monitor regulatory changes and ensure document compliance across jurisdictions.',
      icon: <Shield className="w-6 h-6" />,
      actionText: 'View',
      metrics: [
        { label: 'Compliance Score', value: '94%' },
        { label: 'Monitored Regulations', value: '1,243' }
      ],
      onAction: () => navigate('/compliance')
    },
    {
      title: 'Obligation & Deadline Tracker',
      description:
        'Track contract deadlines, payment schedules, and renewal dates automatically.',
      icon: <Calendar className="w-6 h-6" />,
      actionText: 'View',
      metrics: [
        { label: 'Upcoming Deadlines', value: '12' },
        { label: 'Tracked Obligations', value: '87' }
      ],
      onAction: () => navigate('/obligations')
    },
    {
      title: 'Risk & Fairness Analyzer',
      description:
        'Identify and assess contractual risks with interactive heatmaps and scoring.',
      icon: <BarChart3 className="w-6 h-6" />,
      actionText: 'View',
      metrics: [
        { label: 'Risk Score', value: '32 (Low)' },
        { label: 'Fairness Rating', value: '8.5/10' }
      ],
      onAction: () => navigate('/risk')
    },
    {
      title: 'Negotiation Strategist',
      description:
        'Generate counter-proposals and negotiation strategies based on contract analysis.',
      icon: <MessageSquare className="w-6 h-6" />,
      actionText: 'View',
      metrics: [
        { label: 'Success Rate', value: '78%' },
        { label: 'Avg. Improvement', value: '23%' }
      ],
      onAction: () => navigate('/negotiation')
    },
    {
      title: 'Scenario Simulation',
      description:
        'Model different contract scenarios and visualize potential outcomes.',
      icon: <Play className="w-6 h-6" />,
      actionText: 'View',
      metrics: [
        { label: 'Scenarios Created', value: '24' },
        { label: 'Simulations Run', value: '156' }
      ],
      onAction: () => navigate('/scenarios')
    },
    {
      title: 'AI Chatbot',
      description:
        'Chat with LegalAxis AI for instant legal insights and support.',
      icon: <MessageCircle className="w-6 h-6" />,
      actionText: 'Chat',
      metrics: [
        { label: 'AI Model', value: 'Groq Llama' },
        { label: 'Realtime', value: 'Yes' }
      ],
      onAction: () => navigate('/chatbot')
    },
    {
      title: 'Voice Assistant',
      description:
        'Use your voice to interact with LegalAxis AI for hands-free help.',
      icon: <Mic className="w-6 h-6" />,
      actionText: 'Speak',
      metrics: [
        { label: 'AI Model', value: 'Groq Llama' },
        { label: 'Voice', value: 'Enabled' }
      ],
      onAction: () => navigate('/voice-assistant')
    },
    {
      title: 'Legal Research & Citation',
      description:
        'Access case law, regulations, and generate legal briefs with proper citations.',
      icon: <Search className="w-6 h-6" />,
      actionText: 'View',
      metrics: [
        { label: 'Sources Accessed', value: '1,892' },
        { label: 'Citations Generated', value: '342' }
      ],
      onAction: () => navigate('/research')
    },
    {
      title: 'Document Management',
      description:
        'Upload, organize, and manage all your legal documents in one place.',
      icon: <FileText className="w-6 h-6" />,
      actionText: 'View',
      metrics: [
        { label: 'Total Documents', value: '247' },
        { label: 'Recent Uploads', value: '12' }
      ],
      onAction: () => navigate('/documents')
    }
  ];

  return (
    <div className="bg-background text-foreground min-h-screen ml-[260px]">
      {/* Full Width Container */}
      <div className="w-full px-12 py-16">
        
        {/* Header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-light tracking-tight mb-3">
            Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Welcome back, {user?.displayName || 'User'}
          </p>
        </motion.div>

        {/* Agent Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
          {agents.map((agent, index) => (
            <motion.div
              key={index}
              className="p-6 rounded-2xl bg-card backdrop-blur-xl border border-border hover:border-border/80 transition-all duration-300 cursor-pointer group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              whileHover={{ y: -6, scale: 1.02 }}
              onClick={agent.onAction}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground group-hover:scale-110 group-hover:text-foreground transition-all duration-300">
                  {agent.icon}
                </div>
              </div>

              <h3 className="text-lg font-medium tracking-tight mb-2">
                {agent.title}
              </h3>

              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {agent.description}
              </p>

              <div className="grid grid-cols-2 gap-3 mb-4">
                {agent.metrics.map((metric, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-xl bg-muted border border-border"
                  >
                    <p className="text-xs text-muted-foreground">
                      {metric.label}
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {metric.value}
                    </p>
                  </div>
                ))}
              </div>

              <button className="w-full px-8 py-3 rounded-full bg-foreground text-background text-sm font-semibold hover:scale-[1.03] active:scale-[0.98] transition-all duration-300">
                {agent.actionText}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
