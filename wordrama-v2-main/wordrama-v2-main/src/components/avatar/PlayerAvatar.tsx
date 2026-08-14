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
  avatarFrameKey?: string | null;
  size?: number;
}

export default function PlayerAvatar({
  profileImage,
  displayName,
  avatarStyleKey,
  avatarFrameKey,
  size = 40,
}: PlayerAvatarProps) {
  const avatarStyle = avatarStyleKey
    ? AVATAR_STYLES[avatarStyleKey]
    : undefined;

  const avatarFrame = avatarFrameKey
    ? AVATAR_STYLES[avatarFrameKey]
    : undefined;

  const accessory =
    avatarStyle?.placement === 'accessory'
      ? avatarStyle
      : undefined;

  const frame =
    avatarFrame?.placement === 'overlay'
      ? avatarFrame
      : undefined;

  const accessoryScale = accessory?.accessoryScale ?? 0.65;
  const accessoryTopOffset =
    accessory?.accessoryTopOffset ?? -0.3;

  return (
    <div
      className="relative inline-block"
      style={{
        width: size,
        height: size,
      }}
    >
      <Avatar
        className="absolute inset-0 z-0"
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

      {frame && (
        <Image
          src={frame.image}
          alt={`${frame.name} avatar frame`}
          fill
          sizes={`${size}px`}
          className="pointer-events-none z-10 select-none object-contain"
        />
      )}

      {accessory && (
        <div
          className="pointer-events-none absolute left-1/2 z-20 -translate-x-1/2"
          style={{
            width: size * accessoryScale,
            height: size * accessoryScale,
            top: size * accessoryTopOffset,
          }}
        >
          <Image
            src={accessory.image}
            alt={`${accessory.name} avatar accessory`}
            fill
            sizes={`${size}px`}
            className="select-none object-contain"
          />
        </div>
      )}
    </div>
  );
}
