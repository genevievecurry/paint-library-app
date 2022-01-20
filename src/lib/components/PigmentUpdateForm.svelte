<script lang="ts">
  import PigmentPreview from './PigmentPreview.svelte';
  import { createEventDispatcher, onDestroy, onMount } from 'svelte';
  import { clickOutside } from '$lib/actions';
  import { connect } from '$lib/utility';
  import { successNotifier, warningNotifier } from '$lib/notifier';
  import { goto } from '$app/navigation';

  export let pigmentsOnPaints;
  export let paintUuid;
  export let paintSlug;

  const dispatch = createEventDispatcher();
  const success = () => dispatch('success');

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
    const res = await fetch(`/model/pigment.json`);

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

  function submit(node: HTMLFormElement): SvelteActionReturnType {
    const handler = async (event: Event) => {
      event.preventDefault();
      const response = await handlePost();

      if (response?.uuid) {
        success();
      }
    };
    node.addEventListener('submit', handler);

    return {
      update() {},
      destroy() {
        node.removeEventListener('submit', handler);
      },
    };
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

<form use:submit>
  <div class="pigment-form grid grid-cols-4 gap-5 w-full">
    <div class="col-span-4 xl:col-span-3">
      <div class="w-full flex justify-between">
        <h3 class="font-bold text-lg">Options</h3>
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
    <button type="submit" class="pop px-6 py-4 text-2xl hover:text-pink-500">
      Save Pigments
    </button>
  </div>
</form>

<style>
  .pigment-form {
    height: calc(100vh - 20rem);
    overflow-y: scroll;
  }

  .selected {
    @apply font-bold;
  }
</style>
