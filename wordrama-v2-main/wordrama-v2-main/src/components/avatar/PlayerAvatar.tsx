import Image from 'next/image';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
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

  const isAccessory = avatarStyle?.placement === 'accessory';

  const accessoryScale = avatarStyle?.accessoryScale ?? 0.65;
  const accessoryTopOffset = avatarStyle?.accessoryTopOffset ?? -0.3;

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

      {avatarStyle && !isAccessory && (
        <Image
          src={profileImage}
          alt={displayName}
          fill
          priority
          sizes={`${size}px`}
          className="object-cover"
        />
      )}

      {avatarStyle && isAccessory && (
        <div
          className="pointer-events-none absolute left-1/2 z-20 -translate-x-1/2"
          style={{
            width: size * accessoryScale,
            height: size * accessoryScale,
            top: size * accessoryTopOffset,
          }}
        >
          <Image
            src={avatarStyle.image}
            alt={`${avatarStyle.name} avatar accessory`}
            fill
            sizes={`${size}px`}
            className="select-none object-contain"
          />
        </div>
      )}
    </div>
  );
}
