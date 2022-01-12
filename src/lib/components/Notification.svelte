<script lang="ts">
  import { session } from '$app/stores';
  import { afterUpdate } from 'svelte';

  // Defaults
  let bgColor = 'bg-gray-700';
  let icon = `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  `;
  // Does this help? I'm not sure
  $: notification = $session.notification;

  afterUpdate(() => {
    if (notification?.type) {
      switch (notification.type) {
        case 'success':
          bgColor = 'bg-lime-600';
          icon = `
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-10 w-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1"
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          `;
          break;
        case 'error':
          bgColor = 'bg-orange-600';
          icon = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            `;
        default:
          break;
      }
    }
  });

  function clearSessionNotification() {
    $session.notification = {
      type: '',
      message: '',
      visible: false,
    };
  }
</script>

{#if notification?.visible}
  <div class="{bgColor} py-3 text-white font-light">
    <div class="container mx-auto px-4 sm:px-6">
      <div class="flex justify-between items-center">
        <div class="flex items-center mr-6">
          {@html icon}
        </div>
        <div class="flex-grow">
          {@html notification?.message}
        </div>
        <button on:click={clearSessionNotification}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 ml-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </div>
{/if}
