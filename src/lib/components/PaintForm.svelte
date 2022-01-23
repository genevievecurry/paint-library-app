<script lang="ts">
  import { createEventDispatcher, onDestroy } from 'svelte';
  import { warningNotifier } from '$lib/notifier';
  import type { Manufacturer } from '@prisma/client';

  export let line: Line;
  export let manufacturer: Manufacturer;
  export let name: string;
  export let productUrl: string;
  export let hex: string;
  export let published: boolean;

  const dispatch = createEventDispatcher();

  let lineOptions: Promise<Line[]> = getLines();

  let formData = {
    lineId: line?.id,
    name: name,
    hex: hex,
    productUrl: productUrl,
    published: published,
  };

  async function getLines() {
    const response = await fetch(
      `/model/line.json?manufacturerName=${manufacturer.name}`,
    );

    if (response.ok) {
      return response.json();
    } else {
      warningNotifier(
        `There was an error setting line options: ${response.statusText}`,
      );
    }
  }

  function submit() {
    dispatch('success');
    dispatch('paintFormData', formData);
  }

  onDestroy(() => {
    formData = {
      lineId: null,
      name: null,
      hex: null,
      productUrl: null,
      published: null,
    };
  });
</script>

<div>
  <label for="name" class="block">Paint Name </label>
  <div class="mt-1 relative">
    <input
      class="border-2 border-black focus:outline-none focus:ring-lime-500 focus:border-lime-500 block w-full p-2 sm:text-sm"
      id="name"
      name="name"
      bind:value={formData.name} />
  </div>
</div>

<div class="mt-6">
  <span>Representational Color</span>
  <div class="grid grid-cols-2 gap-4 mt-1">
    <div>
      <label for="hex" class="block text-xs mb-1">Hex</label>
      <input
        class="border-2 border-black focus:outline-none focus:ring-lime-500 focus:border-lime-500 block w-full p-2 sm:text-sm"
        id="hex"
        name="hex"
        bind:value={formData.hex} />
    </div>
    <div>
      <label for="hexVis" class="block text-xs mb-1">Visual Select</label>
      <input
        type="color"
        name="hexVis"
        id="hexVis"
        bind:value={formData.hex}
        class="block w-full h-10 border-2 border-black focus:outline-none focus:ring-lime-500 focus:border-lime-500" />
    </div>
  </div>
</div>

<div class="mt-6">
  <label for="productUrl" class="block">Product Url</label>
  <div class="mt-1">
    <input
      class="border-2 border-black focus:outline-none focus:ring-lime-500 focus:border-lime-500 block w-full p-2 pr-10 sm:text-sm"
      type="url"
      id="productUrl"
      name="productUrl"
      bind:value={formData.productUrl} />
  </div>
</div>

<div class="mt-6">
  {#await lineOptions}
    <p>Loading</p>
  {:then lineOpts}
    {#if lineOpts.length > 0}
      <label for="line" class="block"> Line ({manufacturer.name})</label>
      <select
        id="line"
        name="line"
        class="mt-1 block w-full py-2 px-3 border-2 border-black focus:outline-none focus:ring-lime-500 focus:border-lime-500"
        bind:value={formData.lineId}>
        <option value={undefined} />
        {#each lineOpts as lineOption}
          <option value={lineOption.id}>
            {lineOption.name}
          </option>
        {/each}
      </select>
    {/if}
  {:catch error}
    <p>Something went wrong! {error}</p>
  {/await}
</div>

<div class="mt-6">
  <label for="published" class="block">Published</label>

  <div
    class="relative rounded-full w-12 h-6 transition duration-200 ease-linear {formData.published
      ? 'bg-lime-500'
      : 'bg-gray-300'}">
    <label
      for="published"
      class="absolute left-0 bg-white border-2 mb-2 w-6 h-6 rounded-full transition transform duration-100 ease-linear cursor-pointer {formData.published
        ? 'translate-x-full border-lime-500'
        : 'translate-x-0 border-gray-300'}" />
    <input
      type="checkbox"
      id="published"
      name="published"
      class="appearance-none w-full h-full active:outline-none focus:outline-none"
      on:click={() => (formData.published = !formData.published)} />
  </div>
</div>

<div class="mt-6 pt-3 text-right border-t border-gray-400">
  <button on:click={submit} class="pop px-6 py-4 text-2xl hover:text-pink-500">
    Update Paint
  </button>
</div>
