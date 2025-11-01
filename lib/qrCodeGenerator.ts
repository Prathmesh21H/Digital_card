// lib/qrCodeGenerator.ts
import QRCode from 'qrcode';

/**
 * Generate QR code for a profile slug
 * Uses the actual domain in production, localhost in development
 */
export async function generateQRCode(slug: string): Promise<string> {
  // Get the base URL - use environment variable or window location
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                  (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
  
  const profileUrl = `${baseUrl}/${slug}`;
  
  try {
    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(profileUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
}

/**
 * Get the profile URL for a given slug
 */
export function getProfileUrl(slug: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                  (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
  return `${baseUrl}/${slug}`;
}