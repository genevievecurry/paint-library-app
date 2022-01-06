<script>
  import { onMount } from 'svelte';
  import { bubble, listen } from 'svelte/internal';
  import { current_component } from 'svelte/internal';
  import Spinner from './Spinner.svelte';

  export let disabled = false;
  export let isLoading = false;
  export let title = 'Drag file there or';
  export let buttonTitle = 'Select file';
  export let buttonResetTitle = 'Choose a different file';
  export let activeTitle = 'Drop file for upload';
  export let fileLoadingTitle = 'File is loading';
  export let fileTitle = '';
  export let error = '';
  export let dropOnPage = false;
  export let imagePreview = null;

  $: imagePreview;

  function getEventsAction(component) {
    return (node) => {
      const events = Object.keys(component.$$.callbacks);
      const listeners = [];

      events.forEach((event) =>
        listeners.push(listen(node, event, (e) => bubble(component, e))),
      );

      return {
        destroy: () => {
          listeners.forEach((listener) => listener());
        },
      };
    };
  }

  const events = getEventsAction(current_component);
  let isActive = false;
  let overlayRef = null;
  let throttleRef = null;

  const highlight = (e) => changeHighlight(e, true);
  const unhighlight = (e) => changeHighlight(e, false);

  const changeHighlight = (e, val) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLoading && disabled) return;
    clearTimeout(throttleRef);
    throttleRef = setTimeout(() => (isActive = val), val ? 0 : 10);
  };

  onMount(() => {
    if (dropOnPage) {
      document.body.addEventListener('dragenter', highlight, false);
      document.body.addEventListener('dragover', highlight, false);
      document.body.addEventListener('dragleave', unhighlight, false);
      document.body.addEventListener('drop', unhighlight, false);
    }
    document.body.appendChild(overlayRef);
    return () => {
      document.body.removeChild(overlayRef);
      document.body.removeEventListener('dragenter', highlight, false);
      document.body.removeEventListener('dragover', highlight, false);
      document.body.removeEventListener('dragleave', unhighlight, false);
      document.body.removeEventListener('drop', unhighlight, false);
    };
  });
</script>

<div class="flex items-center justify-center w-full">
  <label
    class="flex flex-col border border-dashed w-full h-60 p-4 group text-center"
    class:isActive={isActive && !dropOnPage}
    class:isLoading
    class:disabled
    on:dragenter={highlight}
    on:dragover={highlight}
    on:dragleave={unhighlight}
    on:drop={unhighlight}
    use:events>
    <input type="file" disabled={disabled || isLoading} class="fileInput" />
    {#if isActive && !isLoading && !dropOnPage}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-24 w-24 mx-auto mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width=".5"
          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
      <span class="font-light text-gray-400">{activeTitle}</span>
    {:else if isLoading}
      <Spinner />
      <span class="font-light text-gray-400">{fileLoadingTitle}</span>
    {:else}
      {#if fileTitle}
        <div class="flex items-center justify-center w-full">
          {#if error}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-10 w-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          {:else if imagePreview !== null}
            <div>
              <img src={imagePreview} alt="Swatch Preview" />
            </div>
          {/if}
          <div class="p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-12 w-12 mx-auto mb-4 text-pink-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width=".5"
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <div>Upload successful!</div>
            <div class="text-sm">{fileTitle}</div>
          </div>
        </div>
        {#if error}
          <div class="error">{error}</div>
        {/if}
      {:else}
        <span>{title}</span>
      {/if}
      <div
        class="pop py-1 px-3 text-dark dark:text-light text-center mx-auto mt-2"
        >{fileTitle ? buttonResetTitle : buttonTitle}</div>
    {/if}
  </label>
</div>
<div>
  <div bind:this={overlayRef}>
    {#if isActive && dropOnPage}
      <div class="overlay" />
      <div class="overlayContent" use:events>
        X
        <div class="fullPageText">{activeTitle}</div>
      </div>
    {/if}
  </div>
</div>

<style>
  .fullPageText {
    font-family: var(--preferred-font);
    font-size: 24px;
    font-weight: 500;
    text-align: center;
    color: var(--palette-white);
  }
  .aa-DropZone {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: var(--palette-white);
    border: dashed 2px var(--palette-noactive-4);
    min-height: 120px;
    border-radius: 8px;
    padding: 16px;
    cursor: pointer;
  }
  .fileInput {
    display: none;
  }
  .isActive {
    border: dashed 2px var(--palette-primary-1);
    background-color: var(--palette-primary-7);
  }
  .isLoading {
    border: dashed 2px var(--palette-primary-1);
    background-color: var(--palette-primary-7);
    cursor: initial;
  }
  .error {
    font-display: var(--preferred-font);
    font-size: 14px;
    color: var(--palette-negative-1);
  }
  .fileNameContainer {
    display: flex;
    align-items: center;
  }
  .disabled {
    cursor: initial;
    background-color: var(--palette-noactive-6);
  }
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: var(--palette-primary-1);
    opacity: 0.85;
  }
  .overlayContent {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    border: dashed 4px var(--palette-white);
    margin: 16px;
  }
  .fileTitle {
    margin-left: 8px;
    font-size: 14px;
    font-family: var(--preferred-font);
    color: var(--palette-noactive-3);
  }
</style>