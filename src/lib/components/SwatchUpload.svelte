<script lang="ts">
  import { createEventDispatcher, onDestroy } from 'svelte';
  import { session } from '$app/stores';
  import { connect } from '$lib/utility';
  import { goto } from '$app/navigation';
  import imagekit from '$lib/config/imagekit';
  import type { Manufacturer } from '@prisma/client';
  import Dropzone from './Dropzone.svelte';

  export let paintUuid: string;
  export let paintSlug: string;
  export let swatchCard: SwatchCardComponent = null;

  // Form data
  let author = swatchCard?.author || $session.user;
  let id = swatchCard?.id || null;
  let paper = swatchCard?.paper || {
    id: null,
    manufacturerId: null,
    weightInLbs: null,
    lineId: null,
    paperTypeId: null,
    manufacturerName: null,
  };
  let swatchCardNamesFormData = [];
  let tags = swatchCard?.tags || [];
  let imageKitUpload = swatchCard?.imageKitUpload || {
    fileId: null,
    filePath: null,
    name: null,
    thumbnailUrl: null,
    url: null,
    height: null,
    width: null,
  };
  let description = swatchCard?.description || null;

  // Promises
  let swatchTypesPromise: Promise<any> = getModel('swatchCardType');
  let manufacturerPromise: Promise<Manufacturer[]> = getModel('manufacturer');
  let paperTypePromise: Promise<PaperType[]> = getModel('paperType');
  let lineOptions: Promise<Line[]> = getLines();

  let swatchCardNames = [];
  let userImageUpload: any;
  let endpoint: string, action: string;
  let dropzoneError = '';
  let fileName = '';

  const dispatch = createEventDispatcher();
  const success = () => dispatch('success');

  if (swatchCard?.swatchCardTypesOnSwatchCard) {
    swatchCard.swatchCardTypesOnSwatchCard.map((elem) => {
      swatchCardNames.push(elem.swatchCardType.name);
    });
  }

  if (id !== null) {
    action = 'Update';
    endpoint = `/paint/${paintUuid}/swatch.json`;
  } else {
    action = 'Contribute';
    endpoint = `/paint/${paintUuid}/swatch.json`;
  }

  $: formData = {
    author: author,
    id: id,
    paper: paper,
    swatchCardNamesFormData: swatchCardNamesFormData,
    tags: tags,
    imageKitUpload: imageKitUpload,
    description: description,
  };

  $: lineOptions = [];

  function updateSwatchCardNames() {
    swatchCardNamesFormData = [];
    swatchCardNames.map((name) => {
      swatchCardNamesFormData.push({ swatchCardTypeName: name });
    });
  }

  async function updateLineOptions() {
    lineOptions = await getLines();
  }

  // todo... maybe utility?
  async function getModel(model: string) {
    const res = await fetch(`/model/${model}.json`);

    if (res.ok) {
      return res.json();
    }
  }

  async function getLines() {
    let url;
    if (paper?.manufacturerName) {
      url = `/model/line.json?manufacturerName=${paper.manufacturerName}`;
    } else {
      url = '/model/line.json';
    }

    const res = await fetch(url);

    if (res.ok) {
      return res.json();
    }
  }

  // Todo: Move this into a utility - duplicated in _Creator.svelte
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
          // Todo: Handle error
          console.log(err);
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
  }

  onDestroy(() => {
    userImageUpload = null;
    dropzoneError = '';
    fileName = '';
  });

  const onChange = (e) => {
    const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    fileName = file.name;
    userImageUpload = file;

    uploadImage();
  };

  async function submit(node: HTMLFormElement) {
    const handler = async (event: Event) => {
      event.preventDefault();
      const promise = await handlePost();

      if (promise.id) {
        $session.notification = {
          type: 'success',
          visible: true,
          message: `
          Hoorah! Swatch was ${action}d successfully.
          `,
        };

        goto(`/paint/${paintUuid}/${paintSlug}`);
        success();
      }
    };
    node.addEventListener('submit', handler);

    return {
      update() {},
      destroy() {
        node.removeEventListener('submit', handler);
        window.location.reload();
      },
    };
  }
