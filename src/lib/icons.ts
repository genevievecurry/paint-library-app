// Trash Can | trash solid-fill | https://heroicons.com/
export function removeIcon(
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
        fill-rule="evenodd"
        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
        clip-rule="evenodd" />
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

export function circleErrorIcon(
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
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  `;
  return icon;
}

export function emptyCircleIcon(
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
        d="M0 01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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

export function closeIcon(
  klass = 'h-6 w-6',
  currentColor = 'currentColor',
): string {
  const icon = `
  <svg
    class="${klass}"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="${currentColor}"
    aria-hidden="true">
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M6 18L18 6M6 6l12 12" />
  </svg>
  `;
  return icon;
}

export function searchIcon(
  klass = 'h-6 w-6',
  currentColor = 'currentColor',
): string {
  const icon = `
  <svg
    class="${klass}"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <path
      d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
      stroke="${currentColor}"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round" />
    <path
      d="M21 21L16.65 16.65"
      stroke="${currentColor}"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round" />
  </svg>
  `;
  return icon;
}

export function settingsIcon(
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
        fill-rule="evenodd"
        d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
        clip-rule="evenodd" />
    </svg>
  `;
  return icon;
}

export function swatchesIcon(
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
        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
  `;
  return icon;
}

export function menuIcon(
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
        d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
  `;
  return icon;
}

export function checkmarkIcon(
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
        d="M5 13l4 4L19 7" />
    </svg>
  `;
  return icon;
}

export function circleCheckmarkIcon(
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
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  `;
  return icon;
}

export function addIcon(
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
        d="M12 4v16m8-8H4" />
    </svg>
  `;
  return icon;
}

export function circleAddIcon(
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
        d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  `;
  return icon;
}

export function chevronRightIcon(
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
        d="M9 5l7 7-7 7" />
    </svg>
  `;
  return icon;
}

// Eye | eye outline | https://heroicons.com/
export function showIcon(
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
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  `;
  return icon;
}

// Eye with a slash | eye-off outline | https://heroicons.com/
export function hideIcon(
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
        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  `;
  return icon;
}

// Speech bubble with text | annotation outline | https://heroicons.com/
export function noteIcon(
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
        fill-rule="evenodd"
        d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z"
        clip-rule="evenodd" />
    </svg>
  `;
  return icon;
}

// Thumbs Up | thumb-up solid-fill | https://heroicons.com/
export function approveIcon(
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
        d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
    </svg>
  `;
  return icon;
}

// Thumbs Down | thumb-down solid-fill | https://heroicons.com/
export function unapproveIcon(
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
        d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
    </svg>
  `;
  return icon;
}
