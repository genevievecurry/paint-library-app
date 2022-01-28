<script context="module" lang="ts">
  export async function load({ params, fetch }) {
    const response = await fetch(`/paint/${params.uuid}/${params.slug}.json`);

    if (response.ok) {
      return {
        props: {
          slug: params.slug,
          uuid: params.uuid,
          paintData: await response.json(),
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
  import { afterUpdate, onMount, setContext } from 'svelte';
  import { generateUrl } from '$lib/generate';
  import { connect } from '$lib/utility';
  import { clickOutside } from '$lib/actions';
  import {
    addPaletteIcon,
    chevronRightIcon,
    circleAddIcon,
    circleCheckmarkIcon,
    closeIcon,
    editIcon,
    settingsIcon,
    swatchesIcon,
  } from '$lib/icons';
  import { successNotifier, warningNotifier } from '$lib/notifier';
  import Header from '$lib/components/Header.svelte';
  import Modal from '$lib/components/Modal.svelte';
  import PaletteForm from '$lib/components/PaletteForm.svelte';
  import SwatchUploadForm from '$lib/components/SwatchUploadForm.svelte';
  import PigmentUpdateForm from '$lib/components/PigmentUpdateForm.svelte';
  import RatingsUpdateForm from '$lib/components/RatingsUpdateForm.svelte';
  import SwatchCard from './_SwatchCard.svelte';
  import Pigments from './_Pigments.svelte';
  import Notes from './_Notes.svelte';
  import PaintForm from '$lib/components/PaintForm.svelte';
  import Ratings from './_Ratings.svelte';
  import Spinner from '$lib/components/Spinner.svelte';

  export let slug: string;
  export let uuid: string;
  export let paintData: PaintComponent;

  // Editable baseline
  let editable = false;
  let editableField = '';

  let paint = paintData;
  const headerSubtitle = () => {
    if (paint.line) {
      return `${paint.line.name} by ${paint.manufacturer.name}`;
    } else {
      return paint.manufacturer.name;
    }
  };
  let pigmentsOnPaints = paint.pigmentsOnPaints || [];
  let editableSwatchCard = {};

  // Todo: Update these to paintUuid & paintSlug & updated child components where
  // this data was passed in as prompts to use getContext()
  setContext('uuid', uuid);
  setContext('slug', slug);
  setContext('editable', true);

  let userPalettesPromise: Promise<any>;
  let newlyAddedPalette;

  // Modals
  let showPaletteModal = false;
  let showUploadSwatchModal = false;
  let showPigmentUpdateModal = false;
  let showRatingsUpdateModal = false;
  let showPaintUpdateModal = false;

  // Menu
  let addToPaletteMenuOpen = false;
  let editMenuOpen = false;

  onMount(() => {
    editable = $session.user?.role === 'ADMIN';
  });

  afterUpdate(() => {
    if (editable) {
      pigmentsOnPaints = paint.pigmentsOnPaints;
    }
  });

  function orderSwatchCards() {
    const primaryId = paint?.primarySwatchCard?.id;
    if (primaryId) {
      const initialIndex = paint.swatchCard.findIndex(
        (card) => card.id === primaryId,
      );
      paint.swatchCard.unshift(paint.swatchCard.splice(initialIndex, 1)[0]);
    }
  }

  orderSwatchCards();

  let formData = {
    published: paint.published,
    manufacturerDescription: paint.manufacturerDescription,
    communityDescription: paint.communityDescription,
    name: paint.name,
    productUrl: paint.productUrl,
    hex: paint.hex,
    lineId: paint.line ? paint.line.id : null,
    lightfastRatingId: paint.lightfastRating.id,
    transparencyRatingId: paint.transparencyRating.id,
    stainingRatingId: paint.stainingRating.id,
    granulationRatingId: paint.granulationRating.id,
  };

  const checkAlignment = (height, width) => {
    if (height === width || !height || !width) {
      return 'square';
    }
    if (height > width) {
      return 'vertical';
    }
    if (height < width) {
      return 'horizontal';
    }
  };

  async function refreshIt() {
    const response = await fetch(`/paint/${paint.uuid}/${paint.slug}.json`);

    if (response.ok) {
      return response.json();
    } else {
      warningNotifier(`There was an error fetching: ${response.statusText}`);
    }
  }

  async function refresh({ notify, message }) {
    let updatedPaint = await refreshIt();
    paint = updatedPaint;
    orderSwatchCards();
    updatedPaint = null;

    if (notify) {
      if (!message) message = 'Changes saved successfully.';
      successNotifier(message);
    }
  }

  function checkPaletteStatus(palette) {
    const matchUuid = (paintInPalette) =>
      paintInPalette.paint.uuid === paint.uuid;

    return palette.paintsInPalette.some(matchUuid);
  }

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
    } else {
      warningNotifier(response.statusText);
    }
  }

  async function addToPaletteHandler(paletteUuid) {
    newlyAddedPalette = await addToPalette(paletteUuid);

    if (newlyAddedPalette.uuid) {
      const url = generateUrl({
        prefix: 'palette',
        target: newlyAddedPalette,
      });
      successNotifier(
        `Added <span class="font-bold">${paint.name}</span> to
        <a href="${url}" class="underline">${newlyAddedPalette.title}</a>`,
        { persist: true },
      );
    }
  }

  async function getUserPalettes() {
    const url = `/@${$session.user.username}/palettes.json`;
    const response = await fetch(url);

    if (response.status == 200) {
      return response.json();
    } else {
      warningNotifier(response.statusText);
    }
  }

  async function fetchPalettes() {
    userPalettesPromise = getUserPalettes();
  }

  function setEditableSwatchCard(event) {
    editableSwatchCard = event.detail;
    showUploadSwatchModal = true;
  }

  function toggleEditableField(field) {
    if (editableField === field) {
      // On click cancel, reset these vars
      editableField = '';
      formData.communityDescription = paint.communityDescription;
      formData.manufacturerDescription = paint.manufacturerDescription;
    } else {
      // Set the current field as editable
      editableField = field;
    }
  }

  function handleEditUpdate(event = null) {
    // Close Modals
    showUploadSwatchModal = false;
    showPigmentUpdateModal = false;
    showRatingsUpdateModal = false;
    showPaintUpdateModal = false;
    showPaletteModal = false;

    // Close Editable Field
    editableField = '';

    // Refresh data
    refresh({ notify: true, message: event ? event.detail : null });
  }

  function handleFormUpdate(incomingFormData) {
    const incomingData = incomingFormData.detail;
    formData = Object.assign(formData, incomingData);
    handlePost();
  }

  async function updateEditableField() {
    const response = await handlePost();

    if (response?.uuid) {
      handleEditUpdate();
    }
  }

  async function handlePost() {
    const response = await connect({
      method: 'post',
      endpoint: `/paint/${paint.uuid}/${paint.slug}.json`,
      data: formData,
    });

    if (response.status == 200) {
      return response.json();
    }

    if (response.status !== 200) {
      warningNotifier(`There was a problem saving: ${response.statusText}.`);
    }
  }
</script>

<svelte:head>
  <title>{paint.name} by {paint.manufacturer.name} - Paint Library</title>
</svelte:head>

{#if showPaintUpdateModal && editable}
  <Modal
    title="Update Paint Details"
    form={true}
    on:close={() => (showPaintUpdateModal = false)}>
    <div class="col-span-12">
      <PaintForm
        on:paintFormData={handleFormUpdate}
        on:success={() => refresh({ notify: false, message: '' })}
        on:success={handleEditUpdate}
        published={paint.published}
        name={paint.name}
        manufacturer={paint.manufacturer}
        hex={paint.hex}
        productUrl={paint.productUrl}
        line={paint.line} />
    </div>
  </Modal>
{/if}

{#if showRatingsUpdateModal && editable}
  <Modal
    title="Manage Ratings"
    form={true}
    on:close={() => (showRatingsUpdateModal = false)}>
    <div class="col-span-12">
      <RatingsUpdateForm
        on:ratingFormData={handleFormUpdate}
        on:update={() => refresh({ notify: false, message: '' })}
        on:update={handleEditUpdate}
        lightfastRating={paint.lightfastRating}
        transparencyRating={paint.transparencyRating}
        stainingRating={paint.stainingRating}
        granulationRating={paint.granulationRating} />
    </div>
  </Modal>
{/if}

{#if showPigmentUpdateModal && editable}
  <Modal
    title="Manage Pigments"
    fullWidth={true}
    form={true}
    on:close={() => (showPigmentUpdateModal = false)}>
    <div class="col-span-12">
      <PigmentUpdateForm
        on:update={handleEditUpdate}
        {pigmentsOnPaints}
        paintUuid={paint.uuid}
        paintSlug={paint.slug} />
    </div>
  </Modal>
{/if}

{#if showPaletteModal && editable}
  <Modal on:close={() => (showPaletteModal = false)} title="Create New Palette">
    <div class="col-span-12">
      <PaletteForm paintUuid={paint.uuid} on:update={handleEditUpdate} />
    </div>
  </Modal>
{/if}

{#if showUploadSwatchModal}
  <Modal
    title={editableSwatchCard?.id ? 'Edit Swatch' : 'Contribute Swatch'}
    form={true}
    on:close={() => (showUploadSwatchModal = false)}
    on:close={() => (editableSwatchCard = {})}>
    <div class="col-span-12">
      <SwatchUploadForm
        on:success={handleEditUpdate}
        swatchCardCount={paint._count.swatchCard}
        paintUuid={paint.uuid}
        swatchCard={editableSwatchCard} />
    </div>
  </Modal>
{/if}

<div class="lg:container mx-auto px-4 sm:px-6">
  {#if paint}
    <Header
      title={paint.name}
      subtitle={headerSubtitle()}
      description={null}
      owner={null}>
      {#if $session?.user}
        <div class="relative inline-block text-left">
          <div class="lg:mr-2 inline">
            <button
              type="button"
              title="Contribute Swatch"
              aria-label="Contribute Swatch"
              class="pop inline-flex justify-center p-2 lg:px-3 lg:py-1 text-sm"
              on:click={() => (showUploadSwatchModal = true)}>
              {@html swatchesIcon('h-5 w-5')}
              <span class="hidden lg:inline-block ml-1">Contribute Swatch</span>
            </button>
          </div>
          <div
            class="lg:mr-2 inline"
            use:clickOutside={{
              enabled: addToPaletteMenuOpen,
              cb: () => (addToPaletteMenuOpen = false),
            }}>
            <button
              type="button"
              title="Add to Palette"
              aria-label="Add to Palette"
              class="pop inline-flex justify-center p-2 lg:px-3 lg:py-1 text-sm"
              id="menu-button"
              aria-expanded={addToPaletteMenuOpen}
              aria-haspopup="true"
              on:click={() => (addToPaletteMenuOpen = true)}
              on:click={fetchPalettes}>
              {@html addPaletteIcon('h-5 w-5')}
              <span class="hidden lg:inline-block ml-1">Add to Palette</span>
            </button>
          </div>
          {#if addToPaletteMenuOpen}
            <div
              class="transition ease-out duration-100 {addToPaletteMenuOpen
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-95'} z-10 border-2 border-black origin-top-right absolute right-0 mt-2 w-72 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
              tabindex="-1">
              <div role="none">
                {#await userPalettesPromise then value}
                  {#if value?.ownedPalettes}
                    {#each value.ownedPalettes as palette}
                      <div class="p-2 text-sm relative">
                        {#if checkPaletteStatus(palette)}
                          <div
                            class="absolute left-1 translate -translate-y-1/2 top-1/2 text-lime-600">
                            {@html circleCheckmarkIcon()}
                          </div>
                          <a
                            href="/palette/{palette.uuid}/{palette.slug}"
                            class="link inline-block px-7 w-full"
                            >{palette.title}
                            <div
                              class="absolute right-1 -translate-y-1/2 top-1/2">
                              {@html chevronRightIcon('h-4 w-4 ml-2')}
                            </div></a>
                        {:else}
                          <div
                            class="absolute left-1 translate -translate-y-1/2 top-1/2">
                            {@html circleAddIcon()}
                          </div>
                          <span
                            class="font-medium text-black hover:text-cyan-600 transition-colors cursor-pointer inline-block px-7 w-full"
                            role="menuitem"
                            tabindex="-1"
                            on:click={() => addToPaletteHandler(palette.uuid)}
                            >{palette.title}
                          </span>
                        {/if}
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
                <div
                  on:click={() => (showPaletteModal = true)}
                  role="menuitem"
                  tabindex="-1"
                  class="border-t border-gray-300 py-2 px-2 cursor-pointer col-span-2 text-center">
                  <span class="">Create New Palette</span>
                </div>
              </div>
            </div>
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
                  class="pop inline-flex justify-center p-2 lg:px-3 lg:py-1 text-sm {editMenuOpen
                    ? 'active'
                    : ''}"
                  id="menu-button"
                  aria-expanded={editMenuOpen}
                  aria-haspopup="true"
                  on:click={() => (editMenuOpen = true)}>
                  {@html settingsIcon('h-5 w-5')}
                  <span class="hidden lg:inline-block ml-1">Settings</span>
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
                  <div
                    on:click={() => (showPaintUpdateModal = true)}
                    class="block px-4 py-2 text-sm cursor-pointer"
                    role="menuitem"
                    tabindex="-1">
                    <span class="decorate-link">Update Paint Details</span>
                  </div>
                  <div
                    on:click={() => (showRatingsUpdateModal = true)}
                    class="block px-4 py-2 text-sm cursor-pointer"
                    role="menuitem"
                    tabindex="-1">
                    <span class="decorate-link">Manage Ratings</span>
                  </div>
                  <div
                    on:click={() => (showPigmentUpdateModal = true)}
                    class="block px-4 py-2 text-sm cursor-pointer"
                    role="menuitem"
                    tabindex="-1">
                    <span class="decorate-link">Manage Pigments</span>
                  </div>
                  <!-- <div
                    class="block px-4 pb-2 pt-2 text-sm border-t border-gray-300">
                    <span
                      class="decorate-link cursor-pointer"
                      role="menuitem"
                      tabindex="-1"
                      on:click={() => (showPaintUpdateModal = true)}
                      >Delete Paint</span>
                  </div> -->
                </div>
              {/if}
            </div>
          {/if}
        </div>
      {/if}
    </Header>

    {#if paint?.swatchCard.length > 0}
      <section
        class="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-6">
        {#each paint.swatchCard as swatchCard}
          <SwatchCard
            paintUuid={paint.uuid}
            paintName={paint.name}
            paintHex={paint.hex}
            {swatchCard}
            alignment={checkAlignment(
              swatchCard?.imageKitUpload?.height,
              swatchCard?.imageKitUpload?.width,
            )}
            on:deleteCard={handleEditUpdate}
            on:setSwatchCard={setEditableSwatchCard} />
        {/each}
      </section>
    {:else}
      <div
        style="border-color:{paint.hex}; background-color: {paint.hex}22"
        class="p-3 grid place-items-center border-2">
        <div class="text-center m-3">
          <div>
            <p class="font-bold text-2xl">No swatches added yet.</p>

            {#if $session.user}
              <p class="text-sm mb-1 mt-4">
                Have you swatched <span class="font-bold">{paint.name}</span> by {paint
                  .manufacturer.name}?
              </p>
              <p class="text-sm">If so, please share!</p>
            {/if}
          </div>

          {#if $session.user}
            <div class="mt-4">
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
          {/if}
        </div>
      </div>
    {/if}

    <div class="grid grid-cols-1 lg:grid-cols-3 lg:gap-10">
      <div class="col-span-2">
        <section class="mt-8">
          <div class="flex justify-start items-center">
            <h2 class="font-bold text-2xl">Ratings</h2>
            {#if editable}
              <button
                aria-label="Manage Ratings"
                title="Manage Ratings"
                on:click={() => (showRatingsUpdateModal = true)}
                class="pop inline-flex justify-center ml-3 p-1 text-sm {showRatingsUpdateModal
                  ? 'text-pink-600'
                  : 'text-black'}">
                {@html editIcon('h-5 w-5')}
              </button>
            {/if}
          </div>
          <Ratings {paint} />
        </section>
      </div>
      <div class="col-span-1">
        <section class="mt-8">
          <div class="flex justify-start items-center">
            <h2 class="font-bold text-2xl">Pigments</h2>
            {#if editable}
              <button
                aria-label="Manage Pigments"
                title="Manage Pigments"
                on:click={() => (showPigmentUpdateModal = true)}
                class="pop inline-flex justify-center ml-3 p-1 text-sm {showPigmentUpdateModal
                  ? 'text-pink-600'
                  : 'text-black'}">
                {@html editIcon('h-5 w-5')}
              </button>
            {/if}
          </div>
          <Pigments {pigmentsOnPaints} />
        </section>
      </div>
      <div class="col-span-2">
        {#if paint.manufacturerDescription || editable}
          <section class="mt-8">
            <div class="flex justify-start items-center">
              <h2 class="font-bold text-2xl">Manufacturer Description</h2>
              {#if editable}
                <button
                  aria-label="Update Manufacturer Description"
                  title="Update Manufacturer Description"
                  disabled={editableField !== '' &&
                    editableField !== 'manufacturerDescription'}
                  on:click={() =>
                    toggleEditableField('manufacturerDescription')}
                  class="pop inline-flex justify-center p-1 text-sm ml-3 {editableField ===
                  'manufacturerDescription'
                    ? 'text-pink-600 pr-2'
                    : 'text-black'}">
                  {@html editableField === 'manufacturerDescription'
                    ? closeIcon('h-5 w-5')
                    : editIcon('h-5 w-5')}
                  {editableField === 'manufacturerDescription' ? 'Cancel' : ''}
                </button>
              {/if}
            </div>
            {#if editableField === 'manufacturerDescription'}
              <div class="mt-2 mr-1">
                <label
                  for="manufacturerDescription"
                  class="block text-sm text-gray-500 font-light">
                  This should be directly pulled from {paint.manufacturer
                    .name}'s description of the paint.</label>
                <textarea
                  maxlength="1000"
                  id="manufacturerDescription"
                  name="manufacturerDescription"
                  bind:value={formData.manufacturerDescription}
                  class="mt-2 block w-full py-2 px-3 border-2 border-black focus:outline-none focus:ring-lime-500 focus:border-lime-500" />
              </div>

              <div class="mt-2 text-right">
                <button
                  aria-label="Save"
                  title="Save"
                  on:click={() => updateEditableField()}
                  class="pop px-4 py-3 text-xl hover:text-pink-500">
                  Save Changes
                </button>
              </div>
            {:else if paint.manufacturerDescription}
              <span class="text-xs text-gray-500 mt-4 block">
                From {paint.manufacturer.name}:
              </span>
              <div class="mt-2">{paint.manufacturerDescription}</div>
            {:else}
              <p class="my-4 text-gray-500 font-light"
                >No manufacturer description added yet.
              </p>
              <p class="text-gray-500 font-light text-sm"
                >This should be directly pulled from {paint.manufacturer.name}'s
                description of the paint.</p>
            {/if}
          </section>
        {/if}
        {#if paint.communityDescription || editable}
          <section class="mt-8">
            <div class="flex justify-start items-center">
              <h2 class="font-bold text-2xl">Community Description</h2>
              {#if editable}
                <button
                  aria-label="Update Community Description"
                  title="Update Community Description"
                  disabled={editableField !== '' &&
                    editableField !== 'communityDescription'}
                  on:click={() => toggleEditableField('communityDescription')}
                  class="pop inline-flex justify-center p-1 text-sm ml-3 {editableField ===
                  'communityDescription'
                    ? 'text-pink-600 pr-2'
                    : 'text-black'}">
                  {@html editableField === 'communityDescription'
                    ? closeIcon('h-5 w-5')
                    : editIcon('h-5 w-5')}
                  {editableField === 'communityDescription' ? 'Cancel' : ''}
                </button>
              {/if}
            </div>
            {#if editableField === 'communityDescription'}
              <div class="mt-2 mr-1">
                <label
                  for="communityDescription"
                  class="block text-sm font-light text-gray-500">
                  This should be a thoughtful, albiet unofficial, description of
                  this particular paint.</label>
                <textarea
                  maxlength="1000"
                  id="communityDescription"
                  name="communityDescription"
                  bind:value={formData.communityDescription}
                  class="mt-2 block w-full py-2 px-3 border-2 border-black focus:outline-none focus:ring-lime-500 focus:border-lime-500" />
              </div>

              <div class="mt-2 text-right">
                <button
                  aria-label="Save"
                  title="Save"
                  on:click={() => updateEditableField()}
                  class="pop px-4 py-3 text-xl hover:text-pink-500">
                  Save Changes
                </button>
              </div>
            {:else if paint.communityDescription}
              <div class="mt-2">{paint.communityDescription}</div>
            {:else}
              <p class="my-4 text-gray-500 font-light"
                >No community description added yet.
              </p>
              <p class="text-gray-500 font-light text-sm"
                >This should be a thoughtful, albiet unofficial, description of
                this particular paint.</p>
            {/if}
          </section>
        {/if}

        <Notes
          notes={paint.notes}
          paintUuid={paint.uuid}
          on:update={() => refresh({ notify: false })}
          on:update={handleEditUpdate} />
      </div>
    </div>
  {:else}
    <Spinner />
  {/if}
</div>
