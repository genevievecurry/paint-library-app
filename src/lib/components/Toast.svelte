<script lang="ts">
  import { infoIcon, errorIcon, successIcon } from '$lib/icons';
  import { session } from '$app/stores';
  import { afterUpdate } from 'svelte';
  import Spinner from '$lib/components/Spinner.svelte';

  let bgColor = 'bg-black';
  let icon = infoIcon();

  $: toast = $session.toast;

  afterUpdate(() => {
    console.log('foo');
    if (toast?.type) {
      switch (toast.type) {
        case 'success':
          bgColor = 'bg-lime-600';
          icon = successIcon();
          break;
        case 'error':
          bgColor = 'bg-orange-600';
          icon = errorIcon();
          break;
        case 'loading':
          bgColor = 'bg-teal-600';
          icon = '';
        default:
          bgColor = 'bg-black';
          icon = infoIcon();
          break;
      }
    }
  });

  function clearToastNotification() {
    $session.toast = {
      type: '',
      message: '',
      visible: false,
    };
  }
</script>

{#if toast?.visible}
  <div class="fixed z-30 bottom-2 right-2">
    <div class="max-w-xs p-4 {bgColor} text-white">
      <div class="container mx-auto">
        <div class="flex justify-between items-center">
          <div class="flex items-center mr-6">
            {#if icon === ''}
              <Spinner spinner="bubbles" />
            {:else}
              {@html icon}
            {/if}
          </div>
          <div class="flex-grow text-sm">
            {@html toast?.message}
          </div>
          <button on:click={clearToastNotification}>
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
  </div>
{/if}
