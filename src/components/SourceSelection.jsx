import React from 'react';
import { ChevronDown, Database, Layers } from 'lucide-react';

const SourceSelection = ({
  selectedSource,
  selectedSubSource,
  onSourceChange,
  onSubSourceChange,
}) => {
  const sources = [
    { id: 'dmas', label: 'DMAS', icon: Database },
    { id: 'p8i', label: 'P8I', icon: Layers },
    { id: 'piracy', label: 'PIRACY', icon: Database },
    { id: 'ais', label: 'AIS', icon: Layers },
  ];
  
  const subSources = {
    dmas: ['CMS', 'JMS', 'LRIT', 'NAVTEX'],
    p8i: ['Radar Feed', 'IFF System', 'ELINT API', 'Mission API'],
    piracy: ['Patrol Logs', 'Incident Reports', 'Captured Images'],
    ais: ['AIS Live', 'Satellite AIS', 'Terrestrial AIS', 'Vessel Traffic Service'],
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Source Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          <Database className="w-4 h-4 inline mr-2" />
          Data Source
        </label>
        <div className="relative">
          <select
            value={selectedSource}
            onChange={(e) => onSourceChange(e.target.value)}
            className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="">Select a source...</option>
            {sources.map((source) => (
              <option key={source.id} value={source.id}>
                {source.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* SubSource Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          <Layers className="w-4 h-4 inline mr-2" />
          Sub Source
        </label>
        <div className="relative">
          <select
            value={selectedSubSource}
            onChange={(e) => onSubSourceChange(e.target.value)}
            disabled={!selectedSource}
            className={`w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              !selectedSource ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <option value="">Select a sub source...</option>
            {(subSources[selectedSource] || []).map((subSource) => (
              <option key={subSource} value={subSource}>
                {subSource}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default SourceSelection;
