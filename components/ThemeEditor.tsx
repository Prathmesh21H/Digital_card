import { useState, useEffect } from 'react';
import { Upload, X, Palette, Pipette } from 'lucide-react';

interface ThemeEditorProps {
  currentLogo?: string;
  currentPrimaryColor?: string;
  currentSecondaryColor?: string;
  onSave: (logoUrl: string, primaryColor: string, secondaryColor: string) => Promise<void>;
}

const colorOptions = [
  { name: 'Orange', value: 'orange', hex: '#f97316' },
  { name: 'Blue', value: 'blue', hex: '#2563eb' },
  { name: 'Purple', value: 'purple', hex: '#9333ea' },
  { name: 'Red', value: 'red', hex: '#dc2626' },
  { name: 'Green', value: 'green', hex: '#16a34a' },
  { name: 'Teal', value: 'teal', hex: '#0d9488' },
  { name: 'Pink', value: 'pink', hex: '#ec4899' },
  { name: 'Indigo', value: 'indigo', hex: '#4f46e5' },
  { name: 'Cyan', value: 'cyan', hex: '#06b6d4' },
  { name: 'Amber', value: 'amber', hex: '#f59e0b' },
  { name: 'Lime', value: 'lime', hex: '#84cc16' },
  { name: 'Emerald', value: 'emerald', hex: '#10b981' },
  { name: 'Sky', value: 'sky', hex: '#0ea5e9' },
  { name: 'Violet', value: 'violet', hex: '#8b5cf6' },
  { name: 'Fuchsia', value: 'fuchsia', hex: '#d946ef' },
  { name: 'Rose', value: 'rose', hex: '#f43f5e' },
];

