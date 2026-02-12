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
    <div className="min-h-screen bg-[#000000] text-white ml-6 p-4 sm:p-6">

      
      {/* 🔥 Wider Container */}
      <div className="max-w-7xl xl:max-w-[1400px] mx-auto">

        {/* Header */}
        <div className="mb-12 relative">
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#ffffff]/10 rounded-full blur-xl"></div>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold relative">
                Settings
                <span className="block w-16 h-1 bg-white mt-2 rounded-full"></span>
              </h1>
              <p className="mt-3 text-base text-gray-400">
                Manage your account preferences and settings
              </p>
            </div>

            <button className="px-6 py-3 bg-white hover:bg-white/90 text-black font-medium rounded-lg transition-all duration-300">
              Save Changes
            </button>
          </div>
        </div>

        {/* 🔥 Grid Expanded */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT SECTION */}
          <div className="lg:col-span-2 space-y-8">

            {/* User Preferences */}
           <div className="bg-black rounded-2xl p-6 border-gray-500/15">

              <h2 className="text-2xl font-medium mb-6">
                User Preferences
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="text-sm text-gray-400 block mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 rounded-xl bg-[#0E0E0E] border border-gray-400/40 text-white focus:border-white focus:outline-none transition-all"
                    defaultValue="John Smith"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 block mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full p-3 rounded-xl bg-[#0E0E0E] border border-gray-400/40 text-white focus:border-white focus:outline-none transition-all"
                    defaultValue="john.smith@company.com"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 block mb-2">
                    Language
                  </label>
                  <select className="w-full p-3 rounded-xl bg-[#0E0E0E] border border-gray-400/40 text-white focus:border-white focus:outline-none transition-all">
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-[#0E0E0E] rounded-2xl p-6  border-gray-400/40 shadow-lg">
              <h2 className="text-2xl font-medium mb-6">
                Notification Settings
              </h2>

              <div className="space-y-4">
                {[
                  {
                    title: "Email Notifications",
                    desc: "Receive alerts and updates via email",
                    state: emailNotifications,
                    setter: setEmailNotifications
                  },
                  {
                    title: "Slack Notifications",
                    desc: "Receive alerts and updates via Slack",
                    state: slackNotifications,
                    setter: setSlackNotifications
                  },
                  {
                    title: "Calendar Integration",
                    desc: "Add deadlines to your calendar automatically",
                    state: calendarIntegration,
                    setter: setCalendarIntegration
                  }
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-4 rounded-xl bg-[#0E0E0E] border border-gray-400/40"
                  >
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-gray-400 mt-1">
                        {item.desc}
                      </p>
                    </div>

                    <div
                      className={`relative inline-block w-12 h-6 rounded-full cursor-pointer transition-all ${
                        item.state ? "bg-white" : "bg-gray-600"
                      }`}
                      onClick={() =>
                        toggleSwitch(item.setter, item.state)
                      }
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 rounded-full bg-black transition-all ${
                          item.state ? "left-7" : "left-1"
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT SECTION */}
          <div className="space-y-8">

            <div className="bg-[#0E0E0E] rounded-2xl p-6 border-gray-400/40 shadow-lg">
              <h2 className="text-2xl font-medium mb-6">
                Appearance
              </h2>

              <select className="w-full p-3 rounded-xl bg-[#0E0E0E] border border-gray-400/40 text-white focus:border-white focus:outline-none transition-all">
                <option>Small</option>
                <option>Medium</option>
                <option>Large</option>
              </select>
            </div>

            <div className="bg-[#0E0E0E] rounded-2xl p-6  border-gray-400/40 shadow-lg">
              <h2 className="text-2xl font-medium mb-6">
                Integrations
              </h2>
              <p className="text-gray-400 text-sm">
                Manage third-party service connections.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
