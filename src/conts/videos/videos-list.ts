export const videoUrlsList: string[] = 
["https://www.youtube.com/watch?v=0BSwlB3uaDM", 
"https://www.youtube.com/watch?v=KzgwFhIuRtI",
"https://www.youtube.com/watch?v=sUEJ-avKFMo",
"https://www.youtube.com/watch?v=EVW0qBdzg70"];

export const getRandomUrl = (): string => {
    const randomIndex = Math.floor(Math.random() * videoUrlsList.length);
    return videoUrlsList[randomIndex];
  }