export interface UpdateProfileBodyRequest {
    firstname: string;
    lastname: string;
    profileImage: string;
};

export interface UpdateUsernameBodyRequest {
    username: string;
};

export interface LinkDiscordBodyRequest {
    linkCode: string;
    discordUsername: string;
    discordUserId: string;
};