// import React from 'react';
// import { ChevronDown, Database, Layers } from 'lucide-react';

// const SourceSelection = ({
//   selectedSource,
//   selectedSubSource,
//   onSourceChange,
//   onSubSourceChange,
// }) => {
//   const sources = [
//     { id: 'dmas', label: 'DMAS', icon: Database },
//     { id: 'p8i', label: 'P8I', icon: Layers },
//     { id: 'piracy', label: 'PIRACY', icon: Database },
//     { id: 'ais', label: 'AIS', icon: Layers },
//   ];

//   const subSources = {
//     dmas: ['CMS', 'JMS', 'LRIT', 'NAVTEX'],
//     p8i: ['Radar Feed', 'IFF System', 'ELINT API', 'Mission API'],
//     piracy: ['Patrol Logs', 'Incident Reports', 'Captured Images'],
//     ais: ['AIS Live', 'Satellite AIS', 'Terrestrial AIS', 'Vessel Traffic Service'],
//   };

//   return (
//     <div className="space-y-6">
//       {/* Source Selection */}
//       <div className="space-y-3">
//         <label className="block text-sm font-medium text-gray-700">
//           <Database className="w-4 h-4 inline mr-2" />
//           Data Source
//         </label>
//         <div className="relative">
//           <select
//             value={selectedSource}
//             onChange={(e) => onSourceChange(e.target.value)}
//             className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//           >
//             <option value="">Select a source...</option>
//             {sources.map((source) => (
//               <option key={source.id} value={source.id}>
//                 {source.label}
//               </option>
//             ))}
//           </select>
//           <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
//         </div>
//       </div>

//       {/* SubSource Selection */}
//       <div className="space-y-3">
//         <label className="block text-sm font-medium text-gray-700">
//           <Layers className="w-4 h-4 inline mr-2" />
//           Sub Source
//         </label>
//         <div className="relative">
//           <select
//             value={selectedSubSource}
//             onChange={(e) => onSubSourceChange(e.target.value)}
//             disabled={!selectedSource}
//             className={`w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
//               !selectedSource ? 'opacity-50 cursor-not-allowed' : ''
//             }`}
//           >
//             <option value="">Select a sub source...</option>
//             {(subSources[selectedSource] || []).map((subSource) => (
//               <option key={subSource} value={subSource}>
//                 {subSource}
//               </option>
//             ))}
//           </select>
//           <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SourceSelection;

// import React, { useEffect, useState } from 'react';
// import { ChevronDown, Database, Layers } from 'lucide-react';

// const SourceSelection = ({
//   selectedSource,
//   selectedSubSource,
//   onSourceChange,
//   onSubSourceChange,
// }) => {
//   const [sources, setSources] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // You can keep subsources hardcoded or also fetch them later
//   const subSources = {
//     dmas: ['CMS', 'JMS', 'LRIT', 'NAVTEX'],
//     p8i: ['Radar Feed', 'IFF System', 'ELINT API', 'Mission API'],
//     piracy: ['Patrol Logs', 'Incident Reports', 'Captured Images'],
//     ais: ['AIS Live', 'Satellite AIS', 'Terrestrial AIS', 'Vessel Traffic Service'],
//   };

//   useEffect(() => {
//     const fetchSources = async () => {
//       try {
//         const response = await fetch('http://127.0.0.1:8000/sources/');
//         if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//         const data = await response.json();

//         // Format to lowercase `id` for value and uppercase label for display
//         const formatted = data.map((item) => ({
//           id: item.name.toLowerCase(), // use lowercase string like "dmas"
//           label: item.name.toUpperCase(), // show as DMAS, AIS, etc.
//           icon: item.name.toLowerCase().includes('ais') ? Layers : Database,
//         }));
//         setSources(formatted);
//       } catch (error) {
//         console.error('Error fetching sources:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSources();
//   }, []);

//   return (
//     <div className="space-y-6">
//       {/* Source Selection */}
//       <div className="space-y-3">
//         <label className="block text-sm font-medium text-gray-700">
//           <Database className="w-4 h-4 inline mr-2" />
//           Data Source
//         </label>
//         <div className="relative">
//           <select
//             value={selectedSource}
//             onChange={(e) => onSourceChange(e.target.value)}
//             className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//           >
//             <option value="">{loading ? 'Loading...' : 'Select a source...'}</option>
//             {sources.map((source) => (
//               <option key={source.id} value={source.id}>
//                 {source.label}
//               </option>
//             ))}
//           </select>
//           <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
//         </div>
//       </div>

//       {/* SubSource Selection */}
//       <div className="space-y-3">
//         <label className="block text-sm font-medium text-gray-700">
//           <Layers className="w-4 h-4 inline mr-2" />
//           Sub Source
//         </label>
//         <div className="relative">
//           <select
//             value={selectedSubSource}
//             onChange={(e) => onSubSourceChange(e.target.value)}
//             disabled={!selectedSource}
//             className={`w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
//               !selectedSource ? 'opacity-50 cursor-not-allowed' : ''
//             }`}
//           >
//             <option value="">Select a sub source...</option>
//             {(subSources[selectedSource] || []).map((subSource) => (
//               <option key={subSource} value={subSource}>
//                 {subSource}
//               </option>
//             ))}
//           </select>
//           <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SourceSelection;



import React, { useEffect, useState } from 'react';
import { ChevronDown, Database, Layers } from 'lucide-react';

const SourceSelection = ({
  selectedSource,
  selectedSubSource,
  onSourceChange,
  onSubSourceChange,
}) => {
  const [sources, setSources] = useState([]);
  const [subSources, setSubSources] = useState([]);
  const [loadingSources, setLoadingSources] = useState(true);
  const [loadingSubSources, setLoadingSubSources] = useState(false);

  useEffect(() => {
    const fetchSources = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/sources/');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        const formatted = data.map((item) => ({
          id: item.id,
          label: item.name.toUpperCase(),
          icon: item.name.toLowerCase().includes('ais') ? Layers : Database,
        }));
        setSources(formatted);
      } catch (error) {
        console.error('Error fetching sources:', error);
      } finally {
        setLoadingSources(false);
      }
    };

    fetchSources();
  }, []);

  useEffect(() => {
  const fetchSubSources = async () => {
    if (!selectedSource) return;

    try {
      setLoadingSubSources(true);
      const response = await fetch(`http://localhost:8000/sub-sources/${selectedSource}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSubSources(data); // ✅ Set fetched subsources
    } catch (error) {
      console.error('Error fetching sub sources:', error);
    } finally {
      setLoadingSubSources(false);
    }
  };

  fetchSubSources();
}, [selectedSource]);


  return (
    <div className="space-y-6">
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
            <option value="">{loadingSources ? 'Loading...' : 'Select a source...'}</option>
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
            className={`w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${!selectedSource ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            <option value="">
              {loadingSubSources ? 'Loading subsources...' : 'Select a sub source...'}
            </option>
            {subSources.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
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



