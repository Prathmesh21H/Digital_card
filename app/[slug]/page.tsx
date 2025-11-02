/* eslint-disable @typescript-eslint/no-explicit-any */
// app/[slug]/page.tsx
import { getDocs, collection, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { notFound } from 'next/navigation';
import ProfileView from '@/components/ProfileView';

interface ProfileData {
  slug: string;
  fullName: string;
  designation?: string;
  company?: string;
  bio?: string;
  profileImage?: string;
  phone?: string;
  email?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
  qrCodeUrl?: string;
}

// Serialize function to convert Firestore data to plain objects
function serializeProfile(data: any): ProfileData {
  return {
    slug: data.slug || '',
    fullName: data.fullName || '',
    designation: data.designation || undefined,
    company: data.company || undefined,
    bio: data.bio || undefined,
    profileImage: data.profileImage || undefined,
    phone: data.phone || undefined,
    email: data.email || undefined,
    website: data.website || undefined,
    linkedin: data.linkedin || undefined,
    twitter: data.twitter || undefined,
    instagram: data.instagram || undefined,
    facebook: data.facebook || undefined,
    qrCodeUrl: data.qrCodeUrl || undefined,
  };
}

async function getProfileBySlug(slug: string): Promise<{ profile: ProfileData; userId: string } | null> {
  try {
    const q = query(collection(db, 'profiles'), where('slug', '==', slug));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }

    const profileDoc = querySnapshot.docs[0];
    const rawData = profileDoc.data();
    
    // Serialize the data to remove Firestore-specific objects
    const serializedProfile = serializeProfile(rawData);
    
    return {
      profile: serializedProfile,
      userId: profileDoc.id,
    };
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}

export default async function ProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getProfileBySlug(slug);

  if (!data) {
    notFound();
  }

  return <ProfileView profile={data.profile} userId={data.userId} />;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getProfileBySlug(slug);

  if (!data) {
    return {
      title: 'Profile Not Found',
    };
  }

  return {
    title: `${data.profile.fullName} - Digital Visiting Card`,
    description: data.profile.bio || `View ${data.profile.fullName}'s digital visiting card`,
  };
}