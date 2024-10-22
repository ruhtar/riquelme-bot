import * as dotenv from "dotenv";


interface TwitchTokenResponse {
    access_token: string;
    expires_in: number;
    token_type: string;
  }

export const getAccessToken = async (): Promise<string | undefined> => {
    try {
        dotenv.config();

        const clientId = process.env.TWITCH_CLIENT_ID!;
        const clientSecret = process.env.TWITCH_CLIENT_SECRET!;

      if (!clientId || !clientSecret) {
        console.log('clientId',clientId)
        console.log('clientSecret',clientSecret)
        throw new Error('clientId e clientSecret não estão definidos.');
      }
  
      const response = await fetch('https://id.twitch.tv/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
      });
  
      if (!response.ok) {
        throw new Error(`Erro ao obter access token: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json() as TwitchTokenResponse;
      return data.access_token;
    } catch (error) {
      console.error('Erro ao obter access token:', error);
      return undefined;
    }
  };


  export const checkLiveStatus = async (channelName: string): Promise<boolean> => {
    const token = await getAccessToken();

    const clientId = process.env.TWITCH_CLIENT_ID!;

    console.log('token',token)
  
    if (!token) {
      console.error('Erro ao obter access token.');
      return false;
    }
  
    const response = await fetch(`https://api.twitch.tv/helix/streams?user_login=${channelName}`, {
      headers: {
        'Client-ID': clientId,
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!response.ok) {
      console.error(`Erro ao verificar status da live: ${response.status} ${response.statusText}`);
      return false;
    }
  
    const data:any = await response.json();

    console.log('data',data)
  
    return data.data.length > 0;
  };

  export const monitorTwitchChannel = async (channelName: string) => {
    try {
      const isLive = await checkLiveStatus(channelName);
  
      if (isLive) {
        console.log(`${channelName} está ao vivo!`);
      } else {
        console.log(`${channelName} não está ao vivo.`);
      }

      return isLive;
    } catch (error) {
      console.error('Erro ao monitorar o canal da Twitch:', error);
    }
  };