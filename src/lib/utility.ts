export function pigmentCode(pigmentType: string, pigmentNumber: string, colorCode: string): string {
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
