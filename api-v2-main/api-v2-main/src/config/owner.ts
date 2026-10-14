const OWNER_PLAYER_ID =
  process.env.WORDRAMA_OWNER_PLAYER_ID;

export function isWordramaOwner(playerId: string): boolean {
  return Boolean(
    OWNER_PLAYER_ID &&
    playerId === OWNER_PLAYER_ID
  );
}
