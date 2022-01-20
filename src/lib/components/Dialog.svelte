<script lang="ts">
  import { createEventDispatcher, onDestroy } from 'svelte';
  const dispatch = createEventDispatcher();
  const close = () => dispatch('close');
  const confirm = () => dispatch('confirm');
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

<!-- This example requires Tailwind CSS v2.0+ -->
<div
  class="fixed z-30 inset-0 overflow-y-auto"
  aria-labelledby="modal-title"
  role="dialog"
  aria-modal="true"
  bind:this={modal}>
  <div
    class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
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
      class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
      aria-hidden="true"
      on:click={close} />

    <!-- This element is to trick the browser into centering the modal contents. -->
    <span
      class="hidden sm:inline-block sm:align-middle sm:h-screen"
      aria-hidden="true">&#8203;</span>

    <!--
      Modal panel, show/hide based on modal state.
      Entering: "ease-out duration-300"
        From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        To: "opacity-100 translate-y-0 sm:scale-100"
      Leaving: "ease-in duration-200"
        From: "opacity-100 translate-y-0 sm:scale-100"
        To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
    -->
    <div
      class="inline-block align-bottom bg-white text-left overflow-hidden transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border-2 border-black">
      <div class="bg-white px-6 pt-6 pb-8">
        <div class="sm:flex sm:items-start">
          <div
            class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-orange-600 sm:mx-0 sm:h-10 sm:w-10">
            <!-- Heroicon name: outline/exclamation -->
            <svg
              class="h-6 w-6 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div class="mt-3 text-center sm:mt-0 sm:ml-6 sm:text-left">
            <h3 class="text-lg leading-6 font-medium" id="modal-title">
              <slot name="title" />
            </h3>
            <div class="mt-4">
              <slot name="confirmationText"><p>Are you sure?</p></slot>
            </div>
          </div>
        </div>
      </div>
      <div
        class="border-t-2 border-black px-4 pt-4 pb-5 sm:px-6 sm:flex sm:flex-row-reverse">
        <button
          type="button"
          class="pop py-1 px-3 hover:text-orange-600"
          on:click={confirm}>
          <slot name="confirm">Confirm</slot>
        </button>
        <button
          type="button"
          class="py-1 px-3 text-gray-500 hover:underline py-2 mx-3"
          on:click={close}>
          <slot name="cancel">Cancel</slot>
        </button>
      </div>
    </div>
  </div>
</div>
