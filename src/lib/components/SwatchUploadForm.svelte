<script lang="ts">
  import type { Manufacturer } from '@prisma/client';

  import { createEventDispatcher, onDestroy } from 'svelte';
  import { session } from '$app/stores';
  import { successNotifier, warningNotifier } from '$lib/notifier';
  import { connect } from '$lib/utility';
  import imagekit from '$lib/config/imagekit';

  import Dropzone from './Dropzone.svelte';

  export let swatchCardCount: number;
  export let paintUuid: string;
  export let swatchCard: SwatchCardComponent = null;

  let editMode = swatchCard?.id;
  let initialSwatchCardNames = [];
  // Form data
  let setAsPrimary =
    swatchCard.primaryOnPaintUuid || swatchCardCount === 0 ? true : false;
  let isOriginal = swatchCard?.isOriginal || false;
  let disableSetAsPrimary = swatchCardCount === 0;
  let author = swatchCard?.author || $session.user;
  let id = swatchCard?.id;
  let paperManufacturer = {
    name: swatchCard?.paperManufacturer?.name,
    id: swatchCard?.paperManufacturer?.id,
  };
  let paperType = {
    name: swatchCard?.paperType?.name,
    id: swatchCard?.paperType?.id,
  };
  let paperLine = {
    name: swatchCard?.paperLine?.name,
    id: swatchCard?.paperLine?.id,
  };
  let paperWeightInLbs = swatchCard?.paperWeightInLbs;
  let swatchCardNamesAdded = [];
  let swatchCardNamesRemoved = [];
  let tags = swatchCard?.tags || [];
  let imageKitUpload = {
    fileId: swatchCard?.imageKitUpload?.fileId,
    filePath: swatchCard?.imageKitUpload?.filePath,
    name: swatchCard?.imageKitUpload?.name,
    thumbnailUrl: swatchCard?.imageKitUpload?.thumbnailUrl,
    url: swatchCard?.imageKitUpload?.url,
    height: swatchCard?.imageKitUpload?.height,
    width: swatchCard?.imageKitUpload?.width,
  };
  let description = swatchCard?.description;

  // Promises
  let swatchTypesPromise: Promise<any> = getModel('swatchCardType', '');
  let manufacturerPromise: Promise<Manufacturer[]> = getModel(
    'manufacturer',
    '?sellPaper=true',
  );
  let paperTypePromise: Promise<PaperType[]> = getModel('paperType', '');
  let lineOptions: Promise<Line[]> = getLines();

  const maxSizeInMb = 3.5;
  let swatchCardNames = [];
  let userImageUpload: any;
  let endpoint: string, action: string;
  let dropzoneError = '';
  let fileName = '';

  if (imageKitUpload.name !== undefined) {
    fileName = imageKitUpload.name;
  }

  const dispatch = createEventDispatcher();
  const success = () => dispatch('success');

  if (swatchCard?.swatchCardTypesOnSwatchCard) {
    swatchCard.swatchCardTypesOnSwatchCard.map((elem) => {
      initialSwatchCardNames.push(elem.swatchCardType.name);
      swatchCardNames.push(elem.swatchCardType.name);
    });

    updateSwatchCardNames();
  }

  if (id !== undefined) {
    action = 'Update';
    endpoint = `/paint/${paintUuid}/swatch.json`;
  } else {
    action = 'Contribute';
    endpoint = `/paint/${paintUuid}/swatch.json`;
  }

  $: formData = {
    author,
    id,
    paperManufacturer,
    paperWeightInLbs,
    paperLine,
    paperType,
    swatchCardNamesAdded,
    swatchCardNamesRemoved,
    tags,
    imageKitUpload,
    description,
    setAsPrimary,
    isOriginal,
  };

  $: lineOptions = [];

  function updateSwatchCardNames() {
    if (editMode) {
      swatchCardNamesRemoved = [];
      initialSwatchCardNames.map((name) => {
        if (!swatchCardNames.includes(name)) {
          swatchCardNamesRemoved.push({ swatchCardTypeName: name });
        }
      });
    }
    swatchCardNamesAdded = [];
    swatchCardNames.map((name) => {
      if (editMode) {
        if (!initialSwatchCardNames.includes(name)) {
          swatchCardNamesAdded.push({ swatchCardTypeName: name });
        }
      } else {
        swatchCardNamesAdded.push({ swatchCardTypeName: name });
      }
    });
  }

  async function updateLineOptions() {
    lineOptions = await getLines();
  }

  // todo... maybe utility?
  async function getModel(model: string, options: string) {
    const res = await fetch(`/model/${model}.json${options}`);

    if (res.ok) {
      return res.json();
    }
  }

  async function getLines() {
    let url;
    if (paperManufacturer?.name) {
      url = `/model/line.json?manufacturerName=${encodeURIComponent(
        paperManufacturer.name,
      )}`;
    } else {
      url = '/model/line.json';
    }

    const res = await fetch(url);

    if (res.ok) {
      return res.json();
    }
  }

  async function uploadImage() {
    imagekit.upload(
      {
        file: userImageUpload,
        fileName: userImageUpload.name,
        useUniqueFileName: true,
      },
      function (err, result) {
        if (err === null) {
          imageKitUpload = result;
        } else {
          warningNotifier(err.message);
        }
      },
    );
  }

  async function handlePost() {
    const response = await connect({
      method: 'post',
      endpoint: endpoint,
      data: formData,
    });

    if (response.status == 200) {
      return response.json();
    }
    if (response.status !== 200) {
      warningNotifier(response.statusText);
    }
  }

  onDestroy(() => {
    userImageUpload = null;
    dropzoneError = '';
    fileName = '';
  });

  const onChange = (e) => {
    // Just to be real transparent here
    const maxSizeInBytes = maxSizeInMb * 1000 * 1000;

    const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    fileName = file.name;
    userImageUpload = file;

    const fileSizeInKb = Math.round((file.size - maxSizeInBytes) / 1000);
    const fileSizeInMb = Number(
      (file.size - maxSizeInBytes) / 1000 / 1000,
    ).toFixed(1);

    if (file.size > maxSizeInBytes) {
      userImageUpload = null;

      dropzoneError = `Sorry, the file you chose is ${
        Number(fileSizeInMb) < 1 ? `${fileSizeInKb} KB` : `${fileSizeInMb} MB`
      } too large for the ${maxSizeInMb} MB limit.`;
    } else {
      uploadImage();
    }
  };

  function submit(node: HTMLFormElement): SvelteActionReturnType {
    const handler = async (event: Event) => {
      event.preventDefault();
      const response = await handlePost();

      if (response?.id) {
        successNotifier(`Hoorah! Swatch was ${action}d successfully.`);
        success();
      }
    };
    node.addEventListener('submit', handler);

    return {
      update() {},
      destroy() {
        node.removeEventListener('submit', handler);
        // window.location.reload();
      },
    };
  }
