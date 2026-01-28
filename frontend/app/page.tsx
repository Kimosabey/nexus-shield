'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Textarea,
  Chip,
  ScrollShadow,
  Progress,
  Badge
} from "@heroui/react";
import { Shield, AlertTriangle, Lock, Terminal, Activity, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Types for Logging
interface SecurityLog {
  id: number;
  type: 'INFO' | 'CHECK' | 'SECURE' | 'BLOCK' | 'PII';
  message: string;
  time: string;
  details?: string;
}

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [logs, setLogs] = useState<SecurityLog[]>([
    { id: 1, type: 'INFO', message: 'Nexus Shield Initialized v2.0', time: new Date().toLocaleTimeString() },
    { id: 2, type: 'INFO', message: 'Connected to Dedicated Inference Node (10.10.20.225)', time: new Date().toLocaleTimeString() },
  ]);
  const [isScanning, setIsScanning] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) return;

    const currentPrompt = prompt;
    setPrompt('');
    setIsScanning(true);

    // 1. Initial Scan Log
    addLog('CHECK', `Intercepting Prompt: "${currentPrompt.substring(0, 40)}..."`);

    try {
      const startTime = performance.now();
      const res = await fetch('http://localhost:3002/chat', { // Port 3002
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: currentPrompt }),
      });
      const endTime = performance.now();
      const latency = Math.round(endTime - startTime);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Security Enforcement Triggered');
      }

      const data = await res.json();

      // Success Logic
      addLog('SECURE', `Validation Passed (${latency}ms)`);
      addLog('INFO', `LLM Response: ${data.response}`);

    } catch (error: any) {
      // Failure/Block Logic
      addLog('BLOCK', `THREAT BLOCKED: ${error.message}`);
    } finally {
      setIsScanning(false);
    }
  };

  const addLog = (type: SecurityLog['type'], message: string) => {
    setLogs(prev => [...prev, {
      id: Date.now(),
      type,
      message,
      time: new Date().toLocaleTimeString()
    }]);
  };

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'SECURE': return 'success';
      case 'BLOCK': return 'danger';
      case 'CHECK': return 'warning';
      default: return 'primary';
    }
  };

  return (
    <main className="min-h-screen bg-[url('/grid-bg.png')] bg-cover bg-fixed text-white p-6 lg:p-12 relative overflow-hidden">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-[#020617]/90 z-0 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Header */}
        <div className="lg:col-span-12 flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              <Shield className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">
                NEXUS SHIELD
              </h1>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                SYSTEM: ONLINE
                <span className="text-slate-600">|</span>
                VER: AG-06
              </div>
            </div>
          </div>

          <Chip
            variant="flat"
            color="danger"
            startContent={<AlertTriangle size={14} />}
            className="hidden md:flex"
          >
            Active Protection
          </Chip>
        </div>

        {/* Left Column: Input Sandbox */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-md shadow-2xl h-full">
            <CardHeader className="flex gap-3 px-6 pt-6 pb-2">
              <Terminal className="text-blue-400" />
              <div className="flex flex-col">
                <p className="text-md font-bold text-slate-200">Security Sandbox</p>
                <p className="text-tiny text-slate-400">Test constraints, PII checks, and injections.</p>
              </div>
            </CardHeader>
            <CardBody className="px-6 py-4">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 h-full">
                <Textarea
                  placeholder="Enter a prompt to test the Shield..."
                  minRows={8}
                  maxRows={12}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  classNames={{
                    input: "font-mono text-slate-300 text-lg",
                    inputWrapper: "bg-slate-950/60 border-slate-700 hover:border-slate-600 focus-within:border-cyan-500/50 transition-colors"
                  }}
                />
              </form>
            </CardBody>
            <CardFooter className="px-6 pb-6 pt-2 flex justify-between items-center">
              <div className="flex gap-4 text-xs text-slate-500 font-mono">
                <span className="flex items-center gap-1"><Lock size={12} /> PII Scrubber</span>
                <span className="flex items-center gap-1"><Zap size={12} /> Fail-Fast</span>
              </div>
              <Button
                color="primary"
                variant="shadow"
                isLoading={isScanning}
                onPress={handleSubmit as any}
                className="bg-gradient-to-r from-blue-600 to-cyan-500 font-bold"
              >
                {isScanning ? 'SCANNING THREATS...' : 'VALIDATE & SEND'}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Right Column: Telemetry & Metrics */}
        <div className="lg:col-span-5 flex flex-col gap-6">

          {/* Status Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-slate-900/40 border-slate-800">
              <CardBody className="flex flex-row items-center gap-4 py-4">
                <div className="p-2 bg-green-500/10 rounded-lg"><Activity size={20} className="text-green-400" /></div>
                <div>
                  <p className="text-xs text-slate-400">Latency</p>
                  <p className="text-lg font-bold text-slate-200">~85ms</p>
                </div>
              </CardBody>
            </Card>
            <Card className="bg-slate-900/40 border-slate-800">
              <CardBody className="flex flex-row items-center gap-4 py-4">
                <div className="p-2 bg-purple-500/10 rounded-lg"><Zap size={20} className="text-purple-400" /></div>
                <div>
                  <p className="text-xs text-slate-400">Logic Zone</p>
                  <p className="text-lg font-bold text-slate-200">CPU</p>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Live Feed */}
          <Card className="bg-slate-950 border-slate-800 flex-grow min-h-[400px]">
            <CardHeader className="border-b border-slate-800/50 bg-slate-900/30">
              <h3 className="font-mono text-sm font-bold text-slate-300 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                LIVE TELEMETRY
              </h3>
            </CardHeader>
            <CardBody className="p-0 overflow-hidden">
              <ScrollShadow className="h-[400px] p-4 font-mono text-xs space-y-3">
                <AnimatePresence initial={false}>
                  {logs.map((log) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`
                          p-3 border-l-2 rounded-r-md bg-slate-900/40
                          ${log.type === 'BLOCK' ? 'border-red-500 bg-red-950/10' : ''}
                          ${log.type === 'SECURE' ? 'border-green-500 bg-green-950/10' : ''}
                          ${log.type === 'CHECK' ? 'border-yellow-500' : ''}
                          ${log.type === 'INFO' ? 'border-blue-500' : ''}
                        `}
                    >
                      <div className="flex justify-between items-center mb-1 text-[10px] text-slate-500">
                        <span>{log.time}</span>
                        <span className={`font-bold ${log.type === 'BLOCK' ? 'text-red-400' :
                            log.type === 'SECURE' ? 'text-green-400' : 'text-slate-400'
                          }`}>[{log.type}]</span>
                      </div>
                      <p className="text-slate-300 break-words">{log.message}</p>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={logEndRef} />
              </ScrollShadow>
            </CardBody>
          </Card>

        </div>
      </div>
    </main>
  );
}
