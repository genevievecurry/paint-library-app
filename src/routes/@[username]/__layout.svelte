<script context="module">
  export async function load({ params, fetch, url }) {
    const response = await fetch(`/@${params.username}.json`);
    const { pathname } = url;
    if (response.ok) {
      return {
        props: {
          user: await response.json(),
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
  import { successNotifier, warningNotifier } from '$lib/notifier';
  import Header from '$lib/components/Header.svelte';
  import Modal from '$lib/components/Modal.svelte';
  import PaletteForm from '$lib/components/PaletteForm.svelte';
  import { goto } from '$app/navigation';

  export let user;
  export let pathname;

  let showPaletteModal = false;

  async function refreshIt() {
    const response = await fetch(`/@${user.username}.json`);

    if (response.ok) {
      return response.json();
    } else {
      warningNotifier(`There was an error fetching: ${response.statusText}`);
    }
  }

  async function refresh({ notify, message }) {
    user = await refreshIt();
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
  <title>@{user.username} - Paint Library</title>
</svelte:head>

{#if showPaletteModal}
  <Modal on:close={() => (showPaletteModal = false)} title="Create New Palette">
    <div class="col-span-12">
      <PaletteForm on:update={handleUpdate} method="create" />
    </div>
  </Modal>
{/if}

<div class="lg:container mx-auto px-4 sm:px-6">
  <Header title="@{user.username}">
    {#if $session?.user.uuid === user.uuid}
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

  <div class="border-b mb-10">
    <ul class="flex">
      <li
        class="border-b-4 transition-colors hover:text-teal-600 hover:border-gray-300"
        class:current={pathname === `/@${user.username}/palettes`}
        id="ownedPalettes">
        <a href="palettes" class="block py-3 px-6"
          >Palettes {user._count.ownedPalettes}</a
        ></li>
      <li
        class="border-b-4 transition-colors hover:text-teal-600 hover:border-gray-300"
        class:current={pathname === `/@${user.username}/saved`}
        id="savedPalettes">
        <a href="saved" class="block py-3 px-6"
          >Saved {user._count.savedPalettes}</a
        ></li>
      <li
        class="border-b-4 transition-colors hover:text-teal-600 hover:border-gray-300"
        class:current={pathname === `/@${user.username}/swatches`}
        id="swatchCards">
        <a href="swatches" class="block py-3 px-6"
          >Swatch Cards {user._count.swatchCards}</a
        ></li>
      <li
        class="border-b-4 transition-colors hover:text-teal-600 hover:border-gray-300"
        class:current={pathname === `/@${user.username}/notes`}
        id="notes">
        <a href="notes" class="block py-3 px-6">Notes {user._count.notes}</a
        ></li>
    </ul>
  </div>

  <slot />
</div>

<style>
  .current {
    @apply border-black;
  }
</style>
