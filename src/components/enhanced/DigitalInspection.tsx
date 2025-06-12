import React, { useState, useRef } from 'react';
import { Camera, X, Check, AlertTriangle, ArrowRight, Save } from 'lucide-react';
import { submitInspection, uploadInspectionImage } from '../../api/workOrders';

interface InspectionItem {
  id: string;
  name: string;
  status: 'good' | 'fair' | 'poor' | 'not_inspected';
  notes: string;
  images: string[];
}

interface DigitalInspectionProps {
  workOrderId: number;
  vehicleInfo: {
    make: string;
    model: string;
    year: number;
    licensePlate: string;
  };
  onInspectionComplete: (inspectionData: unknown) => void;
}

const initialInspectionItems: InspectionItem[] = [
  { id: 'brakes_front', name: 'Front Brakes', status: 'not_inspected', notes: '', images: [] },
  { id: 'brakes_rear', name: 'Rear Brakes', status: 'not_inspected', notes: '', images: [] },
  { id: 'tires_front', name: 'Front Tires', status: 'not_inspected', notes: '', images: [] },
  { id: 'tires_rear', name: 'Rear Tires', status: 'not_inspected', notes: '', images: [] },
  { id: 'suspension', name: 'Suspension System', status: 'not_inspected', notes: '', images: [] },
  { id: 'steering', name: 'Steering System', status: 'not_inspected', notes: '', images: [] },
  { id: 'fluid_levels', name: 'Fluid Levels', status: 'not_inspected', notes: '', images: [] },
  { id: 'battery', name: 'Battery', status: 'not_inspected', notes: '', images: [] },
  { id: 'filters', name: 'Air & Cabin Filters', status: 'not_inspected', notes: '', images: [] },
  { id: 'belts_hoses', name: 'Belts & Hoses', status: 'not_inspected', notes: '', images: [] },
  { id: 'lights', name: 'Exterior Lights', status: 'not_inspected', notes: '', images: [] },
  { id: 'wipers', name: 'Wiper Blades', status: 'not_inspected', notes: '', images: [] },
];

