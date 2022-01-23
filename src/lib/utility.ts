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

  if (daysBetween === 0 && hoursBetween < 23 && hoursBetween > 0) {
    return rtf.format(-hoursBetween, 'hour');
  } else if (daysBetween === 0 && hoursBetween === 0) {
    return rtf.format(-minutesBetween, 'minute');
  }
  return rtf.format(-daysBetween, 'day');
};

export function validateUsername(username: string): {
  checkCharacters: boolean;
  checkLength: boolean;
  passes: boolean;
}{
  // allow alphanumeric + underscores + dashes
  const minimumRequirements = /^[a-zA-Z0-9]([a-zA-Z0-9_-])+$/
  const checkLength = username.length > 1 && username.length < 51;
  return {
    checkCharacters: minimumRequirements.test(username),
    checkLength: checkLength,
    passes: minimumRequirements.test(username) && checkLength
  }
}

export function validatePassword(password: string): {
  digits: boolean;
  special: boolean;
  lowercase: boolean;
  uppercase: boolean;
  length: boolean;
  passes: boolean;
} {
  const minimumRequirements =
    /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,24})/;
  const checkDigits = /\d/;
  const checkSpecial = /[^A-z\d][\\\^]?/;
  const checkLowercase = /[a-z]/;
  const checkUppercase = /[A-Z]/;
  const checkLength = password.length > 7 && password.length < 25;

  return {
    digits: checkDigits.test(password),
    special: checkSpecial.test(password),
    lowercase: checkLowercase.test(password),
    uppercase: checkUppercase.test(password),
    length: checkLength,
    passes: minimumRequirements.test(password) && checkLength,
  };
}

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
