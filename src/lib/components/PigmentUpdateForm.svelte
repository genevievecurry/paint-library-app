<script lang="ts">
  import PigmentPreview from './PigmentPreview.svelte';
  import { createEventDispatcher, onDestroy, onMount } from 'svelte';
  import { clickOutside } from '$lib/actions';
  import { connect } from '$lib/utility';
  import { warningNotifier } from '$lib/notifier';
  import { closeIcon, searchIcon, settingsIcon } from '$lib/icons';

  export let pigmentsOnPaints;
  export let paintUuid;
  export let paintSlug;

  const dispatch = createEventDispatcher();

  let query;

  let emptyColor = {
    id: null,
    label: null,
    slug: null,
    code: null,
  };

  $: selectedColor = {
    id: null,
    label: null,
    slug: null,
    code: null,
  };

  $: colorOptions = [];
  $: pigmentOptions = [];
  $: pigmentSelections = [];
  $: formData = [];
  $: colorFilterOpen = false;
  $: showAllColorOptions = true;

  function handleEnterPress(event) {
    if (event.key === 'Enter') {
      handleIncomingPigmentSelections();
    }
  }

  async function getColorOptions() {
    const res = await getColors();
    if (res) {
      colorOptions = res;
      return true;
    }
  }

  async function getPigmentOptions() {
    const res = await getPigments();
    if (res) {
      pigmentOptions = res;
      return true;
    }
  }

  onMount(() => {
    pigmentSelections = pigmentsOnPaints.map((pop) => {
      pop.pigment.colorCode = pop.pigment.color.code;
      return pop.pigment;
    });

    handleIncomingPigmentSelections();
  });

  async function handleIncomingPigmentSelections() {
    const optionsSet = await getPigmentOptions();
    const colorsSet = await getColorOptions();

    // Filter already selected pigments out of the pigment options array
    if (optionsSet && colorsSet) {
      const diff = pigmentOptions.filter(
        (pigmentOption) =>
          !pigmentSelections.filter(
            (pigmentSelection) => pigmentSelection.id === pigmentOption.id,
          ).length,
      );
      pigmentOptions = diff;
      updateFormData();
    }
  }

  async function getColors() {
    const res = await fetch('/model/color.json');

    if (res.ok) {
      return res.json();
    }
  }

  async function getPigments() {
    let url = '/pigments.json';
    if (query) {
      url = `/pigments.json?query=${query}`;
    }

    const res = await fetch(url);

    if (res.ok) {
      return res.json();
    }
  }

  function updateFormData() {
    formData = [];
    pigmentSelections.map((pigmentSelection) => {
      formData.push({
        pigmentId: pigmentSelection.id,
      });
    });
  }

  function addPigmentToSelection(event) {
    // remove from options
    const options = pigmentOptions.filter(
      (option) => option.id !== event.detail.id,
    );
    pigmentOptions = options;

    // add to selection
    pigmentSelections.push(event.detail);
    pigmentSelections = pigmentSelections;
    updateFormData();
  }

  function removePigmentFromSelection(event) {
    // remove from selection
    const selections = pigmentSelections.filter(
      (selection) => selection.id !== event.detail.id,
    );
    pigmentSelections = selections;
    updateFormData();

    // add to options
    pigmentOptions.push(event.detail);
    pigmentOptions = pigmentOptions.sort((a, b) => a.id - b.id);
  }

  async function handlePost() {
    const response = await connect({
      method: 'post',
      endpoint: `/paint/${paintUuid}/${paintSlug}.json`,
      data: {
        updatePigments: formData,
      },
    });

    if (response.status == 200) {
      return response.json();
    }

    if (response.status !== 200) {
      warningNotifier(
        `There was a problem updating pigments: ${response.statusText}.`,
      );
    }
  }

  async function submit() {
    const response = await handlePost();

    if (response?.uuid) {
      dispatch('update', 'Pigments have been saved.');
    }
  }

  onDestroy(() => {
    colorOptions = [];
    pigmentOptions = [];
    pigmentSelections = [];
    formData = [];
    colorFilterOpen = false;
    showAllColorOptions = true;
  });
</script>

