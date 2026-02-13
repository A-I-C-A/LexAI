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
    <div className="min-h-screen bg-background text-foreground ml-6 p-4 sm:p-6">

      
      {/* 🔥 Wider Container */}
      <div className="max-w-7xl xl:max-w-[1400px] mx-auto">

        {/* Header */}
        <div className="mb-12 relative">
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-foreground/10 rounded-full blur-xl"></div>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold relative">
                Settings
                <span className="block w-16 h-1 bg-foreground mt-2 rounded-full"></span>
              </h1>
              <p className="mt-3 text-base text-muted-foreground">
                Manage your account preferences and settings
              </p>
            </div>

            <button className="px-6 py-3 bg-foreground hover:bg-foreground/90 text-background font-medium rounded-lg transition-all duration-300">
              Save Changes
            </button>
          </div>
        </div>

        {/* 🔥 Grid Expanded */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT SECTION */}
          <div className="lg:col-span-2 space-y-8">

            {/* User Preferences */}
           <div className="bg-background rounded-2xl p-6 border-border">

              <h2 className="text-2xl font-medium mb-6">
                User Preferences
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="text-sm text-muted-foreground block mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 rounded-xl bg-card border border-border text-foreground focus:border-emerald-500 focus:outline-none transition-all"
                    defaultValue="John Smith"
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground block mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full p-3 rounded-xl bg-card border border-border text-foreground focus:border-emerald-500 focus:outline-none transition-all"
                    defaultValue="john.smith@company.com"
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground block mb-2">
                    Language
                  </label>
                  <select className="w-full p-3 rounded-xl bg-card border border-border text-foreground focus:border-emerald-500 focus:outline-none transition-all">
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-card rounded-2xl p-6  border-border shadow-lg">
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
                    className="flex justify-between items-center p-4 rounded-xl bg-card border border-border"
                  >
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.desc}
                      </p>
                    </div>

                    <div
                      className={`relative inline-block w-12 h-6 rounded-full cursor-pointer transition-all ${
                        item.state ? "bg-foreground" : "bg-gray-600"
                      }`}
                      onClick={() =>
                        toggleSwitch(item.setter, item.state)
                      }
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 rounded-full bg-background transition-all ${
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

            <div className="bg-card rounded-2xl p-6 border-border shadow-lg">
              <h2 className="text-2xl font-medium mb-6">
                Appearance
              </h2>

              <select className="w-full p-3 rounded-xl bg-card border border-border text-foreground focus:border-emerald-500 focus:outline-none transition-all">
                <option>Small</option>
                <option>Medium</option>
                <option>Large</option>
              </select>
            </div>

            <div className="bg-card rounded-2xl p-6  border-border shadow-lg">
              <h2 className="text-2xl font-medium mb-6">
                Integrations
              </h2>
              <p className="text-muted-foreground text-sm">
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
