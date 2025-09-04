import React from 'react';
import Header from '@/components/dashboard/Header';
import Sidebar from '@/components/dashboard/Sidebar';
import MainContent from '@/components/dashboard/MainContent';
import ChatWidget from '@/components/dashboard/ChatWidget';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />
      
      {/* Main Layout */}
      <div className="flex overflow-x-hidden">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <MainContent />
      </div>
      
      {/* Chat Widget - Manny */}
      <ChatWidget />
    </div>
  );
};

export default Dashboard;