</script>

<form use:submit>
  <div>
    <Dropzone
      title="Drag and drop your swatch from your computer; or"
      fileTitle={fileName}
      error={userImageUpload == null ? dropzoneError : ''}
      imagePreview={imageKitUpload.thumbnailUrl === null
        ? null
        : imageKitUpload.thumbnailUrl}
      bind:this={userImageUpload}
      on:drop={onChange}
      on:change={onChange} />

    {#if imageKitUpload.thumbnailUrl}
      <div class="mt-6">
        <label for="description" class="block font-bold text-lg"
          >Swatch Tests</label>
        <small
          class="leading-5 block mt-1 text-sm font-light text-gray-500 mb-3">
          Check off each type of test you've included in your swatch.
        </small>
        {#await swatchTypesPromise}
          <p>Loading swatch test types...</p>
        {:then swatchTypes}
          <div class="grid grid-cols-2">
            {#each swatchTypes as swatchType}
              <div class="flex items-start mb-2">
                <input
                  class="mt-1 mr-2 block"
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
        <div class="flex justify-between">
          <div>
            <label
              for="paperManufacturerId"
              class="block text-sm font-light text-gray-700">
              Manufacturer
            </label>
            {#await manufacturerPromise}
              <p>Loading manufacturers...</p>
            {:then manufacturers}
              <select
                id="paperManufacturerId"
                name="paperManufacturerId"
                bind:value={paper.manufacturerName}
                on:change={updateLineOptions}
                class="mt-1 block w-full py-2 px-3 border border-black focus:outline-none focus:ring-green-400 focus:border-green-400">
                {#each manufacturers as manufacturer}
                  <option value={manufacturer.name}>
                    {manufacturer.name}
                  </option>
                {/each}
              </select>
            {:catch error}
              <p>Something went wrong! {error}</p>
            {/await}

            {#await lineOptions then lineOpts}
              {#if lineOpts.length > 0}
                <div>
                  <label
                    for="paperLineId"
                    class="block text-sm font-light text-gray-700">
                    Line
                  </label>
                  <select
                    id="paperLineId"
                    name="paperLineId"
                    class="mt-1 block w-full py-2 px-3 border border-black focus:outline-none focus:ring-green-400 focus:border-green-400"
                    bind:value={paper.lineId}>
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

          <div>
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
                class="mt-1 block w-full py-2 px-3 border border-black focus:outline-none focus:ring-green-400 focus:border-green-400"
                bind:value={paper.paperTypeId}>
                {#each paperTypes as paperTypeOption}
                  <option value={paperTypeOption.id}>
                    {paperTypeOption.name}
                  </option>
                {/each}
              </select>
            {:catch error}
              <p>Something went wrong! {error}</p>
            {/await}
          </div>
          <div>
            <label
              for="paperWeight"
              class="block text-sm font-light text-gray-700">
              Paper Weight in Lbs
            </label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <input
                class="border border-black focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2 pr-10 sm:text-sm"
                type="text"
                id="paperWeight"
                name="paperWeight"
                placeholder="0"
                bind:value={paper.weightInLbs} />
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
            class="leading-5 block mt-1 text-sm font-light text-gray-500 mb-3">
            Is there any additional information you'd like to include? This will
            be published along with your swatch.
          </small>
          <textarea
            class="mt-1 block w-full py-2 px-3 border border-black focus:outline-none focus:ring-green-400 focus:border-green-400"
            id="description"
            name="description"
            placeholder="Description"
            bind:value={description} />
        </div>
      </div>
    {/if}
    <div class="mt-6 py-3 text-right border-t border-black">
      <button type="submit" class="pop px-6 py-4 text-2xl hover:text-pink-500">
        {action} Swatch
      </button>
    </div>
  </div>
</form>
