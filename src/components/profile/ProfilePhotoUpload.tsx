
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { UploadCloud, Loader2, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

const ProfilePhotoUpload: React.FC = () => {
  const { user, getAvatarUrl } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    
    const fetchAvatar = async () => {
      const url = await getAvatarUrl();
      setAvatarUrl(url);
    };
    
    fetchAvatar();
  }, [user, getAvatarUrl]);

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user!.id}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      // Get the new URL
      const newUrl = await getAvatarUrl();
      setAvatarUrl(newUrl);
      
      toast.success('Avatar updated successfully!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error uploading avatar';
      toast.error(message);
      console.error('Error uploading avatar:', error);
    } finally {
      setUploading(false);
    }
  };

  const removeAvatar = async () => {
    try {
      setUploading(true);
      
      if (!user) return;
      
      // Get file name from URL or use user ID
      let fileName = user.id;
      if (avatarUrl) {
        const urlParts = avatarUrl.split('/');
        fileName = urlParts[urlParts.length - 1];
        
        // Handle signed URLs by removing query parameters
        if (fileName.includes('?')) {
          fileName = fileName.split('?')[0];
        }
      }
      
      const { error } = await supabase.storage
        .from('avatars')
        .remove([fileName]);
      
      if (error) {
        throw error;
      }
      
      setAvatarUrl(null);
      toast.success('Avatar removed successfully!');
    } catch (error: any) {
      toast.error(`Error removing avatar: ${error.message || 'Unknown error'}`);
      console.error('Error removing avatar:', error);
    } finally {
      setUploading(false);
    }
  };

  // Get initials for the avatar fallback
  const getInitials = () => {
    if (!user) return "";
    
    if (user.name) {
      return user.name.split(" ")
        .map(name => name[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    }
    
    return user.username.substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <Avatar className="h-28 w-28">
        <AvatarImage src={avatarUrl || undefined} alt="Profile picture" />
        <AvatarFallback className="text-xl">{getInitials()}</AvatarFallback>
      </Avatar>

      <div className="flex flex-col gap-4">
        <div>
          <Label htmlFor="avatar" className="cursor-pointer">
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" disabled={uploading}>
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
                  </>
                ) : (
                  <>
                    <UploadCloud className="mr-2 h-4 w-4" /> Upload Photo
                  </>
                )}
              </Button>
            </div>
            <input
              id="avatar"
              type="file"
              accept="image/*"
              onChange={uploadAvatar}
              disabled={uploading}
              className="sr-only"
            />
          </Label>
        </div>

        {avatarUrl && (
          <Button type="button" variant="outline" onClick={removeAvatar} disabled={uploading}>
            <Trash2 className="mr-2 h-4 w-4" /> Remove Photo
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProfilePhotoUpload;
