export const API_BASE_URL = 'https://wordrama-api-prod.herokuapp.com'; // BUILD_MARKER_2026_02_23_1
export const SOCKET_BASE_URL = 'http://localhost:4000';
export const MAX_FILE_SIZE_MB = Number(process?.env?.NEXT_MAX_FILE_SIZE_MB) || 5;
export const APP_INSIGHTS = 'InstrumentationKey=9375a2b1-6c08-423c-85df-9678bfaf4f5b;IngestionEndpoint=https://uksouth-1.in.applicationinsights.azure.com/;LiveEndpoint=https://uksouth.livediagnostics.monitor.azure.com/;ApplicationId=c51d62bf-88ef-423e-9798-b81203d56267'
export const isPastFirstDecember = new Date() > new Date('2024-12-01T00:00:00');
export const isChristmas = new Date() > new Date('2024-12-25T00:00:00');
export const isAfterChristmas = new Date() > new Date('2024-12-26T00:00:00');
export const isNewYear = new Date() > new Date('2025-01-01T00:00:00');
export const isAfterNewYear = new Date() > new Date('2025-01-02T00:00:00');
export const showChristmas = isPastFirstDecember && !isAfterChristmas;
export const showChristmasDay = isChristmas && !isAfterChristmas;
export const showNewYear = isNewYear && !isAfterNewYear;
//window.location.host === 'dev.wordrama.io' ? 'https://api-dev.wordrama.io' : 'https://api.wordrama.io'

export const wordleWordPackConfig = {
  friendlyNameByName: {
    FOUR_LETTER: '4 Letter',
    FIVE_LETTER: '5 Letter',
    SIX_LETTER: '6 Letter',
    SEVEN_LETTER: '7 Letter',
    EIGHT_LETTER: '8 Letter',
    NINE_LETTER: '9 Letter',
    TEN_LETTER: '10 Letter',
    ELEVEN_LETTER: '11 Letter',
    ELEVEN_LETTER_EXTENDED: '11 Letter Extended',
    TWELVE_LETTER: '12 Letter',
    THIRTEEN_LETTER: '13 Letter',
    FOURTEEN_LETTER: '14 Letter',
    FIFTEEN_LETTER: '15 Letter',
    SIXTEEN_LETTER: '16 Letter',
    SEVENTEEN_LETTER: '17 Letter',
    EIGHTEEN_LETTER: '18 Letter',
    NINETEEN_LETTER: '19 Letter',
    TWENTY_LETTER: '20 Letter',
    TWENTYONE_LETTER: '21 Letter',
    TWENTYTWO_LETTER: '22 Letter',
    TWENTYTHREE_LETTER: '23 Letter'
  },
  solutionLengthByName: {
    FOUR_LETTER: 4,
    FIVE_LETTER: 5,
    SIX_LETTER: 6,
    SEVEN_LETTER: 7,
    EIGHT_LETTER: 8,
    NINE_LETTER: 9,
    TEN_LETTER: 10,
    ELEVEN_LETTER: 11,
    ELEVEN_LETTER_EXTENDED: 11,
    TWELVE_LETTER: 12,
    THIRTEEN_LETTER: 13,
    FOURTEEN_LETTER: 14,
    FIFTEEN_LETTER: 15,
    SIXTEEN_LETTER: 16,
    SEVENTEEN_LETTER: 17,
    EIGHTEEN_LETTER: 18,
    NINETEEN_LETTER: 19,
    TWENTY_LETTER: 20,
    TWENTYONE_LETTER: 21,
    TWENTYTWO_LETTER: 22,
    TWENTYTHREE_LETTER: 23
  }
}

export const wordleStylingConfig = {
  friendlyNameById: {
    '0e806591-c472-4c28-8b81-4ae02706a24d': 'Pink',
    '1ef6c4c5-a3c8-42e5-9e85-64fada3e61cd': 'Hot Pink',
    '0002d0b7-7360-4af7-9cdf-7c3e71b625ad': 'Light Blue',
    'f34d1992-2e8e-40ca-834b-e09957639c6c': 'Blue',
    '07024e2d-590d-4ad6-acb8-6e78a3250973': 'Dark Blue',
  }
}
