export const getModalThemeClasses = (themeId?: string) => {
  switch (themeId) {
    case 'theme.midnight':
      return {
        modal: 'bg-slate-900 border border-slate-700 text-slate-100',
        title: 'text-slate-100',
        icon: 'stroke-slate-100',
      }

    case 'theme.rose-gold':
      return {
        modal: 'bg-white border border-rose-300 text-gray-900',
        title: '',
        icon: 'stroke-rose-400',
      }

    default:
      return {
        modal: undefined,
        title: undefined,
        icon: undefined,
      }
  }
}