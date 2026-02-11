// AgentCard.jsx
import React from 'react';
import PropTypes from 'prop-types';

const AgentCard = ({ title, icon, description, actionText, onAction, metrics }) => {
  return (
    <div className="bg-gradient-to-b from-[#1f1f1f] to-[#151515] rounded-2xl p-5 sm:p-6 ring-1 ring-white/5 hover:ring-[#ffffff]/20 shadow-lg hover:shadow-xl transition-all duration-500 group h-full flex flex-col">
      <div className="flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-4 gap-2">
          <div className="flex items-start min-w-0 flex-1 gap-3">
            {icon && (
              <div className="w-10 h-10 rounded-full bg-[#ffffff] flex items-center justify-center text-[#1a1a1a] transform transition-all duration-300 group-hover:scale-110 group-hover:bg-[#ffffff]/90 flex-shrink-0">
                {icon}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h3 className="text-lg sm:text-xl font-semibold text-white transition-all duration-500 leading-tight break-words">
                {title}
              </h3>
            </div>
          </div>
          {actionText && (
            <button 
              onClick={onAction} 
              className="text-xs px-3 py-1.5 bg-[#ffffff]/10 hover:bg-[#ffffff] text-dark-primary hover:text-[#1a1a1a] rounded-lg transition-all duration-300 hover:shadow-md hover:shadow-[#ffffff]/20 border border-[#ffffff]/20 hover:border-[#ffffff]/50 flex-shrink-0 whitespace-nowrap"
            >
              {actionText}
            </button>
          )}
        </div>
        
        <p className="text-dark-foreground mb-4 font-light text-sm leading-relaxed flex-1 break-words">
          {description}
        </p>
        
        {metrics && metrics.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-auto">
            {metrics.map((metric, index) => (
              <div key={index} className="bg-[#232323] p-3 rounded-lg ring-1 ring-white/5 hover:ring-[#ffffff]/30 transition-all duration-300 hover:shadow-md hover:shadow-[#ffffff]/10 group/metric">
                <p className="text-xs text-dark-muted-foreground mb-1 group-hover/metric:text-dark-primary transition-all duration-300 break-words leading-tight">
                  {metric.label}
                </p>
                <div className="flex items-end flex-wrap gap-1">
                  <span className="text-base font-semibold text-dark-primary group-hover/metric:scale-105 transform transition-all duration-300 inline-block leading-none">
                    {metric.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

AgentCard.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.node,
  description: PropTypes.string.isRequired,
  actionText: PropTypes.string,
  onAction: PropTypes.func,
  metrics: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      change: PropTypes.number
    })
  )
};

export default AgentCard;