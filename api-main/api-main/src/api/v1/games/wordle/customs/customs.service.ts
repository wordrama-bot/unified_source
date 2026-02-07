import { 
  supabase, 
  redisClient 
} from '../../../../..';
import randomString from '../../../../../helper/randomString';

// Types
import { CustomWordle } from "./customs.types";

function generateShareCode() {
  const partA = randomString();
  const partB = randomString();
  return `${partA}-${partB}`;
}

export async function createCustom(
  userId: string,
  isPublic: boolean = false,
  shareToUserId: string = undefined,
  customWord: string,
  hint: string = undefined,
) {
  try {
    const shareCode = generateShareCode();
    const customWordle: CustomWordle = {
      user_id: userId,
      share_code: shareCode,
      custom_word: customWord.toUpperCase(),
      is_public: isPublic,
    }

    if (shareToUserId) {
      customWordle.is_public = false;
      customWordle.share_to_user_id = shareToUserId;
    }

    if (hint) {
      customWordle.hint = hint;
    }
  
    const custom = await supabase.from('wordle_customs')
      .insert(customWordle)
      .select('id, is_public, share_to_user_id, custom_word, played_times, hint, share_code')
      .single();

    if (process.env.ENABLE_CACHE === 'true') {
      redisClient.setEx(
        `wordle_customs:${shareCode}`,
        3600,
        JSON.stringify(custom.data)
      );
    }

    return custom;
  } catch(err) {
    console.error(err);
    return {
      status: 500,
      statusText: 'Internal Server Error'
    };
  }
};

export async function getCustoms(
  userId: string,
  sharedWithMe: boolean = false
) {
  try {  
    if (sharedWithMe) {
      if (process.env.ENABLE_CACHE === 'true') {
        const cachedCustoms = await redisClient.get(`wordle_customs:shareToUserId:${userId}`);
        if (cachedCustoms) {
          return { 
            status: 200,
            statusText: 'OK',
            data: JSON.parse(cachedCustoms)
          };
        }
      }

      const customs = await supabase.from('wordle_customs')
        .select('id, is_public, share_to_user_id, custom_word, played_times, hint, share_code')
        .eq('share_to_user_id', userId);

      if (process.env.CACHE_ENABLED === 'true') {
        redisClient.setEx(
          `wordle_customs:shareToUserId:${userId}`,
          3600,
          JSON.stringify(customs.data)
        );
      }
      
      return customs;
    } else if (userId) {
      if (process.env.ENABLE_CACHE === 'true') {
        const cachedCustoms = await redisClient.get(`wordle_customs:userId:${userId}`);
        if (cachedCustoms) {
          return { 
            status: 200,
            statusText: 'OK',
            data: JSON.parse(cachedCustoms)
          };
        }
      }
      const customs = await supabase.from('wordle_customs')
        .select('id, is_public, share_to_user_id, custom_word, played_times, hint, share_code')
        .eq('user_id', userId);

      if (process.env.ENABLE_CACHE === 'true') {
        redisClient.setEx(
          `wordle_customs:userId:${userId}`,
          3600,
          JSON.stringify(customs.data)
        );
      }
    }
    return {
      status: 400,
      statusText: 'Bad Request',
      data: {}
    };
  } catch(err) {
    console.error(err);
    return {
      status: 500,
      statusText: 'Internal Server Error'
    };
  }
};

export async function getCustom(
  id: string
) {
  try { 
    if (process.env.ENABLE_CACHE === 'true') {
      const cachedCustom = await redisClient.get(`wordle_customs:${id}`);
      if (cachedCustom) {
        return { 
          status: 200,
          statusText: 'OK',
          data: JSON.parse(cachedCustom)
        };
      }
    }
    const custom = await supabase.from('wordle_customs')
      .select('id, is_public, share_to_user_id, custom_word, played_times, hint, share_code')
      .eq('id', id)
      .single();

    if (process.env.ENABLE_CACHE === 'true') {
      redisClient.setEx(`wordle_customs:${id}`, 3600, JSON.stringify(custom.data));
    }
  } catch(err) {
    console.error(err);
    return {
      status: 500,
      statusText: 'Internal Server Error'
    };
  }
};

export async function getCustomByShareCode(
  shareCode: string,
  userId: string = undefined
) {
  try { 
    if (process.env.ENABLE_CACHE === 'true') {
      const cachedCustom = await redisClient.get(`wordle_customs:${shareCode}`);
      if (cachedCustom) {
        const parsed = JSON.parse(cachedCustom);
        if (parsed.is_public) return { 
          status: 200,
          statusText: 'OK',
          data: parsed
        };
        
        if (userId === parsed.share_to_user_id) return { 
          status: 200,
          statusText: 'OK',
          data: parsed
        };

        return {
          status: 403,
          statusText: 'Forbidden',
          data: {}
        };
      }
    }
    const custom = await supabase.from('wordle_customs')
      .select('id, user_id, is_public, share_to_user_id, custom_word, hint, share_code')
      .eq('share_code', shareCode)
      .single();

    if (process.env.ENABLE_CACHE === 'true') {
      await redisClient.setEx(`wordle_customs:${shareCode}`, 3600, JSON.stringify(custom.data));
    }

    if (custom.data.is_public === true) return { 
      status: 200,
      statusText: 'OK',
      data: custom.data
    };
    
    if (userId === custom.data.share_to_user_id) return { 
      status: 200,
      statusText: 'OK',
      data: custom.data
    };

    return {
      status: 403,
      statusText: 'Forbidden',
      data: {}
    };
  } catch(err) {
    console.error(err);
    return {
      status: 500,
      statusText: 'Internal Server Error'
    };
  }
};

export async function deleteCustom(
  id: string,
  userId: string
) {
  try { 
    const custom = await getCustom(id);
    if (custom.status !== 200) return {
      status: 404,
      statusText: 'Not Found'
    };
  
    redisClient.del(`wordle_customs:${id}`);
    redisClient.del(`wordle_customs:userId:${userId}`);
    redisClient.del(`wordle_customs:shareCode:${custom.data.share_code}`);
    redisClient.del(`wordle_customs:shareToUserId:${custom.data.share_to_user_id}`);

    return await supabase.from('wordle_customs')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
  } catch(err) {
    console.error(err);
    return {
      status: 500,
      statusText: 'Internal Server Error'
    };
  }
};