export default function ThemeEditor({ 
  currentLogo, 
  currentPrimaryColor = 'orange', 
  currentSecondaryColor = 'green', 
  onSave 
}: ThemeEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [logoUrl, setLogoUrl] = useState(currentLogo || '');
  const [primaryColor, setPrimaryColor] = useState(currentPrimaryColor);
  const [secondaryColor, setSecondaryColor] = useState(currentSecondaryColor);
  const [customPrimaryHex, setCustomPrimaryHex] = useState('');
  const [customSecondaryHex, setCustomSecondaryHex] = useState('');
  const [showPrimaryPicker, setShowPrimaryPicker] = useState(false);
  const [showSecondaryPicker, setShowSecondaryPicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [logoPreview, setLogoPreview] = useState(currentLogo || '');
  const [error, setError] = useState('');

  // Sync with props when they change
  useEffect(() => {
    setLogoUrl(currentLogo || '');
    setLogoPreview(currentLogo || '');
    setPrimaryColor(currentPrimaryColor);
    setSecondaryColor(currentSecondaryColor);
  }, [currentLogo, currentPrimaryColor, currentSecondaryColor]);

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dmhr3fumd';
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'my_unsigned_preset';
    
    formData.append('upload_preset', uploadPreset);

    console.log('Uploading to Cloudinary:', cloudName, uploadPreset);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!res.ok) {
      const errorData = await res.text();
      console.error('Cloudinary upload failed:', errorData);
      throw new Error('Failed to upload image to Cloudinary: ' + errorData);
    }

    const data = await res.json();
    console.log('Cloudinary upload success:', data.secure_url);
    return data.secure_url;
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Logo file size must be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    setError('');
    setIsUploading(true);

    try {
      const uploadedUrl = await uploadToCloudinary(file);
      setLogoUrl(uploadedUrl);
      setLogoPreview(uploadedUrl);
    } catch (err) {
      console.error('Error uploading logo:', err);
      setError('Failed to upload logo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCustomPrimaryColor = (hex: string) => {
    setCustomPrimaryHex(hex);
    setPrimaryColor(hex);
  };

  const handleCustomSecondaryColor = (hex: string) => {
    setCustomSecondaryHex(hex);
    setSecondaryColor(hex);
  };

  const isValidHex = (hex: string) => {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
  };

  const handleSave = async () => {
    if (isUploading) {
      setError('Please wait for logo upload to complete');
      return;
    }

    setIsSaving(true);
    setError('');
    
    try {
      await onSave(logoUrl, primaryColor, secondaryColor);
      setIsEditing(false);
      setShowPrimaryPicker(false);
      setShowSecondaryPicker(false);
    } catch (error) {
      console.error('Error saving theme:', error);
      setError('Failed to save theme. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setLogoUrl(currentLogo || '');
    setLogoPreview(currentLogo || '');
    setPrimaryColor(currentPrimaryColor);
    setSecondaryColor(currentSecondaryColor);
    setCustomPrimaryHex('');
    setCustomSecondaryHex('');
    setShowPrimaryPicker(false);
    setShowSecondaryPicker(false);
    setError('');
    setIsEditing(false);
  };

  const getColorPreview = (color: string) => {
    const preset = colorOptions.find(c => c.value === color);
    if (preset) return preset.hex;
    if (isValidHex(color)) return color;
    return '#f97316'; // Default orange
  };

  if (!isEditing) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Palette className="w-5 h-5 text-purple-600" />
              Brand Theme
            </h3>
            <p className="text-sm text-gray-600 mt-1">Customize your profile&apos;s look</p>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-purple-600 hover:text-purple-700 font-medium"
          >
            Edit Theme
          </button>
        </div>

        <div className="space-y-4">
          {logoPreview && (
            <div>
              <p className="text-sm text-gray-600 mb-2">Current Logo</p>
              <div className="w-32 h-20 bg-gray-50 border-2 border-gray-200 rounded-lg flex items-center justify-center p-2">
                <img src={logoPreview} alt="Logo" className="max-w-full max-h-full object-contain" />
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Primary Color</p>
              <div className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded-lg border-2 border-gray-300"
                  style={{ backgroundColor: getColorPreview(primaryColor) }}
                ></div>
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {colorOptions.find(c => c.value === primaryColor)?.name || 'Custom'}
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Secondary Color</p>
              <div className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded-lg border-2 border-gray-300"
                  style={{ backgroundColor: getColorPreview(secondaryColor) }}
                ></div>
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {colorOptions.find(c => c.value === secondaryColor)?.name || 'Custom'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-100">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Palette className="w-5 h-5 text-purple-600" />
            Customize Theme
          </h3>
          <p className="text-sm text-gray-600 mt-1">Upload logo and choose colors</p>
        </div>
        <button
          onClick={handleCancel}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Logo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Logo (Max 5MB)
          </label>
          <div className="flex items-start gap-4">
            {logoPreview && (
              <div className="w-32 h-20 bg-gray-50 border-2 border-gray-300 rounded-lg flex items-center justify-center p-2">
                <img src={logoPreview} alt="Logo preview" className="max-w-full max-h-full object-contain" />
              </div>
            )}
            <label className="flex-1 flex flex-col items-center justify-center px-4 py-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition">
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-2"></div>
                  <span className="text-sm text-gray-600">Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Click to upload logo</span>
                  <span className="text-xs text-gray-500 mt-1">PNG, SVG or JPG</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                disabled={isUploading}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Primary Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Primary Color
          </label>
          <div className="grid grid-cols-4 gap-3 mb-3">
            {colorOptions.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => {
                  setPrimaryColor(color.value);
                  setCustomPrimaryHex('');
                  setShowPrimaryPicker(false);
                }}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition ${
                  primaryColor === color.value
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: color.hex }}></div>
                <span className="text-xs font-medium text-gray-700">{color.name}</span>
              </button>
            ))}
          </div>
          
          {/* Custom Primary Color Picker */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <button
              type="button"
              onClick={() => setShowPrimaryPicker(!showPrimaryPicker)}
              className="flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-700 mb-3"
            >
              <Pipette className="w-4 h-4" />
              {showPrimaryPicker ? 'Hide' : 'Use'} Custom Color
            </button>
            
            {showPrimaryPicker && (
              <div className="space-y-3">
                <div className="flex gap-3">
                  <input
                    type="color"
                    value={getColorPreview(primaryColor)}
                    onChange={(e) => handleCustomPrimaryColor(e.target.value)}
                    className="w-16 h-10 rounded border-2 border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    placeholder="#000000"
                    value={customPrimaryHex || (isValidHex(primaryColor) ? primaryColor : '')}
                    onChange={(e) => {
                      const hex = e.target.value;
                      setCustomPrimaryHex(hex);
                      if (isValidHex(hex)) {
                        setPrimaryColor(hex);
                      }
                    }}
                    className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm font-mono"
                  />
                </div>
                <p className="text-xs text-gray-500">Enter a hex color code (e.g., #FF5733)</p>
              </div>
            )}
          </div>
        </div>

        {/* Secondary Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Secondary Color
          </label>
          <div className="grid grid-cols-4 gap-3 mb-3">
            {colorOptions.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => {
                  setSecondaryColor(color.value);
                  setCustomSecondaryHex('');
                  setShowSecondaryPicker(false);
                }}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition ${
                  secondaryColor === color.value
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: color.hex }}></div>
                <span className="text-xs font-medium text-gray-700">{color.name}</span>
              </button>
            ))}
          </div>
          
          {/* Custom Secondary Color Picker */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <button
              type="button"
              onClick={() => setShowSecondaryPicker(!showSecondaryPicker)}
              className="flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-700 mb-3"
            >
              <Pipette className="w-4 h-4" />
              {showSecondaryPicker ? 'Hide' : 'Use'} Custom Color
            </button>
            
            {showSecondaryPicker && (
              <div className="space-y-3">
                <div className="flex gap-3">
                  <input
                    type="color"
                    value={getColorPreview(secondaryColor)}
                    onChange={(e) => handleCustomSecondaryColor(e.target.value)}
                    className="w-16 h-10 rounded border-2 border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    placeholder="#000000"
                    value={customSecondaryHex || (isValidHex(secondaryColor) ? secondaryColor : '')}
                    onChange={(e) => {
                      const hex = e.target.value;
                      setCustomSecondaryHex(hex);
                      if (isValidHex(hex)) {
                        setSecondaryColor(hex);
                      }
                    }}
                    className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm font-mono"
                  />
                </div>
                <p className="text-xs text-gray-500">Enter a hex color code (e.g., #10B981)</p>
              </div>
            )}
          </div>
        </div>

        {/* Preview */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-3">Preview</p>
          <div className="flex items-center gap-3">
            <div 
              className="px-4 py-2 rounded-lg text-white text-sm font-medium"
              style={{ backgroundColor: getColorPreview(primaryColor) }}
            >
              Primary
            </div>
            <div 
              className="px-4 py-2 rounded-lg text-white text-sm font-medium"
              style={{ backgroundColor: getColorPreview(secondaryColor) }}
            >
              Secondary
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || isUploading}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : isUploading ? 'Uploading...' : 'Save Theme'}
          </button>
        </div>
      </div>
    </div>
  );
}