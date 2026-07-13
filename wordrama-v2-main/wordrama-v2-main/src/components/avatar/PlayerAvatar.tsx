import Image from 'next/image';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AVATAR_STYLES } from '@/config/avatarStyles';

interface PlayerAvatarProps {
  profileImage?: string | null;
  displayName?: string;
  avatarStyleKey?: string | null;
  size?: number;
}

export default function PlayerAvatar({
  profileImage,
  displayName,
  avatarStyleKey,
  size = 40,
}: PlayerAvatarProps) {
  const avatarStyle = avatarStyleKey
    ? AVATAR_STYLES[avatarStyleKey]
    : undefined;

  return (
    <div
      className="relative inline-block"
      style={{
        width: size,
        height: size,
      }}
    >
      <Avatar
        className="absolute inset-0"
        style={{
          width: size,
          height: size,
        }}
      >
        <AvatarImage src={profileImage ?? undefined} />

        <AvatarFallback>
          {displayName || 'Player'}
        </AvatarFallback>
      </Avatar>

      {avatarStyle && (
        <Image
          src={avatarStyle.image}
          alt={`${avatarStyle.name} avatar style`}
          fill
          className="pointer-events-none select-none"
        />
      )}
    </div>
  );
}
