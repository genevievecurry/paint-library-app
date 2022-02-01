<script>
  // Based on https://gitlab.com/az67128/svelte-atoms/-/blob/master/src/components/DropZone.svelte
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
  export let maxSizeInMb = 3.5;

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
    class="dropzone flex flex-col border border-dashed w-full p-4 group text-center"
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
          {/if}

          <div class="p-2 flex items-center flex-col max-w-md">
            {#if imagePreview !== null}
              <div>
                <img src={imagePreview} alt="Swatch Preview" />
              </div>
            {/if}
            <div class="text-sm mt-2 font-mono text-ellipsis overflow-hidden"
              >{fileTitle}</div>
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
      <div class="text-xs mt-3">
        <p>Maximum file size is <strong>{maxSizeInMb} MB</strong>.</p>
        <p>
          If your image is larger, try
          <a
            class="decorate-link"
            href="https://tinypng.com/"
            target="_blank"
            rel="noopener noreferrer">compressing it</a> first.
        </p>
      </div>
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
  /* To do: convert to tailwind */
  .dropzone {
    min-height: 200px;
  }
  .fullPageText {
    font-family: var(--preferred-font);
    font-size: 24px;
    font-weight: 500;
    text-align: center;
    color: var(--palette-white);
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
</style>
