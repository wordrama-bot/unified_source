import {
  ENABLE_CONFETTI_DESCRIPTION,
  ENABLE_SPEED_RUN_MODE,
  HARD_MODE_DESCRIPTION,
  HIGH_CONTRAST_MODE_DESCRIPTION,
  SWAP_ENTER_AND_DELETE_DESCRIPTION,
} from '../../constants/strings'
import { BaseModal } from './BaseModal'
import { SettingsToggle } from './SettingsToggle'

type Props = {
  isOpen: boolean
  handleClose: () => void
  isHardMode: boolean
  handleHardMode: Function
  isDarkMode: boolean
  handleDarkMode: Function
  isHighContrastMode: boolean
  handleHighContrastMode: Function
  swapEnterAndDelete: boolean
  handleSwapEnterAndDelete: Function
  isConfettiEnabled: boolean
  handleConfettiEnabled: Function
  isSpeedRunMode: boolean
  handleSpeedRunMode: Function
  isCustomGame: boolean
}

export const SettingsModal = ({
  isOpen,
  handleClose,
  isHardMode,
  handleHardMode,
  isDarkMode,
  handleDarkMode,
  isHighContrastMode,
  handleHighContrastMode,
  swapEnterAndDelete,
  handleSwapEnterAndDelete,
  isConfettiEnabled,
  handleConfettiEnabled,
  isSpeedRunMode,
  handleSpeedRunMode,
  isCustomGame,
}: Props) => {
  return (
    <BaseModal title="Settings" isOpen={isOpen} handleClose={handleClose}>
      <div className="mt-2 flex flex-col divide-y">
        <SettingsToggle
          settingName="Hard Mode"
          flag={isHardMode}
          handleFlag={handleHardMode}
          description={HARD_MODE_DESCRIPTION}
        />
        {/* <SettingsToggle
          settingName="Dark Mode"
          flag={isDarkMode}
          handleFlag={handleDarkMode}
        /> */}
        <SettingsToggle
          settingName="High Contrast Mode"
          flag={isHighContrastMode}
          handleFlag={handleHighContrastMode}
          description={HIGH_CONTRAST_MODE_DESCRIPTION}
        />
        <SettingsToggle
          settingName="Swap enter and delete"
          flag={swapEnterAndDelete}
          handleFlag={handleSwapEnterAndDelete}
          description={SWAP_ENTER_AND_DELETE_DESCRIPTION}
        />
        <SettingsToggle
          settingName="Enable Confetti"
          flag={isConfettiEnabled}
          handleFlag={handleConfettiEnabled}
          description={ENABLE_CONFETTI_DESCRIPTION}
        />
        {!isCustomGame && (
          <SettingsToggle
            settingName="Speed Run Mode"
            flag={isSpeedRunMode}
            handleFlag={handleSpeedRunMode}
            description={ENABLE_SPEED_RUN_MODE}
          />
        )}
      </div>
    </BaseModal>
  )
}
