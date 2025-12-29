import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Shield, TrendingUp, Zap } from 'lucide-react';
export const Dashboard = () => {
  return (
    <div className='p-8 bg-background text-foreground min-h-screen'>
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='text-4xl font-bold mb-8'>
        IP-BLUE Analytics
