
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { Settings } from "lucide-react";

interface ProfileHeaderProps {
  username?: string;
  level?: number;
  streak?: number;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  username, 
  level, 
  streak 
}) => {
  const { user, getAvatarUrl } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    
    // Try to get the avatar URL
    const fetchAvatarUrl = async () => {
      const url = await getAvatarUrl();
      setAvatarUrl(url);
    };
    
    fetchAvatarUrl();
  }, [user, getAvatarUrl]);

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

  // Use provided username or fall back to user data
  const displayName = username || (user?.name || user?.username || "User");

  if (!user) return null;

  return (
    <div className="flex items-center justify-between pb-6 pt-2">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={avatarUrl || undefined} alt={displayName} />
          <AvatarFallback>{getInitials()}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{displayName}</h1>
          <p className="text-muted-foreground">{user.email}</p>
          {(level !== undefined && streak !== undefined) && (
            <p className="text-sm text-muted-foreground">
              Level {level} • {streak} day streak
            </p>
          )}
        </div>
      </div>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => navigate('/settings')}
        className="flex items-center gap-2"
      >
        <Settings className="h-4 w-4" />
        <span>Settings</span>
      </Button>
    </div>
  );
};

export default ProfileHeader;
