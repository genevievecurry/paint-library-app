<script lang="ts">
  import { createEventDispatcher, onDestroy } from 'svelte';
  const dispatch = createEventDispatcher();
  const close = () => dispatch('close');

  export let title = '';
  export let fullWidth = false;

  let modal;
  const handle_keydown = (e) => {
    if (e.key === 'Escape') {
      close();
      return;
    }

    if (e.key === 'Tab') {
      // trap focus
      const nodes = modal.querySelectorAll('*');
      const tabbable = Array.from(nodes).filter((n) => n.tabIndex >= 0);

      let index = tabbable.indexOf(document.activeElement);
      if (index === -1 && e.shiftKey) index = 0;

      index += tabbable.length + (e.shiftKey ? -1 : 1);
      index %= tabbable.length;

      tabbable[index].focus();
      e.preventDefault();
    }
  };

  const previously_focused =
    typeof document !== 'undefined' && document.activeElement;

  if (previously_focused) {
    onDestroy(() => {
      previously_focused.focus();
    });
  }
</script>

<svelte:window on:keydown={handle_keydown} />

<div
  class="fixed z-20 inset-0 overflow-y-auto"
  role="dialog"
  aria-modal="true"
  bind:this={modal}>
  <div
    class="flex min-h-screen text-center md:block md:px-2 lg:px-4"
    style="font-size: 0;">
    <!--
      Background overlay, show/hide based on modal state.

      Entering: "ease-out duration-300"
        From: "opacity-0"
        To: "opacity-100"
      Leaving: "ease-in duration-200"
        From: "opacity-100"
        To: "opacity-0"
    -->
    <div
      class="hidden fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity md:block"
      aria-hidden="true"
      on:click={close} />

    <!-- This element is to trick the browser into centering the modal contents. -->
    <span
      class="hidden md:inline-block md:align-middle md:h-screen"
      aria-hidden="true">&#8203;</span>

    <!--
      Modal panel, show/hide based on modal state.

      Entering: "ease-out duration-300"
        From: "opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
        To: "opacity-100 translate-y-0 md:scale-100"
      Leaving: "ease-in duration-200"
        From: "opacity-100 translate-y-0 md:scale-100"
        To: "opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
    -->
    <div
      class="flex text-base text-left transition w-full md:inline-block md:max-w-2xl md:px-4 md:my-8 md:align-middle {fullWidth
        ? 'lg:max-w-full'
        : 'lg:max-w-4xl'}">
      <div
        class="w-full relative flex items-center bg-white px-4 pt-14 pb-8 overflow-hidden shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
        <button
          type="button"
          class="absolute top-4 right-4 text-black hover:text-pink-500 sm:top-8 sm:right-6 md:top-6 md:right-6 lg:top-8 lg:right-8"
          autofocus
          on:click={close}>
          <span class="sr-only">Close</span>
          <!-- Heroicon name: outline/x -->
          <svg
            class="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div
          class="w-full grid grid-cols-1 gap-y-8 gap-x-6 items-start sm:grid-cols-12 lg:gap-x-8 ">
          <div class="col-span-11"><h2 class="h2">{title}</h2></div>
          <slot />
        </div>
      </div>
    </div>
  </div>
</div>
