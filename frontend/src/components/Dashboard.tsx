import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Shield, TrendingUp, Zap } from 'lucide-react';
export const Dashboard = () => {
  return (
    <div className='p-8 bg-background text-foreground min-h-screen'>
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='text-4xl font-bold mb-8'>
        IP-BLUE Analytics
      </motion.h1>
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <StatCard icon={<Shield />} title='Protected Assets' value='1,284' delta='+12%' />
        <StatCard icon={<TrendingUp />} title='Royalties' value='42.5 STX' delta='+5.2%' />
        <StatCard icon={<Activity />} title='Active Licenses' value='86' delta='+24%' />
        <StatCard icon={<Zap />} title='Network Latency' value='14ms' delta='stable' />
      </div>
    </div>
  );
