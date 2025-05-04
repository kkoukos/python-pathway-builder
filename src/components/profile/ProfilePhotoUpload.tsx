
import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Trash2 } from "lucide-react";

const ProfilePhotoUpload = () => {
  const { user } = useAuth();
  const [avatar, setAvatar] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    // Try to get the avatar when the component mounts
    async function getAvatar() {
      try {
        const { data: avatarData, error } = await supabase
          .storage
          .from('avatars')
          .download(`${user.id}`);
          
        if (error) {
          if (error.statusCode !== 404) {
            console.error("Error downloading avatar:", error);
          }
          return;
        }
        
        const url = URL.createObjectURL(avatarData);
        setAvatar(url);
      } catch (error) {
        console.error("Error getting avatar:", error);
      }
    }
    
    getAvatar();
    
    // Clean up object URLs when component unmounts
    return () => {
      if (avatar) {
        URL.revokeObjectURL(avatar);
      }
    };
  }, [user]);

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !event.target.files || event.target.files.length === 0) {
      return;
    }
    
    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    
    // Validate file type
    const validTypes = ['jpg', 'jpeg', 'png'];
    if (!validTypes.includes(fileExt?.toLowerCase() || '')) {
      toast.error("Only JPG, JPEG and PNG files are allowed");
      return;
    }
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be less than 2MB");
      return;
    }
    
    setUploading(true);
    
    try {
      // Upload to storage
      const { error: uploadError } = await supabase
        .storage
        .from('avatars')
        .upload(`${user.id}`, file, {
          upsert: true,
          contentType: file.type,
        });
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Create a local preview
      const url = URL.createObjectURL(file);
      
      // Clean up previous object URL if it exists
      if (avatar) {
        URL.revokeObjectURL(avatar);
      }
      
      setAvatar(url);
      toast.success("Profile photo updated successfully");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Failed to upload profile photo");
    } finally {
      setUploading(false);
    }
  };

  const deleteAvatar = async () => {
    if (!user) return;
    
    setDeleting(true);
    
    try {
      const { error } = await supabase
        .storage
        .from('avatars')
        .remove([`${user.id}`]);
        
      if (error) {
        throw error;
      }
      
      // Clean up object URL
      if (avatar) {
        URL.revokeObjectURL(avatar);
      }
      
      setAvatar(null);
      toast.success("Profile photo removed");
    } catch (error) {
      console.error("Error removing avatar:", error);
      toast.error("Failed to remove profile photo");
    } finally {
      setDeleting(false);
    }
  };

  // Generate initials for avatar fallback
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
    <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
      <Avatar className="h-24 w-24">
        <AvatarImage src={avatar || undefined} alt={user?.name || user?.username} />
        <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
      </Avatar>
      
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('avatar-upload')?.click()}
            disabled={uploading}
            className="flex gap-2"
          >
            <Upload className="h-4 w-4" />
            {uploading ? "Uploading..." : "Upload Photo"}
          </Button>
          
          {avatar && (
            <Button
              type="button"
              variant="outline"
              onClick={deleteAvatar}
              disabled={deleting}
              className="flex gap-2"
            >
              <Trash2 className="h-4 w-4" />
              {deleting ? "Removing..." : "Remove Photo"}
            </Button>
          )}
        </div>
        
        <p className="text-xs text-muted-foreground">
          Recommended: Square JPG, PNG. Max size 2MB.
        </p>
        
        <input
          id="avatar-upload"
          type="file"
          accept="image/png, image/jpeg"
          className="hidden"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div>
    </div>
  );
};

export default ProfilePhotoUpload;
