import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const TABS = [
  { key: 'counter', label: 'Counter-Proposal', icon: '' },
  { key: 'playbook', label: 'Playbook', icon: '' },
  { key: 'email', label: 'Email Draft', icon: '' },
  { key: 'power', label: 'Power Analysis', icon: '' },
  { key: 'winwin', label: 'Win-Win', icon: '' },
  { key: 'history', label: 'History', icon: '' },
];

const MOCK_HISTORY = [
  { id: 1, date: '2023-10-15', type: 'Counter-Proposal', outcome: 'Successful', details: 'Price negotiation with Vendor Inc.' },
  { id: 2, date: '2023-10-10', type: 'Contract Terms', outcome: 'Partially Successful', details: 'Service agreement with TechCorp' },
  { id: 3, date: '2023-10-05', type: 'Partnership', outcome: 'Successful', details: 'Joint venture agreement with Innovate Ltd.' },
];

const Negotiation = () => {
  const [activeTab, setActiveTab] = useState('counter');
  const [inputClause, setInputClause] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [negotiationHistory, setNegotiationHistory] = useState(MOCK_HISTORY);
  const [powerAnalysisInput, setPowerAnalysisInput] = useState('');
  const [powerAnalysisResult, setPowerAnalysisResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const tabRef = useRef(null);
  // Per-tab inputs
  const [playbookInput, setPlaybookInput] = useState('');
  const [emailContext, setEmailContext] = useState('Initial Proposal');
  const [emailInput, setEmailInput] = useState('');
  const [winwinOurGoals, setWinwinOurGoals] = useState('');
  const [winwinTheirGoals, setWinwinTheirGoals] = useState('');
  const [winwinInput, setWinwinInput] = useState('');

  // Gemini API call helper
  const callGemini = async (prompt, { details, typeLabel } = {}) => {
    setLoading(true);
    setAiResponse('');
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('API key not found');
      }
      
      const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + apiKey, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [ { role: 'user', parts: [ { text: prompt } ] } ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024
          }
        }),
      });
      
      if (!res.ok) {
        const errText = await res.text().catch(() => '');
        throw new Error(`API error: ${res.status} ${errText}`);
      }
      const data = await res.json();
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
      setAiResponse(responseText);
      
      // Add to history if it's a successful generation
      if (responseText !== 'No response generated.') {
        const newHistoryItem = {
          id: negotiationHistory.length + 1,
          date: new Date().toISOString().split('T')[0],
          type: typeLabel || TABS.find(tab => tab.key === activeTab)?.label || 'Unknown',
          outcome: 'Generated',
          details: ((details ?? inputClause) || '').substring(0, 50) + '...'
        };
        setNegotiationHistory([newHistoryItem, ...negotiationHistory]);
      }
    } catch (e) {
      console.error('API call error:', e);
      setAiResponse('Error: ' + e.message);
    }
    setLoading(false);
  };

   const analyzePowerDynamics = async () => {
    if (!powerAnalysisInput) return;
    
    setLoading(true);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const prompt = `Analyze the power dynamics in this negotiation scenario: ${powerAnalysisInput}. 
      Provide a JSON response with this structure: 
      {
        "ourPosition": {"strength": 0-100, "reasoning": ""},
        "theirPosition": {"strength": 0-100, "reasoning": ""},
        "recommendations": []
      }`;
      
      const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + apiKey, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [ { role: 'user', parts: [ { text: prompt } ] } ],
          generationConfig: {
            temperature: 0.3,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
            response_mime_type: 'application/json'
          }
        }),
      });
      if (!res.ok) {
        const errText = await res.text().catch(() => '');
        throw new Error(`API error: ${res.status} ${errText}`);
      }
      const data = await res.json();
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
      
      try {
        // Extract JSON from response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const result = JSON.parse(jsonMatch[0]);
          setPowerAnalysisResult(result);
        } else {
          setPowerAnalysisResult({
            ourPosition: { strength: 50, reasoning: 'Could not parse analysis' },
            theirPosition: { strength: 50, reasoning: 'Could not parse analysis' },
            recommendations: ['Please try again with more context.']
          });
        }
      } catch (e) {
        console.error('JSON parsing error:', e);
        setPowerAnalysisResult({
          ourPosition: { strength: 50, reasoning: 'Analysis error' },
          theirPosition: { strength: 50, reasoning: 'Analysis error' },
          recommendations: ['Please try again with a different description.']
        });
      }
    } catch (e) {
      console.error('API call error:', e);
      setPowerAnalysisResult({
        ourPosition: { strength: 50, reasoning: 'API error: ' + e.message },
        theirPosition: { strength: 50, reasoning: 'API error: ' + e.message },
        recommendations: ['Please check your API key and connection.']
      });
    }
    setLoading(false);
  };

  // Copy to clipboard function
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Tab content renderers
  const renderTab = () => {
    switch (activeTab) {
      case 'counter':
        return (
          <div className="bg-gray-50 dark:bg-[#0E0E0E] rounded-2xl p-6 backdrop-blur-xl border border-gray-200 dark:border-white/10 shadow-lg transition-all duration-300 hover:shadow-[#ffffff]/10">
            <h2 className="text-xl sm:text-2xl font-medium mb-4 text-dark-primary flex items-center">
              <span className="mr-2 text-2xl"></span> Automated Counter-Proposal
            </h2>
            <p className="text-dark-muted-foreground mb-4">Paste a contract clause to generate AI-powered counter-proposals</p>
            <textarea
              className="w-full p-3 rounded-xl bg-gray-50 dark:bg-[#0E0E0E] border border-gray-200 dark:border-white/10 text-dark-foreground focus:outline-none focus:ring-2 focus:ring-dark-primary mb-4 transition-all duration-300"
              rows={5}
              placeholder="Paste contract clause or negotiation point..."
              value={inputClause}
              onChange={e => setInputClause(e.target.value)}
            />
            <button
              className="bg-[#ffffff] text-[#1a1a1a] px-6 py-3 rounded-xl font-medium hover:bg-[#ffffff]/90 transition-all duration-300 mb-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transform hover:-translate-y-0.5"
              onClick={() => callGemini(`Suggest 3 professional counter-proposals for this clause: ${inputClause}. Format each with a heading and bullet points.`)}
              disabled={!inputClause || loading}
            >
              {loading ? (
                <>
                  <span className="animate-spin mr-2"></span>
                  Generating...
                </>
              ) : (
                'Generate Counter-Proposals'
              )}
            </button>
            {aiResponse && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-[#0E0E0E] border border-[#ffffff]/20 rounded-xl text-dark-foreground animate-fadeIn">
                <h3 className="font-medium text-dark-primary mb-2">AI Suggestions:</h3>
                <div className="prose prose-invert max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{aiResponse}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        );
      case 'playbook':
        return (
          <div className="bg-gray-50 dark:bg-[#0E0E0E] rounded-2xl p-6 backdrop-blur-xl border border-gray-200 dark:border-white/10 shadow-lg transition-all duration-300 hover:shadow-[#ffffff]/10">
            <h2 className="text-xl sm:text-2xl font-medium mb-4 text-dark-primary flex items-center">
              <span className="mr-2 text-2xl"></span> Negotiation Playbook
            </h2>
            <p className="text-dark-muted-foreground mb-4">Template responses and talking points for common negotiation scenarios</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 dark:bg-[#0E0E0E] p-4 rounded-xl border border-gray-200 dark:border-white/10 transition-all duration-300 hover:ring-dark-primary/20">
                <h3 className="font-medium text-dark-primary mb-2">Price Negotiation</h3>
                <ul className="list-disc pl-5 text-dark-foreground space-y-1 text-sm">
                  <li>"We appreciate your proposal, but market rates suggest..."</li>
                  <li>"Based on our volume, we'd expect pricing closer to..."</li>
                  <li>"Can you help us understand how this price was determined?"</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 dark:bg-[#0E0E0E] p-4 rounded-xl border border-gray-200 dark:border-white/10 transition-all duration-300 hover:ring-dark-primary/20">
                <h3 className="font-medium text-dark-primary mb-2">Contract Terms</h3>
                <ul className="list-disc pl-5 text-dark-foreground space-y-1 text-sm">
                  <li>"Our standard agreement includes..."</li>
                  <li>"We need to modify the liability clause to..."</li>
                  <li>"The termination terms should be mutual to be fair."</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 dark:bg-[#0E0E0E] p-4 rounded-xl border border-gray-200 dark:border-white/10 transition-all duration-300 hover:ring-dark-primary/20">
                <h3 className="font-medium text-dark-primary mb-2">Timeline Pressures</h3>
                <ul className="list-disc pl-5 text-dark-foreground space-y-1 text-sm">
                  <li>"We understand the urgency but can't compromise on..."</li>
                  <li>"If we expedite this, we'd need..."</li>
                  <li>"What flexibility exists on the deadline?"</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 dark:bg-[#0E0E0E] p-4 rounded-xl border border-gray-200 dark:border-white/10 transition-all duration-300 hover:ring-dark-primary/20">
                <h3 className="font-medium text-dark-primary mb-2">Relationship Building</h3>
                <ul className="list-disc pl-5 text-dark-foreground space-y-1 text-sm">
                  <li>"We value our partnership and want to find a solution that..."</li>
                  <li>"Looking long-term, we believe this approach will..."</li>
                  <li>"How can we structure this to benefit both organizations?"</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-[#ffffff]/10 p-4 rounded-xl border border-[#ffffff]/20">
              <h3 className="font-medium text-dark-primary mb-2">Need a custom response?</h3>
              <textarea
                className="w-full p-3 rounded-xl bg-gray-50 dark:bg-[#0E0E0E] border border-gray-200 dark:border-white/10 text-dark-foreground mb-3 focus:outline-none focus:ring-2 focus:ring-dark-primary transition-all duration-300"
                rows={3}
                placeholder="Describe your negotiation scenario..."
                value={playbookInput}
                onChange={e => setPlaybookInput(e.target.value)}
              />
              <button
                className="bg-[#ffffff] text-[#1a1a1a] px-4 py-2 rounded-xl font-medium hover:bg-[#ffffff]/90 transition-all duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                onClick={() => callGemini(
                  `Create a concise negotiation playbook for this scenario: ${playbookInput}. Include 3-5 talking points, best practices, and common pitfalls to avoid. Use Markdown with headings and bullet points.`,
                  { details: playbookInput, typeLabel: 'Playbook' }
                )}
                disabled={!playbookInput || loading}
              >
                {loading ? 'Generating...' : 'Generate Custom Responses'}
              </button>
            </div>

            {aiResponse && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-[#0E0E0E] border border-[#ffffff]/20 rounded-xl text-dark-foreground animate-fadeIn">
                <h3 className="font-medium text-dark-primary mb-2">Playbook Suggestions:</h3>
                <div className="prose prose-invert max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{aiResponse}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        );
      case 'email':
        return (
          <div className="bg-gray-50 dark:bg-[#0E0E0E] rounded-2xl p-5 sm:p-6 backdrop-blur-xl border border-gray-200 dark:border-white/10 shadow-lg">
            <h2 className="text-xl sm:text-2xl font-medium mb-4 text-dark-primary flex items-center">
              <span className="mr-2 text-2xl"></span> Email Draft Assistance
            </h2>
            <p className="text-dark-muted-foreground mb-4">Generate professional negotiation emails</p>
            
            <div className="mb-4 bg-[#ffffff]/5 p-4 rounded-2xl">
              <h3 className="font-medium text-dark-primary mb-2">Email Context</h3>
              <select 
                className="w-full p-3 rounded-xl bg-gray-50 dark:bg-[#0E0E0E] border border-gray-200 dark:border-white/10 text-dark-foreground mb-3 focus:outline-none focus:ring-2 focus:ring-dark-primary transition-all duration-300"
                value={emailContext}
                onChange={e => setEmailContext(e.target.value)}
              >
                <option value="Initial Proposal">Initial Proposal</option>
                <option value="Counter Offer">Counter Offer</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Final Terms">Final Terms</option>
                <option value="Agreement">Agreement</option>
              </select>
            </div>
            
            <textarea
              className="w-full p-3 rounded-xl bg-gray-50 dark:bg-[#0E0E0E] border border-gray-200 dark:border-white/10 text-dark-foreground mb-4 focus:outline-none focus:ring-2 focus:ring-dark-primary transition-all duration-300"
              rows={5}
              placeholder="Describe the negotiation context, your goals, and any specific points to include..."
              value={emailInput}
              onChange={e => setEmailInput(e.target.value)}
            />
            
            <div className="flex gap-3">
              <button
                className="bg-[#ffffff] text-[#1a1a1a] px-6 py-3 rounded-xl font-medium hover:bg-[#ffffff]/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                onClick={() => callGemini(
                  `Draft a professional negotiation email. Context: ${emailContext}. Details: ${emailInput}. Use clear subject, polite tone, structured paragraphs, and a concise call-to-action. Format in Markdown.`,
                  { details: emailInput, typeLabel: 'Email Draft' }
                )}
                disabled={!emailInput || loading}
              >
                {loading ? 'Generating...' : 'Generate Email'}
              </button>
              
              <button
                className="bg-gray-50 dark:bg-[#0E0E0E] text-dark-primary border border-[#ffffff] px-6 py-3 rounded-xl font-medium hover:bg-[#ffffff]/10 transition-all duration-300 transform hover:-translate-y-0.5"
                onClick={() => { setEmailInput(''); setEmailContext('Initial Proposal'); }}
              >
                Clear
              </button>
            </div>
            
            {aiResponse && (
              <div className="mt-6 p-4 bg-gray-50 dark:bg-[#0E0E0E] border border-[#ffffff]/20 rounded-xl animate-fadeIn">
                <h3 className="font-medium text-dark-primary mb-3">Email Draft:</h3>
                <div className="bg-gray-50 dark:bg-[#0E0E0E] backdrop-blur-xl p-4 rounded text-dark-foreground prose prose-invert max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{aiResponse}</ReactMarkdown>
                </div>
                <div className="mt-4 flex justify-end">
                  <button 
                    className="bg-[#ffffff]/20 text-dark-primary px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#ffffff]/30 transition-all duration-300 flex items-center"
                    onClick={() => copyToClipboard(aiResponse)}
                  >
                    {copied ? ' Copied!' : 'Copy to Clipboard'}
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      case 'power':
        return (
          <div className="bg-gray-50 dark:bg-[#0E0E0E] rounded-2xl p-6 backdrop-blur-xl border border-gray-200 dark:border-white/10 shadow-lg transition-all duration-300 hover:shadow-[#ffffff]/10">
            <h2 className="text-xl sm:text-2xl font-medium mb-4 text-dark-primary flex items-center">
              <span className="mr-2 text-2xl"></span> Power Dynamic Analysis
            </h2>
            <p className="text-dark-muted-foreground mb-4">Analyze the balance of power in your negotiation</p>
            
            <textarea
              className="w-full p-3 rounded-xl bg-gray-50 dark:bg-[#0E0E0E] border border-gray-200 dark:border-white/10 text-dark-foreground mb-4 focus:outline-none focus:ring-2 focus:ring-dark-primary transition-all duration-300"
              rows={5}
              placeholder="Describe the negotiation parties, context, and any relevant factors like alternatives, timing, relationship history, etc."
              value={powerAnalysisInput}
              onChange={e => setPowerAnalysisInput(e.target.value)}
            />
            
            <button
              className="bg-[#ffffff] text-[#1a1a1a] px-6 py-3 rounded-xl font-medium hover:bg-[#ffffff]/90 transition-all duration-300 mb-6 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
              onClick={analyzePowerDynamics}
              disabled={!powerAnalysisInput || loading}
            >
              {loading ? 'Analyzing...' : 'Analyze Power Dynamics'}
            </button>
            
            {powerAnalysisResult ? (
              <div className="mt-4 animate-fadeIn">
                <h3 className="font-medium text-dark-primary mb-4 text-lg">Analysis Results</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 dark:bg-[#0E0E0E] p-4 rounded-xl border border-gray-200 dark:border-white/10 transition-all duration-300 hover:ring-dark-primary/20">
                    <h4 className="font-medium text-dark-primary mb-3">Our Position</h4>
                    <div className="mb-3">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-dark-foreground">Strength</span>
                        <span className="text-sm font-medium text-dark-primary">{powerAnalysisResult.ourPosition.strength}/100</span>
                      </div>
                      <div className="w-full bg-gray-50 dark:bg-[#0E0E0E] rounded-full h-2.5">
                        <div 
                          className="bg-[#ffffff] h-2.5 rounded-full transition-all duration-1000 ease-out" 
                          style={{ width: `${powerAnalysisResult.ourPosition.strength}%` }}
                        ></div>
                      </div>
                    </div>
                    <p className="text-sm text-dark-muted-foreground">{powerAnalysisResult.ourPosition.reasoning}</p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-[#0E0E0E] p-4 rounded-xl border border-gray-200 dark:border-white/10 transition-all duration-300 hover:ring-dark-primary/20">
                    <h4 className="font-medium text-dark-primary mb-3">Their Position</h4>
                    <div className="mb-3">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-dark-foreground">Strength</span>
                        <span className="text-sm font-medium text-dark-primary">{powerAnalysisResult.theirPosition.strength}/100</span>
                      </div>
                      <div className="w-full bg-gray-50 dark:bg-[#0E0E0E] rounded-full h-2.5">
                        <div 
                          className="bg-[#ffffff] h-2.5 rounded-full transition-all duration-1000 ease-out" 
                          style={{ width: `${powerAnalysisResult.theirPosition.strength}%` }}
                        ></div>
                      </div>
                    </div>
                    <p className="text-sm text-dark-muted-foreground">{powerAnalysisResult.theirPosition.reasoning}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-[#0E0E0E] p-4 rounded-xl border border-gray-200 dark:border-white/10 transition-all duration-300 hover:ring-dark-primary/20">
                  <h4 className="font-medium text-dark-primary mb-3">Recommendations</h4>
                  <ul className="list-disc pl-5 space-y-2">
                    {powerAnalysisResult.recommendations.map((rec, index) => (
                      <li key={index} className="text-dark-foreground">{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-[#0E0E0E] p-6 rounded-xl ring-1 ring-white/10 ring-dashed text-center">
                <p className="text-dark-muted-foreground">Enter negotiation details to analyze power dynamics</p>
              </div>
            )}
          </div>
        );
      case 'winwin':
        return (
          <div className="bg-gray-50 dark:bg-[#0E0E0E] rounded-2xl p-6 backdrop-blur-xl border border-gray-200 dark:border-white/10 shadow-lg transition-all duration-300 hover:shadow-[#ffffff]/10">
            <h2 className="text-xl sm:text-2xl font-medium mb-4 text-dark-primary flex items-center">
              <span className="mr-2 text-2xl"></span> Win-Win Optimization
            </h2>
            <p className="text-dark-muted-foreground mb-4">Find solutions that benefit both parties</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 dark:bg-[#0E0E0E] p-4 rounded-xl border border-gray-200 dark:border-white/10 transition-all duration-300 hover:ring-dark-primary/20">
                <h3 className="font-medium text-dark-primary mb-2">Our Goals</h3>
                <textarea
                  className="w-full p-2 rounded bg-gray-50 dark:bg-[#0E0E0E] backdrop-blur-xl border border-gray-200 dark:border-white/10 text-dark-foreground text-sm transition-all duration-300"
                  rows={3}
                  placeholder="What we need to achieve..."
                  value={winwinOurGoals}
                  onChange={e => setWinwinOurGoals(e.target.value)}
                />
              </div>
              
              <div className="bg-gray-50 dark:bg-[#0E0E0E] p-4 rounded-xl border border-gray-200 dark:border-white/10 transition-all duration-300 hover:ring-dark-primary/20">
                <h3 className="font-medium text-dark-primary mb-2">Their Goals</h3>
                <textarea
                  className="w-full p-2 rounded bg-gray-50 dark:bg-[#0E0E0E] backdrop-blur-xl border border-gray-200 dark:border-white/10 text-dark-foreground text-sm transition-all duration-300"
                  rows={3}
                  placeholder="What they likely want..."
                  value={winwinTheirGoals}
                  onChange={e => setWinwinTheirGoals(e.target.value)}
                />
              </div>
            </div>
            
            <textarea
              className="w-full p-3 rounded-xl bg-gray-50 dark:bg-[#0E0E0E] border border-gray-200 dark:border-white/10 text-dark-foreground mb-4 focus:outline-none focus:ring-2 focus:ring-dark-primary transition-all duration-300"
              rows={4}
              placeholder="Additional context about the negotiation..."
              value={winwinInput}
              onChange={e => setWinwinInput(e.target.value)}
            />
            
            <button
              className="bg-[#ffffff] text-[#1a1a1a] px-6 py-3 rounded-xl font-medium hover:bg-[#ffffff]/90 transition-all duration-300 mb-4 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
              onClick={() => callGemini(
                `Suggest win-win solutions for this negotiation. Our goals: ${winwinOurGoals || 'N/A'}. Their goals: ${winwinTheirGoals || 'N/A'}. Context: ${winwinInput || 'N/A'}. Provide 3-5 creative, mutually-beneficial options with trade-offs and implementation steps. Use Markdown lists and headings.`,
                { details: winwinInput || `${winwinOurGoals} | ${winwinTheirGoals}`, typeLabel: 'Win-Win' }
              )}
              disabled={(!winwinInput && !winwinOurGoals && !winwinTheirGoals) || loading}
              >
              {loading ? 'Generating...' : 'Suggest Win-Win Solutions'}
            </button>
            
            {aiResponse && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-[#0E0E0E] border border-[#ffffff]/20 rounded-xl text-dark-foreground animate-fadeIn">
                <h3 className="font-medium text-dark-primary mb-2">Win-Win Suggestions:</h3>
                <div className="prose prose-invert max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{aiResponse}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        );
      case 'history':
        return (
          <div className="bg-gray-50 dark:bg-[#0E0E0E] rounded-2xl p-5 sm:p-6 backdrop-blur-xl border border-gray-200 dark:border-white/10 hover:ring-dark-primary/20 shadow-lg hover:shadow-xl transition-all duration-500 group h-full flex flex-col">
            <h2 className="text-xl sm:text-2xl font-medium mb-4 text-dark-primary flex items-center">
              <span className="mr-2 text-2xl">🕑</span> Negotiation History
            </h2>
            <p className="text-dark-muted-foreground mb-6">Review past negotiations and their outcomes</p>
            
            {negotiationHistory.length > 0 ? (
              <div className="space-y-4">
                {negotiationHistory.map(item => (
                  <div key={item.id} className="bg-gray-50 dark:bg-[#0E0E0E] p-4 rounded-xl border border-gray-200 dark:border-white/10 hover:ring-dark-primary/20 transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-dark-primary">{item.details}</h3>
                        <p className="text-sm text-dark-muted-foreground mt-1">{item.date} • {item.type}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.outcome === 'Successful' ? 'bg-green-500/20 text-green-400' : 
                        item.outcome === 'Partially Successful' ? 'bg-yellow-500/20 text-yellow-400' : 
                        'bg-[#0E0E0E] text-dark-muted-foreground'
                      }`}>
                        {item.outcome}
                      </span>
                    </div>
                    <button className="mt-3 text-dark-primary/80 hover:text-dark-primary text-sm font-medium transition-all duration-300">
                      View Details →
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-[#0E0E0E] p-8 rounded-xl ring-1 ring-white/10 ring-dashed text-center">
                <p className="text-dark-muted-foreground">No negotiation history yet</p>
                <p className="text-dark-muted-foreground text-sm mt-2">Your negotiation analyses will appear here</p>
              </div>
            )}
            
            <div className="mt-6 pt-4 border-t border-white/5">
              <h3 className="font-medium text-dark-primary mb-3">Key Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 dark:bg-[#0E0E0E] p-3 rounded-xl text-center transition-all duration-300 hover:ring-dark-primary/20 border border-gray-200 dark:border-white/10">
                  <p className="text-2xl font-bold text-dark-primary">67%</p>
                  <p className="text-sm text-dark-muted-foreground">Success Rate</p>
                </div>
                <div className="bg-gray-50 dark:bg-[#0E0E0E] p-3 rounded-xl text-center transition-all duration-300 hover:ring-dark-primary/20 border border-gray-200 dark:border-white/10">
                  <p className="text-2xl font-bold text-dark-primary">2.4</p>
                  <p className="text-sm text-dark-muted-foreground">Avg. Rounds</p>
                </div>
                <div className="bg-gray-50 dark:bg-[#0E0E0E] p-3 rounded-xl text-center transition-all duration-300 hover:ring-dark-primary/20 border border-gray-200 dark:border-white/10">
                  <p className="text-2xl font-bold text-dark-primary">18%</p>
                  <p className="text-sm text-dark-muted-foreground">Avg. Improvement</p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#000000] text-dark-foreground p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 sm:mb-12 relative">
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#ffffff]/10 rounded-full blur-xl"></div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-dark-foreground relative">
                Negotiation Strategist
                <span className="block w-16 h-1 bg-[#ffffff] mt-2 rounded-full"></span>
              </h1>
              <p className="text-dark-foreground mt-3 text-base">Generate counter-proposals and negotiation strategies based on contract analysis</p>
            </div>
            <button className="px-6 py-3 bg-[#ffffff] hover:bg-[#ffffff]/90 text-[#1a1a1a] font-medium rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#ffffff]/20 w-full sm:w-auto transform hover:-translate-y-0.5">
              New Negotiation
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8" ref={tabRef}>
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center ${
                activeTab === tab.key 
                  ? 'bg-[#0E0E0E] text-dark-primary border-2 border-[#ffffff] shadow-lg shadow-[#ffffff]/20' 
                  : 'bg-[#0E0E0E] backdrop-blur-xl text-dark-muted-foreground ring-2 ring-white/10 hover:text-dark-primary hover:ring-dark-primary/20'
              } transform hover:-translate-y-0.5`}
              onClick={() => { 
                setActiveTab(tab.key); 
                setAiResponse(''); 
                setInputClause(''); 
                setPowerAnalysisResult(null);
              }}
            >
              <span className="mr-2 text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content */}
        {renderTab()}
        
        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-white/5 text-center text-dark-muted-foreground text-sm">
          <p>AI-powered by Gemini • For professional guidance only</p>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Negotiation;



