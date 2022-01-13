export function deleteIcon(
  klass = 'h-6 w-6',
  currentColor = 'currentColor',
): string {
  const icon = `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="${klass}"
      fill="none"
      viewBox="0 0 24 24"
      stroke="${currentColor}">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  `;
  return icon;
}

export function editIcon(
  klass = 'h-6 w-6',
  currentColor = 'currentColor',
): string {
  const icon = `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="${klass}"
      fill="none"
      viewBox="0 0 24 24"
      stroke="${currentColor}">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
    `;
  return icon;
}

export function adminIcon(
  klass = 'h-6 w-6',
  currentColor = 'currentColor',
): string {
  const icon = `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="${klass}"
      viewBox="0 0 20 20"
      fill="${currentColor}">
      <path
        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
    `;
  return icon;
}

export function successIcon(
  klass = 'h-6 w-6',
  currentColor = 'currentColor',
): string {
  const icon = `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="${klass}"
      fill="none"
      viewBox="0 0 24 24"
      stroke="${currentColor}">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1"
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  `;
  return icon;
}

export function errorIcon(
  klass = 'h-6 w-6',
  currentColor = 'currentColor',
): string {
  const icon = `
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="${klass}"
    fill="none"
    viewBox="0 0 24 24"
    stroke="${currentColor}">
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
  `;
  return icon;
}

export function infoIcon(
  klass = 'h-6 w-6',
  currentColor = 'currentColor',
): string {
  const icon = `
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="${klass}"
    fill="none"
    viewBox="0 0 24 24"
    stroke="${currentColor}">
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
  `;
  return icon;
}

