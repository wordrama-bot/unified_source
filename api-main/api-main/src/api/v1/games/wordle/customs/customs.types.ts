export interface CreateCustomWordleBodyRequest {
    isPublic: boolean
    shareToUserId: string
    shareCode: string
    customWord: string
    hint: string
};

export interface CustomWordle {
    user_id: string
    is_public: boolean
    share_to_user_id?: string
    share_code: string
    custom_word: string
    hint?: string
}