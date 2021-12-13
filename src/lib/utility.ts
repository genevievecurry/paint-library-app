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

export async function post(endpoint, data) {
  return fetch(endpoint, {
    method: 'post',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data),
  });
}
