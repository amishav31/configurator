import React, { useState } from 'react';
import { Product, CabinetGrid } from '../types';
import { ChevronDown, Mail } from 'lucide-react';
import { QuoteModal } from './QuoteModal';

interface ProductSidebarProps {
  selectedProduct: Product | undefined;
  cabinetGrid: CabinetGrid;
  onColumnsChange: (columns: number) => void;
  onRowsChange: (rows: number) => void;
  onSelectProductClick: () => void;
  onControllerChange?: (controller: string) => void;
  onModeChange?: (mode: string) => void;
}

export const ProductSidebar: React.FC<ProductSidebarProps> = ({
  selectedProduct,
  cabinetGrid,
  onColumnsChange,
  onRowsChange,
  onSelectProductClick,
  onControllerChange,
  onModeChange
}) => {
  const [activeTab, setActiveTab] = useState<'dimensions' | 'processing'>('dimensions');
  const videoProcessorOptions = [
    'NovaPro UHD Jr',
    'VX400',
    'VX600',
    'VX1000',
    'VX Pro Series'
  ];
  const sendingCardOptions = [
    'Novastar MSD300' // or your original sending card option
  ];
  const [processorType, setProcessorType] = useState<'video' | 'sending'>('video');
  const [controller, setController] = useState(videoProcessorOptions[0]);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [cloudSolution, setCloudSolution] = useState<'Synchronous' | 'Asynchronous' | null>(null);

  const handleQuoteSubmit = (message: string) => {
    // Here you would typically send the quote request to your backend
    console.log('Quote request submitted with message:', message);
    console.log('Selected product:', selectedProduct);
  };

  // Get the current configuration for the quote
  const getCurrentConfig = () => {
    return {
      cabinetGrid: {
        columns: cabinetGrid.columns,
        rows: cabinetGrid.rows,
        totalWidth: `${(cabinetGrid.totalWidth / 1000).toFixed(2)}m`,
        totalHeight: `${(cabinetGrid.totalHeight / 1000).toFixed(2)}m`,
        totalCabinets: cabinetGrid.columns * cabinetGrid.rows
      }
    }
  };
  
  // When switching processorType, reset controller to the first option of the new type
  const handleProcessorTypeChange = (type: 'video' | 'sending') => {
    setProcessorType(type);
    const newController = type === 'video' ? videoProcessorOptions[0] : sendingCardOptions[0];
    setController(newController);
    if (onControllerChange) onControllerChange(newController);
  };

  // Calculate total pixels (width * height) only if selectedProduct is defined
  const totalPixels = selectedProduct ? (selectedProduct.resolution.width * cabinetGrid.columns * selectedProduct.resolution.height * cabinetGrid.rows) : 0;
  const totalPixelsMillion = totalPixels / 1_000_000;

  // Controller selection logic based on pixel count in millions
  const controllerMapping = [
    { max: 0.65, name: 'TB2' },
    { max: 1.3, name: 'TB40' },
    { max: 2.3, name: 'TB60' },
    { max: 1.3, name: 'VX1' },
    { max: 2.6, name: 'VX400' },
    { max: 2.6, name: 'VX400 Pro' },
    { max: 3.9, name: 'VX600' },
    { max: 3.9, name: 'VX600 Pro' },
    { max: 6.5, name: 'VX1000' },
    { max: 6.5, name: 'VX1000 Pro' },
    { max: 13, name: '4K PRIME' },
  ];
  let selectedController = '4K PRIME';
  for (const mapping of controllerMapping) {
    if (totalPixelsMillion <= mapping.max) {
      selectedController = mapping.name;
      break;
    }
  }

  // Call onControllerChange with the auto-selected controller whenever it changes
  React.useEffect(() => {
    if (onControllerChange) onControllerChange(selectedController);
  }, [selectedController]);

  // Call onModeChange when cloudSolution changes
  React.useEffect(() => {
    if (onModeChange && cloudSolution) onModeChange(cloudSolution);
  }, [cloudSolution]);

  if (!selectedProduct) {
    return (
      <div className="w-80 bg-white h-screen overflow-y-auto border-r border-gray-200 p-6 flex flex-col items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Select a product to begin</p>
          <button
            onClick={onSelectProductClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Select a Product
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white  overflow-y-auto border-r border-gray-200 flex flex-col">
      {/* Product Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col items-center space-x-4 mb-4">
          <div className="w-full bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
            <img 
              src={selectedProduct.image} 
              alt={selectedProduct.name}
              className="w-full h-full object-contain p-1"
            />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">{selectedProduct.name}</h2>
            <p className="text-sm text-gray-500">
              Pixel Pitch: {selectedProduct.pixelPitch}mm
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex">
          <button 
            onClick={() => setActiveTab('dimensions')}
            className={`flex-1 py-4 px-6 text-center text-sm font-medium ${
              activeTab === 'dimensions' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Dimensions
          </button>
          <button 
            onClick={() => setActiveTab('processing')}
            className={`flex-1 py-4 px-6 text-center text-sm font-medium ${
              activeTab === 'processing' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Processor
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-2 overflow-y-auto">
        {activeTab === 'dimensions' ? (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Screen Size</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Columns
                  </label>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => onColumnsChange(Math.max(1, cabinetGrid.columns - 1))}
                      className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    >
                      -
                    </button>
                    <div className="flex-1 text-center px-4 py-2 bg-gray-50 rounded-lg">
                      {cabinetGrid.columns}
                    </div>
                    <button 
                      onClick={() => onColumnsChange(cabinetGrid.columns + 1)}
                      className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rows
                  </label>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => onRowsChange(Math.max(1, cabinetGrid.rows - 1))}
                      className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    >
                      -
                    </button>
                    <div className="flex-1 text-center px-4 py-2 bg-gray-50 rounded-lg">
                      {cabinetGrid.rows}
                    </div>
                    <button 
                      onClick={() => onRowsChange(cabinetGrid.rows + 1)}
                      className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Configuration</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Total Cabinets:</span>
                  <span className="font-medium text-gray-900">{cabinetGrid.columns * cabinetGrid.rows}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Width:</span>
                  <span className="font-medium text-gray-900">
                    {(cabinetGrid.totalWidth / 1000).toFixed(2)} m
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total Height:</span>
                  <span className="font-medium text-gray-900">
                    {(cabinetGrid.totalHeight / 1000).toFixed(2)} m
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            <div className="flex items-center space-x-2 mb-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-blue-100 text-blue-600">
                {/* Simple processor icon using SVG */}
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3" stroke="#2563eb" strokeWidth="2"/><rect x="8" y="8" width="8" height="8" rx="1.5" stroke="#2563eb" strokeWidth="2"/></svg>
              </span>
              <span className="font-semibold text-lg text-gray-900">Processing</span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                Selected Processor
              </label>
              <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 font-semibold">
                {selectedController}
              </div>
              <div className="text-xs text-gray-500 mt-1">Total Pixels: {totalPixels.toLocaleString()} ({totalPixelsMillion.toFixed(2)} million)</div>
            </div>
            {/* Mode Selector - moved below processor */}
            <div className="mt-4 mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
              <div className="flex space-x-2">
                <button
                  className={`px-4 py-2 rounded-lg border font-medium transition-all ${cloudSolution === 'Synchronous' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-100'}`}
                  onClick={() => setCloudSolution('Synchronous')}
                >
                  Synchronous
                </button>
                <button
                  className={`px-4 py-2 rounded-lg border font-medium transition-all ${cloudSolution === 'Asynchronous' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-100'}`}
                  onClick={() => setCloudSolution('Asynchronous')}
                >
                  Asynchronous
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Get a Quote Button */}
      <div className="p-4 border-t border-gray-200 ">
        <button
          onClick={() => setIsQuoteModalOpen(true)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
        >
          <Mail size={18} />
          <span>Get a Quote</span>
        </button>
      </div>

      {/* Quote Modal */}
      {selectedProduct && (
        <QuoteModal
          isOpen={isQuoteModalOpen}
          onClose={() => setIsQuoteModalOpen(false)}
          onSubmit={handleQuoteSubmit}
          selectedProduct={selectedProduct}
          config={getCurrentConfig()}
          cabinetGrid={cabinetGrid}
          processor={selectedController}
          mode={cloudSolution || ''}
        />
      )}
    </div>
  );
};