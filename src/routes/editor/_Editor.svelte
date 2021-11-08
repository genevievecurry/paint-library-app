<script context="module">
  export async function loadManufacturers(){
    const response = await fetch('/editor/manufacturer.json');

    if(response.ok){
      console.log("RESPONSE", response);
    }
  }

</script>

<script>
  import { post } from '$lib/utils';
  import { goto } from '$app/navigation';
  export let swatch;
  // export let lightfastRatingOptions;
  // export let transparencyRatingOptions;
  // export let stainingRatingOptions;
  // export let granulationRatingOptions;

  let manufacturerPromise = getManufacturers();

  async function getManufacturers(){
    const res = await fetch(`/editor/manufacturer.json`);
    
    if (res.ok) {
      return res.json()
    } else {
      throw new Error('ruh-roh')
    }
  }
  

  const lightfastRatings = [
    {value: 1, label: 'Unknown', description: '' },
    {value: 2, label: 'I', description: '- Excellent' },
    {value: 3, label: 'II', description: '- Very Good' },
    {value: 4, label: 'III', description: '- Fair' },
    {value: 5, label: 'IV', description: '- Poor' },
    {value: 6, label: 'V', description: '- Very Poor' },
  ]

  const transparencyRatings = [
    {value: 1, label: 'Unknown', description: '' },
    {value: 2, label: '1', description: '- Opaque' },
    {value: 3, label: '2', description: '- Semi-opaque' },
    {value: 4, label: '3', description: '- Semi-transparent' },
    {value: 5, label: '4', description: '- Transparent' },
  ]

  const stainingRatings = [
    {value: 1, label: 'Unknown', description: '' },
    {value: 2, label: 'High-Staining', description: '' },
    {value: 3, label: 'Medium-Staining', description: '' },
    {value: 4, label: 'Low-Staining', description: '' },
    {value: 5, label: 'Non-Staining', description: '' },
  ]

  function setRatingLabel(ratings, value) {
    const result = ratings.filter(object => object.value == value);
    return result ? `${result[0].label} ${result[0].description}` : null;
  }

  function onChangeValue(event) {
    swatch[event.target.name] = Number(event.target.value);
    console.log("onChange - SWATCH", swatch)
  }

  function onClickLabel(event) {
    swatch[event.target.dataset.name] = Number(event.target.dataset.value);
  }

	async function submit(event) {
		const response = await post(`swatch/create.json`, { swatch });
		// TODO handle network errors
		// errors = response.errors;
		if (response.status === 200) {
			goto('/swatch/${swatch.slug}');
		}
	}
</script>

<h1 class="font-extrabold text-4xl">Create a New Swatch</h1>
<form 
  on:submit|preventDefault={submit}
