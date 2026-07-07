import type {
  CreateOverlayTokenInput,
  GetOverlayStateInput,
  LiveOverlayState,
  LiveOverlayToken,
  OverlayTokenValidationResult,
  RevokeOverlayTokenInput,
  ValidateOverlayTokenInput,
} from './types.js';

export interface OverlayService {
  createOverlayToken(input: CreateOverlayTokenInput): Promise<LiveOverlayToken>;
  revokeOverlayToken(input: RevokeOverlayTokenInput): Promise<LiveOverlayToken>;
  validateOverlayToken(input: ValidateOverlayTokenInput): Promise<OverlayTokenValidationResult>;
  getOverlayState(input: GetOverlayStateInput): Promise<LiveOverlayState>;
}
