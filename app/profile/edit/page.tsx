'use client';

import { useEffect, useRef, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Camera, Plus, X } from 'lucide-react';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  location: string;
  hourlyRate: string;
  subjects: string[];
  education: string;
  experience: string;
  languages: string[];
  avatar: string;
}


export default function ProfileEditPage() {
  const [userType] = useState<'student' | 'tutor'>('tutor');
  const apiUrl = (process.env.NEXT_PUBLIC_WP_URL || '').replace(/\/+$/, '');

  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 avatar upload helpers
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('wpToken');
        const res = await fetch(`${apiUrl}/wp-json/custom/v1/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = await res.json();

        setProfileData({
          firstName: data.first_name || '',
          lastName: data.last_name || '',
          email: data.email || '',
          phone: data.phone || '',
          bio: data.bio || '',
          location: data.location || '',
          hourlyRate: data.hourlyRate || '',
          subjects: data.subjects || '',
          education: data.education || '',
          experience: data.experience || '',
          languages: data.languages || [''],
          avatar:
            (data.avatar ) ||
            '',
        });
        
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (apiUrl) fetchProfile();
  }, [apiUrl]);

  const [newSubject, setNewSubject] = useState('');
  const [newLanguage, setNewLanguage] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => (prev ? { ...prev, [field]: value } : null));
  };

  const addSubject = () => {
    if (profileData && newSubject.trim() && !profileData.subjects.includes(newSubject.trim())) {
      setProfileData(prev => (prev ? { ...prev, subjects: [...prev.subjects, newSubject.trim()] } : null));
      setNewSubject('');
    }
  };

  const removeSubject = (subject: string) => {
    setProfileData(prev => (prev ? { ...prev, subjects: prev.subjects.filter(s => s !== subject) } : null));
  };

  const addLanguage = () => {
    if (profileData && newLanguage.trim() && !profileData.languages.includes(newLanguage.trim())) {
      setProfileData(prev => (prev ? { ...prev, languages: [...prev.languages, newLanguage.trim()] } : null));
      setNewLanguage('');
    }
  };

  const removeLanguage = (language: string) => {
    setProfileData(prev => (prev ? { ...prev, languages: prev.languages.filter(l => l !== language) } : null));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('wpToken');
      const res = await fetch(`${apiUrl}/wp-json/custom/v1/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });
      if (!res.ok) throw new Error('Failed to update profile');
      const data = await res.json();
      toast.success(data.message || 'Profile updated');
    } catch (err) {
      toast.error('Failed to update profile');
      console.error(err);
    }
  };

  // ================== AVATAR UPLOAD (Simple Local Avatars) ==================
  const handleAvatarButton = () => fileInputRef.current?.click();

  const onPickAvatar: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // small validations
    const okTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!okTypes.includes(file.type)) {
      toast.error('Please select a JPG/PNG/GIF/WEBP image');
      e.currentTarget.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Max 5MB image allowed');
      e.currentTarget.value = '';
      return;
    }

    const token = localStorage.getItem('wpToken');
    if (!token) {
      toast.error('Not signed in');
      return;
    }
    if (!apiUrl) {
      toast.error('WP URL not configured');
      return;
    }

    try {
      setUploadingAvatar(true);

      // 1) upload to media
      const fd = new FormData();
      fd.append('file', file, file.name);

      const mediaRes = await fetch(`${apiUrl}/wp-json/wp/v2/media`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          // DO NOT set Content-Type manually for FormData
        } as any,
        body: fd,
      });

      if (!mediaRes.ok) {
        const t = await mediaRes.text().catch(() => '');
        throw new Error(`Media upload failed: ${mediaRes.status} ${t || mediaRes.statusText}`);
      }

      const media = await mediaRes.json();
      const attachmentId = media?.id;
      const sourceUrl: string | undefined = media?.source_url;

      if (!attachmentId) throw new Error('Upload ok but no attachment id returned');

      // 2) set as local avatar via REST
      const setRes = await fetch(`${apiUrl}/wp-json/wp/v2/users/me`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          simple_local_avatar: { media_id: attachmentId },
        }),
      });

      if (!setRes.ok) {
        const t = await setRes.text().catch(() => '');
        throw new Error(`Set avatar failed: ${setRes.status} ${t || setRes.statusText}`);
      }

      // 3) refetch current user to get fresh avatar_urls
      const meRes = await fetch(`${apiUrl}/wp-json/wp/v2/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!meRes.ok) {
        // fallback: preview with uploaded image URL
        if (sourceUrl) {
          setProfileData((prev) => (prev ? { ...prev, avatar: sourceUrl } : prev));
        }
        toast.success('Avatar updated');
        return;
      }

      const me = await meRes.json();
      const newAvatar: string =
        me?.avatar_urls?.['96'] || me?.avatar_urls?.['48'] || me?.avatar_urls?.['24'] || sourceUrl || '';

      setProfileData((prev) => (prev ? { ...prev, avatar: newAvatar } : prev));
      toast.success('Avatar updated');
    } catch (err: any) {
      console.error(err);
      const msg =
        /not allowed to create media/i.test(err?.message || '') ?
          'Your account does not have permission to upload media' :
          err?.message || 'Avatar upload failed';
      toast.error(msg);
    } finally {
      setUploadingAvatar(false);
      // clear input so same file can be picked again if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // ==========================================================================

  return (
    <div className="min-h-screen bg-[#f7f6f2] text-[#28251d]">
      <Header />
  
      <div className="px-6 py-16">
        <div className="max-w-[1100px] mx-auto grid lg:grid-cols-[320px_1fr] gap-10">
  
          {/* ================= LEFT PANEL ================= */}
          <div className="space-y-6">
  
            {/* PROFILE CARD */}
            <div className="bg-white border border-[#e5e2dc] rounded-2xl p-6 text-center">
              <Avatar className="h-20 w-20 mx-auto mb-4">
                <AvatarImage src={profileData?.avatar || ''} />
                <AvatarFallback>
                  {(profileData?.firstName?.[0] || '') +
                    (profileData?.lastName?.[0] || '')}
                </AvatarFallback>
              </Avatar>
  
              <h3 className="font-semibold">
                {profileData?.firstName} {profileData?.lastName}
              </h3>
  
              <p className="text-sm text-[#6b665d] mt-1">
                {profileData?.location || 'Add your location'}
              </p>
  
              {/* CHANGE PHOTO */}
              <div className="mt-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onPickAvatar}
                />
  
                <button
                  type="button"
                  onClick={handleAvatarButton}
                  className="text-sm text-[#01696f] hover:underline"
                >
                  {uploadingAvatar ? 'Uploading...' : 'Change photo'}
                </button>
              </div>
            </div>
  
            {/* PROFILE COMPLETION */}
            <div className="bg-white border border-[#e5e2dc] rounded-2xl p-6">
              <h4 className="font-medium mb-3">Profile completeness</h4>
  
              <div className="h-2 bg-[#e5e2dc] rounded-full overflow-hidden">
                <div className="h-full bg-[#01696f] w-[70%]" />
              </div>
  
              <p className="text-xs text-[#6b665d] mt-3">
                Complete your profile to increase visibility and bookings.
              </p>
            </div>
  
            {/* HELP TEXT */}
            <div className="text-sm text-[#6b665d]">
              <p>
                A complete profile builds trust. Add clear information about your
                expertise and experience.
              </p>
            </div>
          </div>
  
          {/* ================= RIGHT PANEL ================= */}
          <div className="space-y-10">
  
            {/* HEADER */}
            <div>
              <h1 className="text-4xl font-serif tracking-tight">
                Edit your profile
              </h1>
              <p className="text-[#6b665d] mt-2">
                Keep your information accurate and up to date.
              </p>
            </div>
  
            <form onSubmit={handleSubmit} className="space-y-10">
  
              {/* BASIC INFO */}
              <div className="bg-white border border-[#e5e2dc] rounded-2xl p-6 space-y-6">
                <h2 className="text-lg font-semibold">Basic information</h2>
  
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    placeholder="First name"
                    value={profileData?.firstName || ''}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="h-[44px]"
                  />
  
                  <Input
                    placeholder="Last name"
                    value={profileData?.lastName || ''}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="h-[44px]"
                  />
                </div>
  
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={profileData?.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="h-[44px]"
                  />
  
                  <Input
                    placeholder="Phone number"
                    value={profileData?.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="h-[44px]"
                  />
                </div>
  
                <Input
                  placeholder="Location"
                  value={profileData?.location || ''}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="h-[44px]"
                />
  
                <Textarea
                  rows={4}
                  placeholder="Write a short bio about yourself..."
                  value={profileData?.bio || ''}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
  
              {/* LANGUAGES */}
              {userType === 'tutor' && (
                <div className="bg-white border border-[#e5e2dc] rounded-2xl p-6 space-y-6">
                  <h2 className="text-lg font-semibold">Languages</h2>
  
                  <div className="flex flex-wrap gap-2">
                    {profileData?.languages.map((language) => (
                      <div
                        key={language}
                        className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#f3f2ee] text-sm"
                      >
                        {language}
                        <button
                          type="button"
                          onClick={() => removeLanguage(language)}
                        >
                          <X className="h-3 w-3 text-[#6b665d]" />
                        </button>
                      </div>
                    ))}
                  </div>
  
                  <div className="flex gap-2">
                    <Input
                      value={newLanguage}
                      onChange={(e) => setNewLanguage(e.target.value)}
                      placeholder="Add a language"
                      className="h-[44px]"
                    />
  
                    <Button type="button" onClick={addLanguage} variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
  
              {/* ACTIONS */}
              <div className="flex justify-between items-center pt-4 border-t border-[#e5e2dc]">
  
                <Button variant="ghost" type="button" className="text-[#6b665d]">
                  Cancel
                </Button>
  
                <Button
                  type="submit"
                  className="bg-[#01696f] hover:bg-[#0c4e54] text-white rounded-full px-6 h-[44px]"
                >
                  Save changes
                </Button>
  
              </div>
  
            </form>
          </div>
  
        </div>
      </div>
  
      <Footer />
    </div>
  );
}
