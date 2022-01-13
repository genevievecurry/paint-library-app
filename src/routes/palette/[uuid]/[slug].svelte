<script context="module" lang="ts">
  export async function load({ params, fetch }) {
    const url = `/palette/${params.uuid}.json`;
    const response = await fetch(url);

    if (response.ok) {
      return {
        props: {
          uuid: params.uuid,
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
  import PaintPalettePreview from '$lib/components/PaintPalettePreview.svelte';
  import SortableList from '$lib/components/SortableList.svelte';
  import { clickOutside } from '$lib/actions';
  import { connect } from '$lib/utility';
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
  $: showText = false;
  $: listView = false;

  let editable = false;
  let editMenuOpen = false;
  $: editPaletteMode = false;
  let showEditPaletteModal = false;
  let showDeletePaletteDialog = false;
  let paletteReorderData = [];

  $: sortPaintsInPalette = (event) => {
    paintsInPalette = event.detail;
    setPaletteReorderData();
  };

  onMount(() => {
    editable =
      $session.user &&
      (owner?.uuid === $session.user.uuid || $session.user.role === 'ADMIN');
    saved = palette.savedByUser;
  });

  function setPaletteReorderData() {
    paletteReorderData = [];
    paintsInPalette.map((paintInPalette, index) => {
      paletteReorderData.push({
        where: { id: paintInPalette.id },
        data: { order: index },
      });
    });

    updatePaintInPaletteOrder();
  }

  async function updatePaintInPaletteOrder() {
    $session.toast = {
      type: 'loading',
      visible: true,
      message: `Saving...`,
    };
    const response = await connect({
      method: 'post',
      endpoint: `/palette/${uuid}.json`,
      data: { paletteReorderData: paletteReorderData },
    });

    if (response.ok) {
      $session.toast = {
        type: 'success',
        visible: true,
        message: `Order updated!`,
      };
    } else {
      $session.toast = {
        type: 'success',
        visible: true,
        message: `Uh oh, there was a problem saving the order.`,
      };
    }
  }

  async function removePaintInPalette(event) {
    const response = await connect({
      method: 'post',
      endpoint: `/palette/${uuid}.json`,
      data: { removePaintInPaletteId: event.detail },
    });

    if (response.ok) {
      const filteredPaintsInPalette = paintsInPalette.filter(
        (paintInPalette) => paintInPalette.id !== event.detail,
      );
      paintsInPalette = filteredPaintsInPalette;
      $session.toast = {
        type: 'success',
        visible: true,
        message: `Paint removed!`,
      };
    } else {
      $session.toast = {
        type: 'success',
        visible: true,
        message: `Uh oh, there was a problem removing that paint.`,
      };
    }
  }

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
    paintsInPalette = palette.paintsInPalette;
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
    <span slot="title">Are you sure you want to delete this palette?</span>
    <p slot="confirmationText">
      This cannot be undone. The good news is that you can easily make another
      palette just like it if you have regrets!</p>
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
            class="pop inline-flex justify-center px-2 py-1 text-sm {editMenuOpen
              ? 'active'
              : ''}"
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
              : 'opacity-0 scale-95'} z-10 border-2 border-black origin-top-right absolute right-0 mt-2 w-48 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
            tabindex="-1">
            <span
              on:click={() => (showEditPaletteModal = true)}
              class="px-2 pt-3 text-sm flex"
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span class="decorate-link">Edit</span>
            </span>
            <span
              on:click={() => (showDeletePaletteDialog = true)}
              class="text-red-600 px-2 py-3 text-sm inline-flex"
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

              <span class="decorate-link">Delete Palette</span>
            </span>
          </div>
        {/if}
      </div>
    {/if}
  </Header>
  {#if paintsInPalette.length > 0}
    <section
      class="flex justify-between w-full items-center pb-3 mb-3 border-b-2 border-black">
      <div class="flex justify-start items-center">
        {#if !listView}
          {#if editable}
            <div
              on:click={() => (editPaletteMode = !editPaletteMode)}
              class="text-sm mr-3 link">
              {editPaletteMode ? 'Done Editing' : 'Edit Swatches'}</div>
          {/if}
          <div
            on:click={() => (showText = !showText)}
            class="text-sm mr-3 link">
            {showText ? 'Hide' : 'Show'} Details</div>
        {/if}
      </div>

      <div class="flex justify-end items-center">
        <button
          aria-label="List View"
          title="List View"
          on:click={() => (listView = !listView)}
          class="pop inline-flex justify-center px-2 py-1 text-sm {listView
            ? 'text-pink-600 active'
            : 'text-black'}">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        </button>
        <button
          aria-label="Grid View"
          title="Grid View"
          on:click={() => (listView = !listView)}
          class="pop inline-flex justify-center px-2 py-1 text-sm {!listView
            ? 'text-pink-600 active'
            : 'text-black'}">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            viewBox="0 0 20 20"
            fill="currentColor">
            <path
              d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </button>
      </div>
    </section>

    <section
      class={listView
        ? ''
        : 'grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2'}>
      {#if listView}
        <table class="border-collapse table-auto w-full text-sm">
          <thead>
            <tr>
              <td>&nbsp;</td>
              <td class="font-bold p-3">Manufacturer</td>
              <td class="font-bold p-3">Name</td>
              <td class="font-bold p-3">Lightfastness</td>
              <td class="font-bold p-3">Transparency</td>
              <td class="font-bold p-3">Staining</td>
              <td class="font-bold p-3">Granulating</td>
              <td class="font-bold p-3">Pigments</td>
            </tr>
          </thead>
          <tbody>
            {#each paintsInPalette as paintInPalette}
              <PaintPalettePreview
                paintOnPalette={paintInPalette}
                {showText}
                {listView} />
            {/each}
          </tbody>
        </table>
      {:else}
        <SortableList
          draggable={editPaletteMode}
          list={paintsInPalette}
          key="id"
          on:sort={sortPaintsInPalette}
          let:item>
          <PaintPalettePreview
            paintOnPalette={item}
            {showText}
            {listView}
            on:remove={removePaintInPalette}
            {editPaletteMode} />
        </SortableList>
      {/if}
    </section>
  {:else}
    <p class="text-gray-400 font-light"
      >Ah, an empty palette. So fresh. So clean. So boring.</p>
  {/if}
</div>
