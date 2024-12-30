import { TextChannel } from "discord.js";
import * as dotenv from "dotenv";
import { client } from "..";


interface TwitchTokenResponse {
    access_token: string;
    expires_in: number;
    token_type: string;
  }

export const initTwitchMonitoring = async () => {
  const channelName = 'amelhorqtemos';

let wasLive = false; 
async function checkLiveStatusPeriodically(channelName: string, interval: number) {
  const channelId = process.env.CHANNEL_ID;

  if (!channelId) {
    console.error('Erro: CHANNEL_ID não configurado nas variáveis de ambiente.');
    return;
  }

  const channel = await client.channels.fetch(channelId) as TextChannel;
  if (!channel) {
    console.error('Erro: Canal do Discord não encontrado.');
    return;
  }

  const checkStatus = async () => {
    try {
      const isLive = await monitorTwitchChannel(channelName);

      if (isLive && !wasLive) {
        wasLive = true;
        console.log(`A live de ${channelName} começou!`);
        channel.send({ content:  `🚨 **RAPAZIADA, A STREAM DE \`${channelName}\` ESTÁ AO VIVO, VALDEZ!** 🚨\n\n🔴 Venham conferir: https://www.twitch.tv/${channelName}` }).catch((error) =>
          console.error(`Erro ao enviar mensagem ao Discord: ${error}`)
        );
      } else if (!isLive && wasLive) {
        wasLive = false;
        console.log(`A live de ${channelName} terminou.`);
      } else {
        console.log(`A live de ${channelName} permanece no estado atual: ${isLive ? 'ao vivo' : 'offline'}.`);
      }
    } catch (error) {
      console.error(`Erro ao verificar status da live: ${error}`);
    }
  };

  // Inicia a verificação periódica
  setInterval(checkStatus, interval);
}

const interval = 2 * 60 * 1000; 
checkLiveStatusPeriodically(channelName, interval); 
}


export const getAccessToken = async (): Promise<string | undefined> => {
    try {
        dotenv.config();

        const clientId = process.env.TWITCH_CLIENT_ID!;
        const clientSecret = process.env.TWITCH_CLIENT_SECRET!;

      if (!clientId || !clientSecret) {
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

    return data.data.length > 0;
  };

  export const monitorTwitchChannel = async (channelName: string) => {
    try { 
      const isLive = await checkLiveStatus(channelName);

      return isLive;
    } catch (error) {
      console.error('Erro ao monitorar o canal da Twitch:', error);
    }
  };