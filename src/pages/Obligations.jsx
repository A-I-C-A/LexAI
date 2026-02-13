import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Obligations = () => {
  const [activeTab, setActiveTab] = useState('upcoming');

  return (
    <div className="min-h-screen bg-background text-foreground ml-[260px] border-l border-border">

      {/* Main Container */}
      <div className="px-8 xl:px-12 py-10">

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-semibold tracking-tight">
            Obligation & Deadline Tracker
          </h1>
          <p className="text-muted-foreground mt-3">
            AI-powered deadline management with smart calendar integration
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          <div className="bg-card p-6 rounded-xl border border-border">
            <h3 className="text-2xl font-semibold">24</h3>
            <p className="text-sm text-muted-foreground">Total Obligations</p>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border">
            <h3 className="text-2xl font-semibold">3</h3>
            <p className="text-sm text-muted-foreground">Due This Week</p>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border">
            <h3 className="text-2xl font-semibold">92%</h3>
            <p className="text-sm text-muted-foreground">Compliance Rate</p>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border">
            <h3 className="text-2xl font-semibold">12</h3>
            <p className="text-sm text-muted-foreground">Active Alerts</p>
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

          {/* LEFT SECTION (FIX APPLIED HERE) */}
          <div className="xl:col-span-2 flex justify-center">
            
            {/* Width Constraint Wrapper */}
            <div className="w-full max-w-[1050px] space-y-6">

              {/* Tabs */}
              <div className="flex border-b border-border">
                {['upcoming','overdue','completed'].map(tab => (
                  <button
                    key={tab}
                    className={`px-5 py-3 text-sm font-medium capitalize transition-all ${
                      activeTab === tab
                        ? 'border-b-2 border-foreground text-foreground'
                        : 'text-muted-foreground'
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* CARDS */}
              {[1,2,3].map((item) => (
                <div
                  key={item}
                  className="bg-card p-6 rounded-xl border border-border hover:border-border transition-all"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold">
                        GST Filing – FY 2025
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        ₹15,000 payable
                      </p>
                    </div>

                    <span className="text-xs px-3 py-1 rounded-full bg-muted">
                      3 days left
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    As per Section 4.2 of the agreement, monthly GST filing required.
                  </p>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">
                      From: GST Notice
                    </span>

                    <div className="flex gap-3">
                      <button className="text-xs px-3 py-2 bg-muted rounded-lg hover:bg-foreground hover:text-background transition-all">
                        Add to Calendar
                      </button>

                      <button className="text-xs px-3 py-2 bg-muted rounded-lg hover:bg-foreground hover:text-background transition-all">
                        Set Alert
                      </button>
                    </div>
                  </div>
                </div>
              ))}

            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="space-y-8">

            <div className="bg-card p-6 rounded-xl border border-border">
              <h2 className="text-lg font-semibold mb-6">
                Notification Settings
              </h2>
              <p className="text-sm text-muted-foreground">
                Manage email, SMS, Slack and escalation alerts.
              </p>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border">
              <h2 className="text-lg font-semibold mb-6">
                Compliance Score
              </h2>

              <div className="w-full h-3 bg-muted rounded-full mb-4">
                <div className="h-3 bg-foreground rounded-full w-[85%]"></div>
              </div>

              <div className="text-sm text-muted-foreground">
                Overall system compliance performance.
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Obligations;
