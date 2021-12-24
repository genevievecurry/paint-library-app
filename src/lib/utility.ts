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

export async function connect({method = 'post', endpoint, data}: {
  method: string, 
  endpoint: string, 
  data?: unknown}
  ): Promise<Response> {

  const opts = {
    method,
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    headers: {},
    body: '',
  }

  if(data){
    opts.headers = {
      'Content-Type': 'application/json',
    }
    opts.body = JSON.stringify(data)
  }

  return fetch(endpoint, opts);
}
