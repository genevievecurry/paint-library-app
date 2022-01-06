<script context="module" lang="ts">
  export async function load({ page, fetch }) {
    const url = `/palette/${page.params.uuid}.json`;
    const response = await fetch(url);

    if (response.ok) {
      return {
        props: {
          uuid: page.params.uuid,
          paletteData: await response.json(),
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
  import { onMount } from 'svelte';
  import Header from '$lib/components/Header.svelte';
  import Dialog from '$lib/components/Dialog.svelte';
  import Modal from '$lib/components/Modal.svelte';
  import PaletteForm from '$lib/components/PaletteForm.svelte';
  import { clickOutside } from '$lib/actions';
  import { connect, generateUrl } from '$lib/utility';
  import { session } from '$app/stores';
  import { goto } from '$app/navigation';

  export let uuid: string;
  export let paletteData: PaletteComponent;

  $: palette = paletteData;
  $: title = palette.title || '';
  $: owner = palette.owner || { uuid: '' };
  $: description = palette.description || '';
  $: paintsInPalette = palette.paintsInPalette || [];
  $: saved = false;

  let editable = false;
  let editMenuOpen = false;
  let showEditPaletteModal = false;
  let showDeletePaletteDialog = false;

  onMount(() => {
    editable =
      $session.user &&
      (owner?.uuid === $session.user.uuid || $session.user.role === 'ADMIN');
    saved = palette.savedByUser;
  });

  async function deletePalette() {
    const response = await connect({
      method: 'DELETE',
      endpoint: `/palette/${uuid}.json`,
    });

    if (response.ok) {
      goto(`/@${$session.user.username}`);

      $session.notification = {
        type: 'success',
        visible: true,
        message: `Successfully deleted ${title}.`,
      };
    } else {
      $session.notification = {
        type: 'error',
        visible: true,
        message: `Uh oh, there was a problem deleting ${title}. ${response.statusText}`,
      };
    }
  }

  function handleEditedPalette() {
    palette = palette;
    showEditPaletteModal = false;
  }

  async function savePalette() {
    const response = await connect({
      method: 'post',
      endpoint: `/palette/${uuid}.json`,
      data: { savedByUser: $session.user },
    });
    if (response.status === 200) {
      return response.json();
    }
  }

  async function unsavePalette() {
    const response = await connect({
      method: 'post',
      endpoint: `/palette/${uuid}.json`,
      data: { unsavedByUser: $session.user },
    });
    if (response.status === 200) {
      return response.json();
    }
  }

  async function toggleSavedPalette() {
    let savedPalettePromise;
    if (saved) {
      savedPalettePromise = await unsavePalette();
    } else {
      savedPalettePromise = await savePalette();
    }

    if (savedPalettePromise?.uuid) {
      saved = !saved;
    }
  }
</script>

{#if showEditPaletteModal && editable}
  <Modal on:close={() => (showEditPaletteModal = false)} title="Edit Palette">
    <div class="col-span-12">
      <PaletteForm {palette} on:success={handleEditedPalette} />
    </div>
  </Modal>
{/if}

{#if showDeletePaletteDialog && editable}
  <Dialog
    on:close={() => (showDeletePaletteDialog = false)}
    on:confirm={deletePalette}>
    <div slot="confirmationText">
      <p class="font-bold">Are you sure you want to delete this palette?</p>
      <p class="my-2"
        >This cannot be undone. The good news is that you can easily make
        another palette just like it if you have regrets!</p>
    </div>
  </Dialog>
{/if}

<div class="container mx-auto px-4 sm:px-6">
  <Header {title} {owner} {description}>
    {#if $session.user}
      <button
        on:click={toggleSavedPalette}
        class="pop inline-flex justify-center px-2 py-1 text-sm {saved
          ? 'text-pink-600'
          : 'text-black'}">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 mr-1"
          fill={saved ? 'currentColor' : 'none'}
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <span>{saved ? 'Saved' : 'Save'}</span>
      </button>
    {/if}
    {#if editable}
      <div class="relative inline-block text-left">
        <div
          use:clickOutside={{
            enabled: editMenuOpen,
            cb: () => (editMenuOpen = false),
          }}>
          <button
            type="button"
            class="pop inline-flex justify-center px-2 py-1 text-sm"
            id="menu-button"
            aria-expanded={editMenuOpen}
            aria-haspopup="true"
            on:click={() => (editMenuOpen = true)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                clip-rule="evenodd" />
            </svg>
            <span>Settings</span>
          </button>
        </div>

        {#if editMenuOpen}
          <div
            class="transition ease-out duration-100 {editMenuOpen
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-95'} z-10 border border-black origin-top-right absolute right-0 mt-2 w-64 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
            tabindex="-1">
            <span
              on:click={() => (showEditPaletteModal = true)}
              class="action-link block px-4 py-2 text-sm flex"
              role="menuitem"
              tabindex="-1">
              Edit
            </span>
            <span
              on:click={() => (showDeletePaletteDialog = true)}
              class="action-link delete block px-4 py-2 text-sm flex"
              role="menuitem"
              tabindex="-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>

              <span class="block">Delete Palette</span>
            </span>
          </div>
        {/if}
      </div>
    {/if}
  </Header>

  <section
    class="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-4">
    {#each paintsInPalette as paintInPalette}
      <div class="border border-black p-1">
        <a
          href={generateUrl({ prefix: 'paint', target: paintInPalette.paint })}>
          <div
            class="w-full h-32"
            style={`background-color: ${paintInPalette.paint.hex}`} />
        </a>
      </div>
    {/each}
  </section>
</div>
