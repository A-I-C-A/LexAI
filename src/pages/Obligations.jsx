import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Bell, X } from 'lucide-react';

const Obligations = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [selectedObligation, setSelectedObligation] = useState(null);
  const [alertSettings, setAlertSettings] = useState({
    email: true,
    sms: false,
    days: 3
  });

  const addToGoogleCalendar = (title, description, dueDate) => {
    const formatGoogleDate = (date) => {
      return date.toISOString().replace(/-|:|\.\d+/g, '');
    };

    const startDate = new Date(dueDate);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&details=${encodeURIComponent(description)}&dates=${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`;
    
    window.open(googleCalendarUrl, '_blank');
  };

  const addToOutlookCalendar = (title, description, dueDate) => {
    const startDate = new Date(dueDate);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

    const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(description)}&startdt=${startDate.toISOString()}&enddt=${endDate.toISOString()}`;
    
    window.open(outlookUrl, '_blank');
  };

  const downloadICS = (title, description, dueDate) => {
    const formatDate = (date) => {
      return date.toISOString().replace(/-|:|\.\d+/g, '');
    };

    const startDate = new Date(dueDate);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//LegalAxis//Obligation Tracker//EN',
      'BEGIN:VEVENT',
      `DTSTART:${formatDate(startDate)}`,
      `DTEND:${formatDate(endDate)}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${title.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSetAlert = () => {
    console.log('Alert set:', alertSettings, 'for:', selectedObligation);
    // Here you would typically save this to your backend/database
    alert(`Alert set! You will be notified ${alertSettings.days} days before via ${alertSettings.email ? 'Email' : ''}${alertSettings.sms ? ' & SMS' : ''}`);
    setShowAlertModal(false);
  };

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
                      <button 
                        onClick={() => {
                          setSelectedObligation({
                            title: 'GST Filing – FY 2025',
                            description: 'As per Section 4.2 of the agreement, monthly GST filing required. ₹15,000 payable',
                            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
                          });
                          setShowCalendarModal(true);
                        }}
                        className="text-xs px-3 py-2 bg-muted rounded-lg hover:bg-foreground hover:text-background transition-all"
                      >
                        Add to Calendar
                      </button>

                      <button 
                        onClick={() => {
                          setSelectedObligation({
                            title: 'GST Filing – FY 2025',
                            description: 'As per Section 4.2 of the agreement, monthly GST filing required. ₹15,000 payable',
                            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
                          });
                          setShowAlertModal(true);
                        }}
                        className="text-xs px-3 py-2 bg-muted rounded-lg hover:bg-foreground hover:text-background transition-all"
                      >
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

      {/* Calendar Modal */}
      {showCalendarModal && selectedObligation && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Add to Calendar
              </h3>
              <button 
                onClick={() => setShowCalendarModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-muted-foreground mb-6">
              Choose your preferred calendar service:
            </p>

            <div className="space-y-3">
              <button
                onClick={() => {
                  addToGoogleCalendar(selectedObligation.title, selectedObligation.description, selectedObligation.dueDate);
                  setShowCalendarModal(false);
                }}
                className="w-full px-4 py-3 bg-muted hover:bg-foreground hover:text-background rounded-lg text-left transition-all flex items-center gap-3"
              >
                <div className="w-8 h-8 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="font-medium">Google Calendar</span>
              </button>

              <button
                onClick={() => {
                  addToOutlookCalendar(selectedObligation.title, selectedObligation.description, selectedObligation.dueDate);
                  setShowCalendarModal(false);
                }}
                className="w-full px-4 py-3 bg-muted hover:bg-foreground hover:text-background rounded-lg text-left transition-all flex items-center gap-3"
              >
                <div className="w-8 h-8 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="font-medium">Outlook Calendar</span>
              </button>

              <button
                onClick={() => {
                  downloadICS(selectedObligation.title, selectedObligation.description, selectedObligation.dueDate);
                  setShowCalendarModal(false);
                }}
                className="w-full px-4 py-3 bg-muted hover:bg-foreground hover:text-background rounded-lg text-left transition-all flex items-center gap-3"
              >
                <div className="w-8 h-8 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="font-medium">Apple Calendar / Other (.ics)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Modal */}
      {showAlertModal && selectedObligation && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Set Alert
              </h3>
              <button 
                onClick={() => setShowAlertModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Notify me before:
                </label>
                <select
                  value={alertSettings.days}
                  onChange={(e) => setAlertSettings({...alertSettings, days: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-emerald-500/40 focus:border-transparent"
                >
                  <option value={1}>1 day before</option>
                  <option value={2}>2 days before</option>
                  <option value={3}>3 days before</option>
                  <option value={7}>1 week before</option>
                  <option value={14}>2 weeks before</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">
                  Notification method:
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={alertSettings.email}
                      onChange={(e) => setAlertSettings({...alertSettings, email: e.target.checked})}
                      className="w-4 h-4 rounded border-border"
                    />
                    <span className="text-sm">Email notification</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={alertSettings.sms}
                      onChange={(e) => setAlertSettings({...alertSettings, sms: e.target.checked})}
                      className="w-4 h-4 rounded border-border"
                    />
                    <span className="text-sm">SMS notification</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowAlertModal(false)}
                className="flex-1 px-4 py-2 bg-muted rounded-lg hover:bg-foreground hover:text-background transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSetAlert}
                className="flex-1 px-4 py-2 bg-foreground text-background rounded-lg hover:opacity-90 transition-all"
              >
                Set Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Obligations;
