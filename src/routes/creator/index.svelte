<script context="module" lang="ts">
  export async function load({ session }) {
    if (session.user?.role === 'ADMIN' && session.user?.status === 'ACTIVE') {
      return {};
    } else {
      return { redirect: '/', status: 302 };
    }
  }
</script>

<script lang="ts">
  import { successNotifier, warningNotifier } from '$lib/notifier';
  import { connect } from '$lib/utility';
  import { generateUrl } from '$lib/generate';
  import { goto } from '$app/navigation';
  import type { Manufacturer } from '@prisma/client';
  import Header from '$lib/components/Header.svelte';

  let manufacturerPromise: Promise<Manufacturer[]> = getModel('manufacturer');

  let line = {
    id: null,
  };
  let manufacturer = {
    name: '',
    id: null,
  };
  let name: string;
  let productUrl: string;
  let hex = '#ffffff';
  let published = true;

  let lineOptions: Promise<Line[]> = getLines();

  $: formData = {
    line: line,
    manufacturer: manufacturer,
    name: name,
    hex: hex,
    productUrl: productUrl,
    published: published,
  };

  async function getModel(model: string) {
    const response = await fetch(`/model/${model}.json`);

    if (response.ok) {
      return response.json();
    } else {
      warningNotifier(
        `There was an error fetching ${model}: ${response.statusText}`,
      );
    }
  }

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

  async function updateLineOptions() {
    lineOptions = await getLines();
  }

  async function handlePost() {
    const response = await connect({
      method: 'post',
      endpoint: '/paint/create.json',
      data: formData,
    });

    if (response.status == 200) {
      return response.json();
    }

    if (response.status !== 200) {
      warningNotifier(`There was a problem saving: ${response.statusText}.`);
    }
  }

  async function submit(node) {
    const handler = async (event: Event) => {
      event.preventDefault();
      const newPaint = await handlePost();

      if (newPaint.uuid) {
        const url = generateUrl({ prefix: 'paint', target: newPaint });
        goto(url);
        successNotifier('Paint Created');
      }
    };

    node.addEventListener('submit', handler);
    return {
      destroy() {
        node.removeEventListener('submit', handler);
        window.location.reload();
      },
    };
  }
</script>

<div class="container mx-auto mt-8 px-4 sm:px-6">
  <Header title="Add New Paint" />
  <form use:submit class="max-w-xl">
    <div>
      <label for="name" class="block">Paint Name </label>
      <div class="mt-1 relative">
        <input
          class="border-2 border-black focus:outline-none focus:ring-lime-500 focus:border-lime-500 block w-full p-2 sm:text-sm"
          id="name"
          name="name"
          bind:value={name} />
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
            bind:value={hex} />
        </div>
        <div>
          <label for="hexVis" class="block text-xs mb-1">Visual Select</label>
          <input
            type="color"
            name="hexVis"
            id="hexVis"
            bind:value={hex}
            class="block w-full h-10 border-2 border-black focus:outline-none focus:ring-lime-500 focus:border-lime-500" />
        </div>
      </div>
    </div>

    <div class="mt-6">
      <label for="productUrl" class="block"
        >Product Url <span class="text-sm text-gray-400">(Optional)</span
        ></label>
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
      <label for="manufacturerId" class="block"> Manufacturer </label>
      {#await manufacturerPromise}
        <p>Loading manufacturers...</p>
      {:then manufacturers}
        <select
          id="paperManufacturerName"
          name="paperManufacturerName"
          bind:value={manufacturer.name}
          on:change={updateLineOptions}
          class="mt-1 block w-full py-2 px-3 border-2 border-black focus:outline-none focus:ring-lime-500 focus:border-lime-500 bg-teal-50">
          {#each manufacturers as manufacturer}
            <option value={manufacturer.name}>
              {manufacturer.name}
            </option>
          {/each}
        </select>
      {:catch error}
        <p>Something went wrong! {error}</p>
      {/await}
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
            class="mt-1 block w-full py-2 px-3 border-2 border-black focus:outline-none focus:ring-lime-500 focus:border-lime-500 bg-teal-50"
            bind:value={line.id}>
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
        class="relative rounded-full w-12 h-6 transition duration-200 ease-linear {published
          ? 'bg-lime-500'
          : 'bg-gray-300'}">
        <label
          for="published"
          class="absolute left-0 bg-white border-2 mb-2 w-6 h-6 rounded-full transition transform duration-100 ease-linear cursor-pointer {published
            ? 'translate-x-full border-lime-500'
            : 'translate-x-0 border-gray-300'}" />
        <input
          type="checkbox"
          id="published"
          name="published"
          class="appearance-none w-full h-full active:outline-none focus:outline-none"
          on:click={() => (published = !published)} />
      </div>
    </div>

    <div class="mt-6 pt-3 text-right border-t border-gray-400">
      <button type="submit" class="pop px-6 py-4 text-2xl ">
        Create Paint
      </button>
    </div>
  </form>
</div>