const DigitalInspection: React.FC<DigitalInspectionProps> = ({ 
  workOrderId, 
  vehicleInfo, 
  onInspectionComplete 
}) => {
  const [inspectionItems, setInspectionItems] = useState<InspectionItem[]>(initialInspectionItems);
  const [currentItemIndex, setCurrentItemIndex] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentItem = inspectionItems[currentItemIndex];
  
  const handleStatusChange = (status: 'good' | 'fair' | 'poor') => {
    const updatedItems = [...inspectionItems];
    updatedItems[currentItemIndex] = {
      ...currentItem,
      status
    };
    setInspectionItems(updatedItems);
  };
  
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updatedItems = [...inspectionItems];
    updatedItems[currentItemIndex] = {
      ...currentItem,
      notes: e.target.value
    };
    setInspectionItems(updatedItems);
  };
  
  const handleCaptureClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      try {
        // Here you would normally upload the image to the server
        // and get back the URL of the uploaded image
        // Mock implementation:
        const file = e.target.files[0];
        const imageUrl = await uploadInspectionImage(workOrderId, currentItem.id, file);
        
        const updatedItems = [...inspectionItems];
        updatedItems[currentItemIndex] = {
          ...currentItem,
          images: [...currentItem.images, imageUrl]
        };
        setInspectionItems(updatedItems);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };
  
  const removeImage = (index: number) => {
    const updatedItems = [...inspectionItems];
    const updatedImages = [...currentItem.images];
    updatedImages.splice(index, 1);
    
    updatedItems[currentItemIndex] = {
      ...currentItem,
      images: updatedImages
    };
    setInspectionItems(updatedItems);
  };
  
  const goToNextItem = () => {
    if (currentItemIndex < inspectionItems.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1);
    }
  };
  
  const goToPrevItem = () => {
    if (currentItemIndex > 0) {
      setCurrentItemIndex(currentItemIndex - 1);
    }
  };
  
  const getProgressPercentage = () => {
    const completedItems = inspectionItems.filter(item => item.status !== 'not_inspected').length;
    return Math.round((completedItems / inspectionItems.length) * 100);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'fair':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'poor':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <Check className="w-4 h-4" />;
      case 'fair':
        return <AlertTriangle className="w-4 h-4" />;
      case 'poor':
        return <X className="w-4 h-4" />;
      default:
        return null;
    }
  };
  
  const handleSubmitInspection = async () => {
    setIsSubmitting(true);
    try {
      // Convert the inspection items to the format expected by the API
      const inspectionData = {
        workOrderId,
        inspectionDate: new Date().toISOString(),
        items: inspectionItems.map(item => ({
          itemId: item.id,
          name: item.name,
          status: item.status,
          notes: item.notes,
          images: item.images
        }))
      };
      
      // Submit the inspection data to the API
      await submitInspection(inspectionData);
      onInspectionComplete(inspectionData);
    } catch (error) {
      console.error('Error submitting inspection:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const canSubmit = inspectionItems.every(item => item.status !== 'not_inspected');

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-[#E3D5CA]">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-[#3D2C2E]">Digital Vehicle Inspection</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-[#6B5B47]">
              Vehicle: {vehicleInfo.make} {vehicleInfo.model} ({vehicleInfo.year})
            </span>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
          <span className="ml-2 text-sm font-medium text-gray-700">{getProgressPercentage()}%</span>
        </div>
        
        <div className="flex mb-4 overflow-x-auto pb-2">
          {inspectionItems.map((item, index) => (
            <button
              key={item.id}
              className={`px-3 py-1.5 rounded-lg mr-2 text-xs font-medium whitespace-nowrap flex items-center ${
                index === currentItemIndex
                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                  : item.status !== 'not_inspected'
                  ? getStatusColor(item.status)
                  : 'bg-gray-100 text-gray-800 border border-gray-200'
              }`}
              onClick={() => setCurrentItemIndex(index)}
            >
              {item.status !== 'not_inspected' && (
                <span className="mr-1">{getStatusIcon(item.status)}</span>
              )}
              {item.name}
            </button>
          ))}
        </div>
        
        <div className="border rounded-lg p-4 mb-4">
          <h3 className="text-lg font-medium mb-4">{currentItem.name}</h3>
          
          <div className="mb-4">
            <div className="font-medium text-sm text-gray-700 mb-2">Condition:</div>
            <div className="flex space-x-2">
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${
                  currentItem.status === 'good'
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => handleStatusChange('good')}
              >
                <Check className="w-4 h-4 mr-1" />
                Good
              </button>
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${
                  currentItem.status === 'fair'
                    ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => handleStatusChange('fair')}
              >
                <AlertTriangle className="w-4 h-4 mr-1" />
                Fair
              </button>
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${
                  currentItem.status === 'poor'
                    ? 'bg-red-100 text-red-800 border border-red-200'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => handleStatusChange('poor')}
              >
                <X className="w-4 h-4 mr-1" />
                Poor
              </button>
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="notes" className="block font-medium text-sm text-gray-700 mb-2">
              Notes:
            </label>
            <textarea
              id="notes"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add detailed notes about the condition..."
              value={currentItem.notes}
              onChange={handleNotesChange}
            ></textarea>
          </div>
          
          <div>
            <div className="font-medium text-sm text-gray-700 mb-2">Images:</div>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {currentItem.images.map((image, index) => (
                <div key={index} className="relative h-24 bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                    src={image} 
                    alt={`${currentItem.name} inspection ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                  <button
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    onClick={() => removeImage(index)}
                    title="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              <button
                className="h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:text-gray-700 hover:border-gray-400"
                onClick={handleCaptureClick}
              >
                <Camera className="w-8 h-8 mb-1" />
                <span className="text-xs">Add Photo</span>
              </button>
              
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
                title="Upload inspection image"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-between mt-6">
          <button
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={goToPrevItem}
            disabled={currentItemIndex === 0}
          >
            Previous
          </button>
          
          {currentItemIndex < inspectionItems.length - 1 ? (
            <button
              className="px-4 py-2 bg-blue-600 rounded-md text-white font-medium hover:bg-blue-700 flex items-center"
              onClick={goToNextItem}
            >
              Next <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          ) : (
            <button
              className="px-4 py-2 bg-green-600 rounded-md text-white font-medium hover:bg-green-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSubmitInspection}
              disabled={!canSubmit || isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                <span className="flex items-center">
                  <Save className="w-4 h-4 mr-1" />
                  Complete Inspection
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DigitalInspection;