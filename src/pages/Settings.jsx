import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [slackNotifications, setSlackNotifications] = useState(false);
  const [calendarIntegration, setCalendarIntegration] = useState(true);

  const toggleSwitch = (setter, currentValue) => {
    setter(!currentValue);
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 sm:mb-12 relative">
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#ffffff]/10 rounded-full blur-xl"></div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-dark-foreground relative">
                Settings
                <span className="block w-16 h-1 bg-[#ffffff] mt-2 rounded-full"></span>
              </h1>
              <p className="text-dark-foreground mt-3 text-base">Manage your account preferences and settings</p>
            </div>
            <button className="px-6 py-3 bg-[#ffffff] hover:bg-[#ffffff]/90 text-[#1a1a1a] font-medium rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-[#ffffff]/20 w-full sm:w-auto">
              Save Changes
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* User Preferences Card */}
            <div className="bg-[#0E0E0E] rounded-2xl p-5 sm:p-6 backdrop-blur-xl border border-white/10 shadow-lg">
              <h2 className="text-xl sm:text-2xl font-medium mb-5 sm:mb-6 text-dark-foreground flex items-center">
                <svg className="w-5 h-5 mr-2 text-dark-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                User Preferences
              </h2>
              <div className="space-y-4 sm:space-y-5">
                <div>
                  <label className="text-sm text-dark-muted-foreground block mb-2">Display Name</label>
                  <input 
                    type="text" 
                    className="w-full p-3 rounded-xl bg-[#0E0E0E] border border-white/10 text-dark-foreground focus:border-[#ffffff] focus:outline-none transition-all duration-300"
                    defaultValue="John Smith"
                  />
                </div>
                <div>
                  <label className="text-sm text-dark-muted-foreground block mb-2">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full p-3 rounded-xl bg-[#0E0E0E] border border-white/10 text-dark-foreground focus:border-[#ffffff] focus:outline-none transition-all duration-300"
                    defaultValue="john.smith@company.com"
                  />
                </div>
                <div>
                  <label className="text-sm text-dark-muted-foreground block mb-2">Language</label>
                  <select className="w-full p-3 rounded-xl bg-[#0E0E0E] border border-white/10 text-dark-foreground focus:border-[#ffffff] focus:outline-none transition-all duration-300">
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Notification Settings Card */}
            <div className="bg-[#0E0E0E] rounded-2xl p-5 sm:p-6 backdrop-blur-xl border border-white/10 shadow-lg">
              <h2 className="text-xl sm:text-2xl font-medium mb-5 sm:mb-6 text-dark-foreground flex items-center">
                <svg className="w-5 h-5 mr-2 text-dark-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                </svg>
                Notification Settings
              </h2>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-xl bg-[#0E0E0E] border border-white/10 hover:ring-dark-primary/20 transition-all duration-300 gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-dark-foreground text-base">Email Notifications</h3>
                    <p className="text-sm text-dark-muted-foreground mt-1">Receive alerts and updates via email</p>
                  </div>
                  <div 
                    className={`relative inline-block w-12 h-6 rounded-full transition-all duration-300 cursor-pointer ${emailNotifications ? 'bg-[#ffffff]' : 'bg-[#0E0E0E]'}`}
                    onClick={() => toggleSwitch(setEmailNotifications, emailNotifications)}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-black transition-all duration-300 ${emailNotifications ? 'left-7' : 'left-1'}`}></div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-xl bg-[#0E0E0E] border border-white/10 hover:ring-dark-primary/20 transition-all duration-300 gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-dark-foreground text-base">Slack Notifications</h3>
                    <p className="text-sm text-dark-muted-foreground mt-1">Receive alerts and updates via Slack</p>
                  </div>
                  <div 
                    className={`relative inline-block w-12 h-6 rounded-full transition-all duration-300 cursor-pointer ${slackNotifications ? 'bg-[#ffffff]' : 'bg-[#0E0E0E]'}`}
                    onClick={() => toggleSwitch(setSlackNotifications, slackNotifications)}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-black transition-all duration-300 ${slackNotifications ? 'left-7' : 'left-1'}`}></div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-xl bg-[#0E0E0E] border border-white/10 hover:ring-dark-primary/20 transition-all duration-300 gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-dark-foreground text-base">Calendar Integration</h3>
                    <p className="text-sm text-dark-muted-foreground mt-1">Add deadlines to your calendar automatically</p>
                  </div>
                  <div 
                    className={`relative inline-block w-12 h-6 rounded-full transition-all duration-300 cursor-pointer ${calendarIntegration ? 'bg-[#ffffff]' : 'bg-[#0E0E0E]'}`}
                    onClick={() => toggleSwitch(setCalendarIntegration, calendarIntegration)}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-black transition-all duration-300 ${calendarIntegration ? 'left-7' : 'left-1'}`}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6 sm:space-y-8">
            {/* Appearance Card */}
            <div className="bg-[#0E0E0E] rounded-2xl p-5 sm:p-6 backdrop-blur-xl border border-white/10 shadow-lg">
              <h2 className="text-xl sm:text-2xl font-medium mb-5 sm:mb-6 text-dark-foreground flex items-center">
                <svg className="w-5 h-5 mr-2 text-dark-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"></path>
                </svg>
                Appearance
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-dark-muted-foreground block mb-2">Font Size</label>
                  <select className="w-full p-3 rounded-xl bg-[#0E0E0E] border border-white/10 text-dark-foreground focus:border-[#ffffff] focus:outline-none transition-all duration-300">
                    <option>Small</option>
                    <option selected>Medium</option>
                    <option>Large</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Integrations Card */}
            <div className="bg-[#0E0E0E] rounded-2xl p-5 sm:p-6 backdrop-blur-xl border border-white/10 shadow-lg">
              <h2 className="text-xl sm:text-2xl font-medium mb-5 sm:mb-6 text-dark-foreground flex items-center">
                <svg className="w-5 h-5 mr-2 text-dark-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                </svg>
                Integrations
              </h2>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#0E0E0E] border border-white/10 hover:ring-dark-primary/20 transition-all duration-300 flex items-center">
                  <div className="w-10 h-10 rounded-full bg-[#ffffff]/20 flex items-center justify-center text-dark-primary flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                      <h3 className="font-medium text-dark-foreground text-sm">Google Calendar</h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-[#ffffff]/20 text-dark-primary self-start">Connected</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-[#0E0E0E] border border-white/10 hover:ring-dark-primary/20 transition-all duration-300 flex items-center">
                  <div className="w-10 h-10 rounded-full bg-[#ffffff]/20 flex items-center justify-center text-dark-primary flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                    </svg>
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                      <h3 className="font-medium text-dark-foreground text-sm">Slack</h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-[#ffffff]/20 text-dark-primary self-start">Connected</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-[#0E0E0E] border border-white/10 hover:ring-dark-primary/20 transition-all duration-300 flex items-center">
                  <div className="w-10 h-10 rounded-full bg-[#ffffff]/20 flex items-center justify-center text-dark-primary flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                      <h3 className="font-medium text-dark-foreground text-sm">DocuSign</h3>
                      <button className="text-xs px-3 py-1.5 rounded-lg bg-[#ffffff]/10 text-dark-primary hover:bg-[#ffffff]/20 transition-all self-start">
                        Connect
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;



