<script context="module" lang="ts">
  export async function load({ params, fetch }) {
    const url = `/paint/${params.uuid}/${params.slug}.json`;
    const response = await fetch(url);

    if (response.ok) {
      return {
        props: {
          slug: params.slug,
          uuid: params.uuid,
          paint: await response.json(),
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
  import { setContext } from 'svelte';
  import { connect, generateUrl } from '$lib/utility';
  import { clickOutside } from '$lib/actions';
  import Header from '$lib/components/Header.svelte';
  import Modal from '$lib/components/Modal.svelte';
  import PaletteForm from '$lib/components/PaletteForm.svelte';
  import SwatchUpload from '$lib/components/SwatchUpload.svelte';
  import Card from './_Card.svelte';
  import Pigments from './_Pigments.svelte';
  import Notes from './_Notes.svelte';

  export let slug: string;
  export let uuid: string;
  export let paint: PaintComponent;

  setContext('paintName', paint.name);
  setContext('uuid', uuid);
  setContext('slug', slug);
  setContext('editable', true);

  if (paint) setContext('hex', paint.hex);

  const {
    lightfastRating,
    transparencyRating,
    stainingRating,
    granulationRating,
    name,
    manufacturer,
    manufacturerDescription,
    communityDescription,
  } = paint;

  let addToPaletteMenuOpen = false;
  let userPalettesPromise: Promise<any>;
  let newlyAddedPalette;
  let showPaletteModal = false;
  let showUploadSwatchModal = false;
  let swatchCardSectionClasses;

  $: editableSwatchCard = {};

  if (paint.swatchCard.length) {
  }
  function setEditableSwatchCard(event) {
    editableSwatchCard = event.detail;
    showUploadSwatchModal = true;
  }

  const checkAlignment = (height, width) => {
    if (height === width) {
      return 'square';
    }
    if (height > width) {
      return 'vertical';
    }
    if (height < width) {
      return 'horizontal';
    }
  };

  async function addToPalette(paletteUuid: string) {
    const response = await connect({
      method: 'post',
      endpoint: `/palette/${paletteUuid}.json`,
      data: {
        paintUuid: paint.uuid,
      },
    });
    if (response.status === 200) {
      return response.json();
    }
  }

  async function addToPaletteHandler(paletteUuid) {
    newlyAddedPalette = await addToPalette(paletteUuid);

    if (newlyAddedPalette.uuid) {
      const url = generateUrl({ prefix: 'palette', target: newlyAddedPalette });
      $session.notification = {
        type: 'success',
        visible: true,
        message: `
        Added <span class="font-bold">${name}</span> to
        <a href="${url}" class="underline">${newlyAddedPalette.title}</a>
        `,
      };
    } else {
      $session.notification = {
        type: 'error',
        visible: true,
        message: 'Something went wrong!',
      };
    }
  }

  async function getUserPalettes() {
    const url = `/@${$session.user.username}/palettes.json`;
    const response = await fetch(url);

    if (response.status == 200) {
      return response.json();
    }
  }

  async function fetchPalettes() {
    userPalettesPromise = getUserPalettes();
  }
</script>

{#if showPaletteModal}
  <Modal on:close={() => (showPaletteModal = false)} title="Create New Palette">
    <div class="col-span-12">
      <PaletteForm paintUuid={paint.uuid} />
    </div>
  </Modal>
{/if}

{#if showUploadSwatchModal}
  <Modal
    on:close={() => (showUploadSwatchModal = false)}
    on:close={() => (editableSwatchCard = {})}
    title={editableSwatchCard?.id ? 'Edit Swatch' : 'Contribute Swatch'}>
    <div class="col-span-12">
      <SwatchUpload
        paintUuid={paint.uuid}
        paintSlug={paint.slug}
        swatchCard={editableSwatchCard} />
    </div>
  </Modal>
{/if}

<div class="container mx-auto px-4 sm:px-6">
  {#if paint}
    <Header
      title={name}
      subtitle={manufacturer.name}
      description={null}
      owner={null}>
      {#if $session?.user}
        <div class="relative inline-block text-left">
          <div class="mr-2 inline">
            <button
              type="button"
              class="pop inline-flex justify-center px-4 py-2 text-sm"
              on:click={() => (showUploadSwatchModal = true)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z"
                  clip-rule="evenodd" />
              </svg>
              Contribute Swatch</button>
          </div>
          <div
            class="inline"
            use:clickOutside={{
              enabled: addToPaletteMenuOpen,
              cb: () => (addToPaletteMenuOpen = false),
            }}>
            <button
              type="button"
              class="pop inline-flex justify-center px-4 py-2 text-sm"
              id="menu-button"
              aria-expanded={addToPaletteMenuOpen}
              aria-haspopup="true"
              on:click={() => (addToPaletteMenuOpen = true)}
              on:click={fetchPalettes}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor">
                <path
                  d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
              </svg>
              Add to Palette
            </button>
          </div>
          {#if addToPaletteMenuOpen}
            <div
              class="transition ease-out duration-100 {addToPaletteMenuOpen
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-95'} z-10 border border-black origin-top-right absolute right-0 mt-2 w-64 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
              tabindex="-1">
              <div role="none">
                {#await userPalettesPromise then value}
                  {#if value?.ownedPalettes}
                    {#each value.ownedPalettes as palette}
                      <div
                        class="action-link border-t border-black px-4 py-2 text-sm flex">
                        <!-- {#if alreadyInPalette(palette.slug)}
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
                              d="M5 13l4 4L19 7" />
                          </svg>
                          <a href="/palette/{palette.slug}">{palette.title}</a>
                        {:else} -->
                        <span
                          class="text-black block"
                          role="menuitem"
                          tabindex="-1"
                          on:click={() => addToPaletteHandler(palette.uuid)}
                          >{palette.title}</span>
                        <!-- {/if} -->
                      </div>
                    {/each}
                  {/if}
                {:catch}
                  <div
                    role="none"
                    class="block px-4 py-2 text-sm text-gray-500">
                    <span class="block font-bold">No palettes found.</span>
                    <p
                      >You can save collections of paints in a palette for
                      future reference.</p>
                  </div>
                {/await}
                <div class="border-t border-gray-300">
                  <span
                    on:click={() => (showPaletteModal = true)}
                    class="action-link block px-4 py-2 text-sm flex"
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
                        d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Create Palette</span>
                </div>
              </div>
            </div>
          {/if}
        </div>
      {/if}
    </Header>

    {#if paint.swatchCard.length > 0}
      <section
        class="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-6">
        {#each paint.swatchCard as swatchCard}
          <Card
            {swatchCard}
            alignment={checkAlignment(
              swatchCard.imageKitUpload.height,
              swatchCard.imageKitUpload.width,
            )}
            on:notify={setEditableSwatchCard} />
        {/each}
      </section>
    {:else}
      <div
        style="border-color:{paint.hex}"
        class="p-3 grid place-items-center border-2">
        <div class="text-center m-3">
          <div class="mb-4">
            <p class="font-bold text-2xl mb-4">No swatches added yet.</p>

            <p class="text-sm mb-1">
              Have you swatched <span class="font-bold">{paint.name}</span> by {paint
                .manufacturer.name}?
            </p>
            <p class="text-sm">If so, please share!</p>
          </div>

          <div>
            <button
              type="button"
              class="pop inline-flex justify-center px-4 py-2 text-lg"
              on:click={() => (showUploadSwatchModal = true)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-8 w-8 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z"
                  clip-rule="evenodd" />
              </svg>
              Contribute Swatch</button>
          </div>
        </div>
      </div>
    {/if}

    <div class="md:flex">
      <div class="flex-auto">
        <section class="mt-8">
          <h2 class="font-bold text-2xl">Ratings</h2>

          <table
            class="table-fixed border-collapse border border-gray-400 mt-4">
            <tr>
              <th class="text-left border border-gray-400 px-4 py-3"
                >Lightfastness</th>
              <td class="border border-gray-400 px-4 py-3">
                {lightfastRating.label}
                {#if lightfastRating.description}
                  - {lightfastRating.description}
                {/if}
              </td>
            </tr>
            <tr>
              <th class="text-left border border-gray-400 px-4 py-3"
                >Transparency</th>
              <td class="border border-gray-400 px-4 py-3">
                {transparencyRating.label}
                {#if transparencyRating.description}
                  - {transparencyRating.description}
                {/if}
              </td>
            </tr>
            <tr>
              <th class="text-left border border-gray-400 px-4 py-3"
                >Staining</th>
              <td class="border border-gray-400 px-4 py-3">
                {stainingRating.label}
                {#if stainingRating.description}
                  - {stainingRating.description}
                {/if}
              </td>
            </tr>
            <tr>
              <th class="text-left border border-gray-400 px-4 py-3"
                >Granulation</th>
              <td class="border border-gray-400 px-4 py-3">
                {granulationRating.label}
                {#if granulationRating.description}
                  - {granulationRating.description}
                {/if}
              </td>
            </tr>
          </table>
        </section>

        {#if manufacturerDescription}
          <section class="mt-8">
            <h2 class="font-bold text-2xl">Manufacturer Description</h2>
            <span class="text-xs text-gray-500 mt-4 block">
              From {manufacturer.name}:
            </span>
            <div class="mt-2">{@html manufacturerDescription}</div>
          </section>
        {/if}

        {#if communityDescription}
          <section class="mt-8">
            <h2 class="font-bold text-2xl">Community Description</h2>
            <div class="mt-2">{@html communityDescription}</div>
          </section>
        {/if}
      </div>
      <div class="flex-none md:w-96 md:pl-8">
        <Pigments pigmentsOnPaints={paint.pigmentsOnPaints} />
        <!-- <section class="mt-8">
          <h2 class="font-bold text-2xl">Artist Tags</h2>
          <ul class="mt-4">
            {#each tags as tag}
              <li class="inline-block">
                <a
                  class="m-1 py-2 px-3 border border-black"
                  href="{`/tag/${tag.tag.slug}`}">{tag.tag.label}</a>
              </li>
            {/each}
          </ul>
        </section> -->
      </div>
    </div>
    <Notes notes={paint.notes} />
  {:else}
    LOADING!
  {/if}
</div>
