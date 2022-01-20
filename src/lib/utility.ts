export function pigmentCode(
  pigmentType: string,
  pigmentNumber: string,
  colorCode: string,
): string {
  let convertedType: string;

  switch (pigmentType) {
    case 'CIPIGMENT':
      convertedType = 'P';
      break;
    case 'CINATURAL':
      convertedType = 'N';
      break;
    default:
      convertedType = '';
  }

  return convertedType + colorCode + pigmentNumber.toString();
}

export const pluralize = (count: number, word:string): string => {
  if(count !== 1) return `${count} ${word}s`
  return `${count} ${word}`
}

export const timeAgo = (time: string | number | Date): string => {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const now = new Date();
  const updated = new Date(time);

  const secondsBetween = Math.abs(Number(updated) - Number(now)) / 1000;
  const minutesBetween = Math.floor(secondsBetween / 60);
  const hoursBetween = Math.floor(secondsBetween / (60 * 60));
  const daysBetween = Math.floor(secondsBetween / (60 * 60 * 24));

  if (daysBetween === 0 && hoursBetween < 12 && hoursBetween > 0) {
    return rtf.format(-hoursBetween, 'hour');
  } else if (daysBetween === 0 && hoursBetween === 0) {
    return rtf.format(-minutesBetween, 'minute');
  }
  return rtf.format(-daysBetween, 'day');
};

export async function connect({
  method = 'post',
  endpoint,
  data,
}: {
  method: string;
  endpoint: string;
  data?: unknown;
}): Promise<Response> {
  const opts = {
    method,
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    headers: {},
    body: '',
  };

  if (data) {
    opts.headers = {
      'Content-Type': 'application/json',
    };
    opts.body = JSON.stringify(data);
  }

  return fetch(endpoint, opts);
}