>
  <fieldset class="mt-10">
    <div class="grid grid-cols-6 gap-6">
      <div class="col-span-6 sm:col-span-3">
        <label for="productColorName" class="block font-extrabold text-2xl">Color Name</label>
        <p class="text-sm text-gray-500">This should be the name of the product as determined by the manufacturer. </p>
        <input
          type="text"
          bind:value={swatch.productColorName}
          id="productColorName"
          name="productColorName"
          class="mt-1 block w-full py-2 px-3 border border-black focus:outline-none focus:ring-green-400 focus:border-green-400"
        />
      </div>
      <div class="col-span-6 sm:col-span-3">
        <label for="slug" class="block font-extrabold text-2xl">Slug</label>
        <p class="text-sm text-gray-500">This will be auto-generated. </p>
        <input
          type="text"
          bind:value={swatch.slug}
          id="slug"
          name="slug"
          class="mt-1 block w-full py-2 px-3 border border-black focus:outline-none focus:ring-green-400 focus:border-green-400"
        />
      </div>
    </div>
  </fieldset>

  <div class="mt-10 grid grid-cols-6 gap-6">
    <fieldset class="col-span-6 sm:col-span-2">
      <div>
        <legend class="font-extrabold text-2xl">Author</legend>
      </div>
      <div class="mt-4 space-y-4">
        <div class="flex items-center">
          <label class="cursor-pointer">
          <input id="author1" name="authorId" type="radio" class="focus:ring-green-400 focus:border-green-400 border-gray-300 mr-3" bind:group={swatch.authorId} value={swatch.authorId} on:change="{onChangeValue}">
            Me
          </label>
        </div>
      </div>
    </fieldset>
    <fieldset class="col-span-6 sm:col-span-2">
      <div>
        <legend class="font-extrabold text-2xl">Paint Type</legend>
      </div>
      <div class="mt-4 space-y-4">
        <div class="flex items-center">
          <label class="cursor-pointer">
            <input id="paintType1" name="paintTypeId" type="radio" class="focus:ring-green-400 focus:border-green-400 border-gray-300 mr-3" bind:group={swatch.paintTypeId} value={swatch.paintTypeId} on:change="{onChangeValue}">

            Watercolor
          </label>
        </div>
      </div>
    </fieldset>
  </div>

  <fieldset class="mt-10 pt-10 border-t border-black">
    <div>
      <legend class="font-extrabold text-2xl">Manufacturer Information</legend>
    </div>
    <div class="grid grid-cols-6 gap-6">
      <div class="col-span-6 sm:col-span-3">
        <div class="mt-6">
          <label for="manufacturerId" class="block text-sm text-gray-500">Manufacturer</label>
          {#await manufacturerPromise}
            <p>Loading manufacturers...</p>
          {:then manufacturers}
            <select
              id="manufacturerId"
              name="manufacturerId"
              bind:value={swatch.manufacturerId}
              on:change="{onChangeValue}"
              class="mt-1 block w-full py-2 px-3 border border-black focus:outline-none focus:ring-green-400 focus:border-green-400"
            >
            {#each manufacturers as manufacturer}
              <option value={manufacturer.id}>
                {manufacturer.name}
              </option>
            {/each}
            </select>
          {:catch error}
            <p>Something went wrong! {error}</p>
          {/await}
        </div>

        <div class="mt-6">
          <label for="manufacturerDescription" class="block text-sm text-gray-500">Manufacturer Description</label>
          <textarea
            bind:value={swatch.manufacturerDescription}
            id="manufacturerDescription"
            name="manufacturerDescription"
            class="mt-2 block w-full py-2 px-3 border border-black focus:outline-none focus:ring-green-400 focus:border-green-400"
          ></textarea>
        </div>

        <div class="mt-6">
          <label for="manufacturerPigmentDescription" class="block text-sm text-gray-500">Manufacturer Pigment Description</label>
          <textarea
            bind:value={swatch.manufacturerPigmentDescription}
            id="manufacturerPigmentDescription"
            name="manufacturerPigmentDescription"
            class="mt-2 block w-full py-2 px-3 border border-black focus:outline-none focus:ring-green-400 focus:border-green-400"
          ></textarea>
        </div>
      </div>
    </div>
  </fieldset>


  <fieldset class="mt-10 pt-10 border-t border-black">
    <div class="grid grid-cols-6 gap-6 mb-3">
      <div class="col-span-6 sm:col-span-3">
        <legend class="font-extrabold text-2xl">Lightfastness</legend>
        <p class="text-sm text-gray-500">How lightfast is this?</p>
      </div>
      <div class="col-span-6 sm:col-span-3">
        <span class="font-extrabold text-2xl">{setRatingLabel(lightfastRatings, swatch.lightfastRatingId)}</span>
      </div>
    </div>
    <input class="min-w-full" type="range" min={1} max={6} value={swatch.lightfastRatingId} name="lightfastRatingId" id="lightfastRatingId" on:change="{onChangeValue}">
    <div class="flex min-w-full justify-between">
      <div class="w-5 p-1 text-center cursor-pointer" data-value={1} data-name="lightfastRatingId" on:click="{onClickLabel}">?</div>
      <div class="w-5 p-1 text-center cursor-pointer" data-value={2} data-name="lightfastRatingId" on:click="{onClickLabel}">I</div>
      <div class="w-5 p-1 text-center cursor-pointer" data-value={3} data-name="lightfastRatingId" on:click="{onClickLabel}">II</div>
      <div class="w-5 p-1 text-center cursor-pointer" data-value={4} data-name="lightfastRatingId" on:click="{onClickLabel}">III</div>
      <div class="w-5 p-1 text-center cursor-pointer" data-value={5} data-name="lightfastRatingId" on:click="{onClickLabel}">IV</div>
      <div class="w-5 p-1 text-center cursor-pointer" data-value={6} data-name="lightfastRatingId" on:click="{onClickLabel}">V</div>
    </div>
  </fieldset>

  <fieldset class="mt-10 pt-10 border-t border-black">
    <div class="grid grid-cols-6 gap-6 mb-3">
      <div class="col-span-6 sm:col-span-3">
        <legend class="font-extrabold text-2xl">Opacity/Transparency</legend>
        <p class="text-sm text-gray-500">How transparent?</p>
      </div>
      <div class="col-span-6 sm:col-span-3">
        <span class="font-extrabold text-2xl">{setRatingLabel(transparencyRatings, swatch.transparencyRatingId)}</span>
      </div>
    </div>
    <input class="min-w-full" type="range" min={1} max={5} value={swatch.transparencyRatingId} name="transparencyRatingId" id="transparencyRatingId" on:change="{onChangeValue}">
    <div class="flex min-w-full justify-between">
      <div class="w-5 p-1 text-center cursor-pointer" data-value={1} data-name="transparencyRatingId" on:click="{onClickLabel}">?</div>
      <div class="w-5 p-1 text-center cursor-pointer" data-value={2} data-name="transparencyRatingId" on:click="{onClickLabel}">1</div>
      <div class="w-5 p-1 text-center cursor-pointer" data-value={3} data-name="transparencyRatingId" on:click="{onClickLabel}">2</div>
      <div class="w-5 p-1 text-center cursor-pointer" data-value={4} data-name="transparencyRatingId" on:click="{onClickLabel}">3</div>
      <div class="w-5 p-1 text-center cursor-pointer" data-value={5} data-name="transparencyRatingId" on:click="{onClickLabel}">4</div>
    </div>
  </fieldset>

  <fieldset class="mt-10 pt-10 border-t border-black">
    <div class="grid grid-cols-6 gap-6 mb-3">
      <div class="col-span-6 sm:col-span-3">
        <legend class="font-extrabold text-2xl">Staining</legend>
        <p class="text-sm text-gray-500">Does it stain?</p>
      </div>
      <div class="col-span-6 sm:col-span-3">
        <span class="font-extrabold text-2xl">{setRatingLabel(stainingRatings, swatch.stainingRatingId)}</span>
      </div>
    </div>
    <input class="min-w-full" type="range" min={1} max={5} value={swatch.stainingRatingId} name="stainingRatingId" id="stainingRatingId" on:change="{onChangeValue}">
    <div class="flex min-w-full justify-between">
      <div class="w-5 p-1 text-center cursor-pointer" data-value={1} data-name="stainingRatingId" on:click="{onClickLabel}">?</div>
      <div class="w-5 relative">
        <span data-value={2} data-name="stainingRatingId" on:click="{onClickLabel}" class="p-1 cursor-pointer absolute block transform -translate-x-2/4 left-1/2">High</span>
      </div>
      <div class="w-5 relative">
        <span data-value={3} data-name="stainingRatingId" on:click="{onClickLabel}" class="p-1 cursor-pointer absolute block transform -translate-x-2/4 left-1/2">Medium</span>
      </div>
      <div class="w-5 relative">
        <span data-value={4} data-name="stainingRatingId" on:click="{onClickLabel}" class="p-1 cursor-pointer absolute block transform -translate-x-2/4 left-1/2">Low</span>
      </div>
      <div class="w-5 relative">
        <span data-value={5} data-name="stainingRatingId" on:click="{onClickLabel}" class="p-1 cursor-pointer absolute block transform -translate-x-2/4 ">Non</span>
      </div>
    </div>
  </fieldset>


  <fieldset class="mt-10 pt-10 border-t border-black">
    <div>
      <legend class="font-extrabold text-2xl">Granulation</legend>
      <p class="text-sm text-gray-500">Is it granulated?</p>
    </div>
    <div class="mt-4 space-y-4">
      <div class="flex items-center">
        <label class="cursor-pointer">
          <input id="granulationRating1" name="granulationRatingId" type="radio" class="focus:ring-green-400 h-4 w-4 text-green-400 border-gray-300 mr-3" value={1} on:change="{onChangeValue}" bind:group={swatch.granulationRatingId}>
          Unknown
        </label>
      </div>
      <div class="flex items-center">
        <label class="cursor-pointer">
          <input name="granulationRatingId" type="radio" class="focus:ring-green-400 h-4 w-4 text-green-400 border-gray-300 mr-3" value={2} on:change="{onChangeValue}" bind:group={swatch.granulationRatingId}>
          Yes
        </label>
      </div>
      <div class="flex items-center">
        <label class="cursor-pointer">
          <input id="granulationRating3" name="granulationRatingId" type="radio" class="focus:ring-green-400 h-4 w-4 text-green-400 border-gray-300 mr-3" value={3} on:change="{onChangeValue}" bind:group={swatch.granulationRatingId}>
          No
        </label>
      </div>
    </div>
  </fieldset>


  <div class="mt-6 px-4 py-3 text-right sm:px-6 border-t border-black">
    <button type="submit" class="inline-flex justify-center py-2 px-4 border-4 border-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 font-extrabold text-2xl">
      Save
    </button>
  </div>
</form>
