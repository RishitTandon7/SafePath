import React, { useState } from 'react';
import { Navigation } from './components/Navigation/Navigation';
import { MapContainer } from './components/Map/MapContainer';
import { Dashboard } from './components/Dashboard/Dashboard';
import { ReportModal } from './components/Reports/ReportModal';
import { LocationProvider } from './contexts/LocationContext';
import { SafetyProvider } from './contexts/SafetyProvider';
import { GoogleMapsHeader } from './components/Layout/GoogleMapsHeader';
import { GoogleMapsSidebar } from './components/Layout/GoogleMapsSidebar';

function App() {
  const [currentView, setCurrentView] = useState<'map' | 'dashboard'>('map');
  const [showReportModal, setShowReportModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [notification, setNotification] = useState<string>('');

  const handleCategoryClick = (category: string) => {
    if (category === 'Safe Routes') {
      // Focus on the search interface for route finding
      setNotification('Click "Get Directions" on the map to find the safest route');
    } else {
      setSelectedCategory(category);
      setNotification(`${category} feature activated`);
    }
    setTimeout(() => setNotification(''), 4000);
  };

  const handleMenuItemClick = (item: string) => {
    if (item.startsWith('set-')) {
      const place = item.replace('set-', '');
      setNotification(`Set ${place} location feature coming soon`);
    } else {
      setNotification(`${item.replace('-', ' ')} feature coming soon`);
    }
    setTimeout(() => setNotification(''), 3000);
  };

  return (
    <LocationProvider>
      <SafetyProvider>
        <div className="h-screen bg-white overflow-hidden flex flex-col">
          {/* Google Maps Style Header */}
          <GoogleMapsHeader 
            onMenuClick={() => setSidebarOpen(true)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onReportClick={() => setShowReportModal(true)}
            onCategoryClick={handleCategoryClick}
          />

          <div className="flex-1 flex relative">
            {/* Sidebar */}
            <GoogleMapsSidebar 
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              currentView={currentView}
              onViewChange={setCurrentView}
              onMenuItemClick={handleMenuItemClick}
            />

            {/* Overlay for mobile */}
            {sidebarOpen && (
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            {/* Main Content */}
            <main className="flex-1 relative">
              {currentView === 'map' ? (
                <MapContainer searchQuery={searchQuery} />
              ) : (
                <Dashboard />
              )}
            </main>
          </div>

          <ReportModal 
            isOpen={showReportModal}
            onClose={() => setShowReportModal(false)}
          />

          {/* Notification Toast */}
          {notification && (
            <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg animate-slide-in">
              {notification}
            </div>
          )}
        </div>
      </SafetyProvider>
    </LocationProvider>
  );
}

export default App;