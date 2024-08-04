const videoUrlsList: string[] =
        ["https://www.youtube.com/watch?v=0BSwlB3uaDM",
        "https://www.youtube.com/watch?v=KzgwFhIuRtI",
        "https://www.youtube.com/watch?v=sUEJ-avKFMo",
        "https://www.youtube.com/watch?v=EVW0qBdzg70",
        "https://www.youtube.com/watch?v=tz_NidY42JA",
        "https://www.youtube.com/watch?v=jR1-h-huqzM",
        "https://www.youtube.com/watch?v=C7-I2WCdwAo",
        "https://www.youtube.com/watch?v=6Jk7Tpd1jGo",
        "https://www.youtube.com/watch?v=KXJk8f0xu_c",
        "https://www.youtube.com/watch?v=4C8oqEmH2vo",
        "https://www.youtube.com/watch?v=cPCgN9uTNVc",
        "https://www.youtube.com/watch?v=a0QzQwhYKvc",
        "https://www.youtube.com/watch?v=3Ge2f5Ej5_M"];

export const getRandomUrl = (): string => {
    const randomIndex = Math.floor(Math.random() * videoUrlsList.length);
    return videoUrlsList[randomIndex];
}