<div class="pigment-form grid grid-cols-4 gap-5 w-full">
  <div class="col-span-4 xl:col-span-3">
    <div class="w-full flex justify-between">
      <div class="flex border-2 border-black bg-teal-50 ml-1 mr-6">
        <button
          class="py-2 px-1 {query ? 'visible' : 'invisible'}"
          on:click={() => (query = '')}
          on:click={handleIncomingPigmentSelections}>
          {@html closeIcon('h-4 w-4')}
        </button>
        <input
          placeholder="Search Pigments"
          class="px-2"
          bind:value={query}
          on:keypress={handleEnterPress} />

        <button on:click={handleIncomingPigmentSelections} class="py-2 px-1">
          {@html searchIcon('h-5 w-5')}
        </button>
      </div>

      <div>
        <button
          class="inline-flex items-center px-2 py-1 text-sm {selectedColor.label
            ? 'visible'
            : 'invisible'}"
          on:click={() => (selectedColor = emptyColor)}
          on:click={() => (showAllColorOptions = true)}>
          {@html closeIcon('h-4 w-4')}
          <span>{selectedColor.label ? selectedColor.label : ''}</span>
        </button>

        <div class="relative inline-block text-right">
          <div
            use:clickOutside={{
              enabled: colorFilterOpen,
              cb: () => (colorFilterOpen = false),
            }}>
            <button
              type="button"
              class="pop inline-flex justify-center px-2 py-1 text-sm {colorFilterOpen
                ? 'active'
                : ''}"
              id="menu-button"
              aria-expanded={colorFilterOpen}
              aria-haspopup="true"
              on:click={() => (colorFilterOpen = true)}>
              {@html settingsIcon('h-5 w-5 mr-1')}

              <span>Filter Colorways</span>
            </button>
          </div>
          {#if colorFilterOpen}
            <div
              class="transition ease-out duration-100 {colorFilterOpen
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-95'} z-10 border-2 border-black origin-top-right absolute right-0 mt-2 w-48 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none grid grid-cols-2"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
              tabindex="-1">
              {#if showAllColorOptions === false}
                <div
                  class:selected={selectedColor.code === null}
                  on:click={() => (selectedColor = emptyColor)}
                  on:click={() => (showAllColorOptions = true)}
                  class="py-2 px-2 cursor-pointer col-span-2 text-center border-b border-gray-300"
                  role="menuitem"
                  tabindex="-1">
                  <span class="">Show all</span>
                </div>
              {/if}
              {#if colorOptions.length > 0}
                {#each colorOptions as color}
                  <span
                    class:selected={selectedColor.code === color.code}
                    on:click={() => (selectedColor = color)}
                    on:click={() => (showAllColorOptions = false)}
                    class="flex py-2 px-2 items-center cursor-pointer"
                    role="menuitem"
                    tabindex="-1">
                    <div
                      class="h-4 w-4 mr-2"
                      style="background-color: {color.hex};" />
                    {color.label}
                  </span>
                {/each}
              {/if}
            </div>
          {/if}
        </div>
      </div>
    </div>

    <div class="p-1 mt-3">
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-2">
        {#if pigmentOptions.length > 0}
          {#each pigmentOptions as pigmentOption}
            {#if pigmentOption.colorCode === selectedColor.code || showAllColorOptions}
              <PigmentPreview
                selected={false}
                pigment={pigmentOption}
                on:select={addPigmentToSelection} />
            {/if}
          {/each}
        {/if}
      </div>
    </div>
  </div>
  <!-- These are the pigments that are or will be attached to the paint on submit -->
  <div class="col-span-4 xl:col-span-1 p-3 border-2 border-black mt-1">
    <h3 class="font-bold text-lg">Current Pigments</h3>
    <div class="mt-4">
      {#each pigmentSelections as pigmentSelection}
        <PigmentPreview
          selected={true}
          pigment={pigmentSelection}
          on:select={removePigmentFromSelection} />
      {/each}
    </div>
  </div>
</div>

<div class="mt-6 pt-3 text-right border-t border-gray-400">
  <button on:click={submit} class="pop px-6 py-4 text-2xl hover:text-pink-500">
    Save Pigments
  </button>
</div>

<style>
  .pigment-form {
    height: calc(100vh - 20rem);
    overflow-y: scroll;
  }

  .selected {
    @apply font-bold;
  }
</style>
