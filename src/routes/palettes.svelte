<script context="module" lang="ts">
  export async function load({ fetch, url }) {
    const response = await fetch('/palettes.json');
    const { pathname } = url;

    if (response.ok) {
      return {
        props: {
          palettes: await response.json(),
          pathname,
        },
      };
    }

    return {
      status: response.status,
      error: new Error('Could not load.'),
    };
  }
</script>

<script lang="ts">
  import { session } from '$app/stores';
  import { addPaletteIcon } from '$lib/icons';

  import Header from '$lib/components/Header.svelte';
  import Modal from '$lib/components/Modal.svelte';
  import PaletteForm from '$lib/components/PaletteForm.svelte';
  import PalettePreview from '$lib/components/PalettePreview.svelte';
  import { successNotifier, warningNotifier } from '$lib/notifier';

  export let palettes;
  export let pathname;

  let showPaletteModal = false;

  async function refreshIt() {
    const response = await fetch('/palettes.json');

    if (response.ok) {
      return response.json();
    } else {
      warningNotifier(`There was an error fetching: ${response.statusText}`);
    }
  }

  async function refresh({ notify, message }) {
    palettes = await refreshIt();
    if (notify) {
      successNotifier(message);
    }
  }

  function handleUpdate(event = null) {
    showPaletteModal = false;
    refresh({ notify: true, message: event ? event.detail : null });
  }
</script>

<svelte:head>
  <title>Palettes - Paint Library</title>
</svelte:head>

{#if showPaletteModal}
  <Modal on:close={() => (showPaletteModal = false)} title="Create New Palette">
    <div class="col-span-12">
      <PaletteForm on:update={handleUpdate} method="create" />
    </div>
  </Modal>
{/if}

<div class="lg:container mx-auto px-4 sm:px-6">
  <Header title="Palettes" {pathname}>
    {#if $session?.user}
      <div class="relative inline-block text-left">
        <div class="lg:mr-2 inline">
          <button
            type="button"
            title="Create New Palette"
            aria-label="Create New Palette"
            class="pop inline-flex justify-center p-2 lg:px-3 lg:py-1 text-sm"
            on:click={() => (showPaletteModal = true)}>
            {@html addPaletteIcon('h-5 w-5')}
            <span class="hidden lg:inline-block ml-1">Create New Palette</span>
          </button>
        </div>
      </div>
    {/if}
  </Header>

  <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
    {#each palettes as palette}
      <PalettePreview {palette} />
    {/each}
  </div>
</div>