</script>

<form use:submit>
  <div>
    {#if editMode}
      <div class="mt-1">
        <p class="font-bold text-lg">Swatch Preview</p>
        <p class="text-xs md:text-sm font-light text-gray-500 my-3"
          >For now, it is not possible to update the swatch image directly after
          upload.</p>
        <div class="text-left mt-3">
          <img src={imageKitUpload.thumbnailUrl} alt="Swatch Preview" />
        </div>
      </div>
    {:else}
      <Dropzone
        title="Drag and drop your swatch from your computer; or"
        fileTitle={fileName}
        error={userImageUpload === null ? dropzoneError : ''}
        imagePreview={imageKitUpload?.thumbnailUrl}
        {maxSizeInMb}
        bind:this={userImageUpload}
        on:drop={onChange}
        on:change={onChange} />
    {/if}

    {#if imageKitUpload.thumbnailUrl || editMode}
      <div class="mt-6">
        <label for="description" class="block font-bold text-lg">
          Is this your original work?</label>
        <small
          class="block mt-1 text-xs md:text-sm font-light text-gray-500 mb-3">
          Did you personally meld paint and paper in a beautiful union? It's
          okay if you didn't, but make sure you give credit where credit is due
          in the further information section below.
        </small>
        <label for="isOriginal" class="flex">
          <div
            class="relative rounded-full w-12 h-6 transition duration-200 ease-linear {isOriginal
              ? 'bg-green-400'
              : 'bg-gray-400'}">
            <div
              class="absolute left-0 bg-white border-2 mb-2 w-6 h-6 rounded-full transition transform duration-100 ease-linear cursor-pointer {isOriginal
                ? 'translate-x-full border-green-400'
                : 'translate-x-0 border-gray-400'}" />
            <input
              type="checkbox"
              id="isOriginal"
              name="isOriginal"
              class="appearance-none w-full h-full active:outline-none focus:outline-none"
              on:click={() => (isOriginal = !isOriginal)} />
          </div>
          <div class="ml-2 text-sm">Yes, it is my work.</div>
        </label>
      </div>

      <div class="mt-6">
        <label for="description" class="block font-bold text-lg"
          >Primary Swatch Card</label>
        <small
          class="block mt-1 text-xs md:text-sm font-light text-gray-500 mb-3">
          This will set it up as the swatch that appears first in search results
          & palettes. Ideally, it will really show off the color.
        </small>
        <label for="setAsPrimary" class="flex">
          <div
            class="relative rounded-full w-12 h-6 transition duration-200 ease-linear {setAsPrimary
              ? 'bg-green-400'
              : 'bg-gray-400'}">
            <label
              for="toggle"
              class="absolute left-0 bg-white border-2 mb-2 w-6 h-6 rounded-full transition transform duration-100 ease-linear cursor-pointer {setAsPrimary
                ? 'translate-x-full border-green-400'
                : 'translate-x-0 border-gray-400'}" />
            <input
              type="checkbox"
              id="setAsPrimary"
              name="setAsPrimary"
              disabled={disableSetAsPrimary}
              class="appearance-none w-full h-full active:outline-none focus:outline-none"
              on:click={() => (setAsPrimary = !setAsPrimary)} />
          </div>
          <div class="ml-2 text-sm">Yes, set as primary.</div>
        </label>
      </div>

      <div class="mt-6">
        <label for="description" class="block font-bold text-lg"
          >Swatch Tests</label>
        <small
          class="block mt-1 text-xs md:text-sm font-light text-gray-500 mb-3">
          Check off each type of test you've included in your swatch.
        </small>
        {#await swatchTypesPromise}
          <p>Loading swatch test types...</p>
        {:then swatchTypes}
          <div class="grid grid-cols-1 md:grid-cols-2">
            {#each swatchTypes as swatchType}
              <div class="flex items-start mb-2">
                <input
                  class="mt-1 mr-2 block accent-lime-600 hover:accent-lime-600"
                  type="checkbox"
                  id="swatchtype-{swatchType.id}"
                  value={swatchType.name}
                  bind:group={swatchCardNames}
                  on:change={updateSwatchCardNames} />
                <label for="swatchtype-{swatchType.id}">
                  <span class="font-medium">{swatchType.label}</span>
                  <span class="block text-sm font-light text-gray-500"
                    >{swatchType.description}</span>
                </label>
              </div>
            {/each}
          </div>
        {:catch error}
          <p>Something went wrong! {error}</p>
        {/await}
      </div>
      <div class="mt-6">
        <h3 class="font-bold text-lg">Paper Used</h3>
        <div class="lg:flex lg:justify-between">
          <div class="my-3 lg:my-0">
            <label
              for="paperManufacturerName"
              class="block text-sm font-light text-gray-700">
              Manufacturer
            </label>
            {#await manufacturerPromise}
              <p>Loading manufacturers...</p>
            {:then manufacturers}
              <select
                id="paperManufacturerName"
                name="paperManufacturerName"
                bind:value={paperManufacturer.name}
                on:change={updateLineOptions}
                class="mt-1 block w-full py-2 px-3 border-2 border-black focus:outline-none focus:ring-lime-500 focus:border-lime-500">
                <option value={undefined} />
                {#each manufacturers as manufacturer}
                  <option value={manufacturer.name}>
                    {manufacturer.name}
                  </option>
                {/each}
              </select>
            {:catch error}
              <p>Could not load manufacturers: {error}</p>
            {/await}

            {#await lineOptions then lineOpts}
              {#if lineOpts.length > 0}
                <div class="mt-3">
                  <label
                    for="paperLineId"
                    class="block text-sm font-light text-gray-700">
                    Line
                  </label>
                  <select
                    id="paperLineId"
                    name="paperLineId"
                    class="mt-1 block w-full py-2 px-3 border-2 border-black focus:outline-none focus:ring-lime-500 focus:border-lime-500"
                    bind:value={paperLine.id}>
                    <option value={undefined} />
                    {#each lineOpts as lineOption}
                      <option value={lineOption.id}>
                        {lineOption.name}
                      </option>
                    {/each}
                  </select>
                </div>
              {/if}
            {/await}
          </div>

          <div class="my-3 lg:my-0">
            <label
              for="paperTypeId"
              class="block text-sm font-light text-gray-700">
              Paper Type
            </label>
            {#await paperTypePromise}
              <p>Loading paper types...</p>
            {:then paperTypes}
              <select
                id="paperLineId"
                name="paperLineId"
                class="mt-1 block w-full py-2 px-3 border-2 border-black focus:outline-none focus:ring-lime-500 focus:border-lime-500"
                bind:value={paperType.id}>
                <option value={undefined} />
                {#each paperTypes as paperTypeOption}
                  <option value={paperTypeOption.id}>
                    {paperTypeOption.name}
                  </option>
                {/each}
              </select>
            {:catch error}
              <p>Could not load paper types: {error}</p>
            {/await}
          </div>
          <div class="my-3 lg:my-0">
            <label
              for="paperWeight"
              class="block text-sm font-light text-gray-700">
              Paper Weight in Lbs
            </label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <input
                class="border-2 border-black focus:outline-none focus:ring-lime-500 focus:border-lime-500 block w-full p-2 pr-10 sm:text-sm"
                type="number"
                id="paperWeight"
                name="paperWeight"
                placeholder="0"
                bind:value={paperWeightInLbs} />
              <div
                class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span class="text-gray-500 sm:text-sm"> lbs. </span>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6">
          <label for="description" class="block font-bold text-lg"
            >Further Information</label>
          <small
            class="block mt-1 text-xs md:text-sm font-light text-gray-500 mb-3">
            Is there any additional information you'd like to include? This will
            be published along with your swatch.
          </small>
          <textarea
            class="mt-1 block w-full py-2 px-3 border-2 border-black focus:outline-none focus:ring-lime-500 focus:border-lime-500"
            id="description"
            name="description"
            placeholder="Description"
            bind:value={description} />
        </div>
      </div>
    {/if}
    <div
      class="mt-6 py-3 text-right border-t border-black flex justify-between items-center">
      <button
        type="submit"
        class="pop px-3 py-2 text-lg"
        on:click={() => dispatch('cancel')}>Cancel</button>

      {#if imageKitUpload.thumbnailUrl}
        <button
          type="submit"
          class="pop px-6 py-4 text-2xl hover:text-pink-500">
          {action} Swatch
        </button>
      {/if}
    </div>
  </div>
</form>
