<script>
  import { goto } from '$app/navigation';
  import { generateSlug } from '$lib/utils';
  import Tags from "svelte-tags-input";

  export let swatch;

  let manufacturerPromise = getManufacturers();
  let pigmentPromise = getPigments();
  let tagPromise = getTags();

  // Todo: Handle waiting UI
  let publishing = false;

  async function getManufacturers() {
    const res = await fetch(`/editor/manufacturer.json`);

    if (res.ok) {
      return res.json();
    } else {
      throw new Error('manufacturers: ruh-roh');
    }
  }

  async function getPigments() {
    const res = await fetch(`/editor/pigment.json`);

    if (res.ok) {
      return res.json();
    } else {
      throw new Error('pigments: nope on that'); // Todo: do better
    }
  }

  async function getTags() {
    const res = await fetch(`/editor/tag.json`);

    if (res.ok) {
      return res.json();
    } else {
      throw new Error('tags: not happening');
    }
  }

  // Todo update these monsters 
  const lightfastRatings = [
    { value: 1, label: 'Unknown', description: '' },
    { value: 2, label: 'I', description: '- Excellent' },
    { value: 3, label: 'II', description: '- Very Good' },
    { value: 4, label: 'III', description: '- Fair' },
    { value: 5, label: 'IV', description: '- Poor' },
    { value: 6, label: 'V', description: '- Very Poor' },
  ];

  const transparencyRatings = [
    { value: 1, label: 'Unknown', description: '' },
    { value: 2, label: '1', description: '- Opaque' },
    { value: 3, label: '2', description: '- Semi-opaque' },
    { value: 4, label: '3', description: '- Semi-transparent' },
    { value: 5, label: '4', description: '- Transparent' },
  ];

  const stainingRatings = [
    { value: 1, label: 'Unknown', description: '' },
    { value: 2, label: 'High-Staining', description: '' },
    { value: 3, label: 'Medium-Staining', description: '' },
    { value: 4, label: 'Low-Staining', description: '' },
    { value: 5, label: 'Non-Staining', description: '' },
  ];

  function handleTags(event) {
    // console.log(event.detail.tags)
    // swatch.tags = event.detail.tags;

    swatch.tags = event.detail.tags.map(tag => {
      if(typeof(tag) === 'object'){
        return tag
      } else {
        return {
          label: tag,
          slug: generateSlug({value: tag}),
        }
      }
    })
  }

  function setRatingLabel(ratings, value) {
    const result = ratings.filter((object) => object.value == value);
    return result ? `${result[0].label} ${result[0].description}` : null;
  }

  function onChangeValue(event) {
    swatch[event.target.name] = Number(event.target.value);
  }

  function onClickLabel(event) {
    swatch[event.target.dataset.name] = Number(event.target.dataset.value);
  }

  function updateSlug(event) {
    swatch.slug = generateSlug({value: event.target.value, uuid: true});
  }

  const onsubmit = () => {
    publishing = true;
  };

  const onresponse = async (res) => {
    if (res.ok) {
      goto(`/swatch/${swatch.slug}`);
    }
    // Todo: Handle when things go wrong?
  };

  const noop = () => {};

  async function ajax(node, { onsubmit = noop, onresponse = noop }) {
    const handler = async (event) => {
      const body = node.method === 'post' || node.method === 'put' ? new FormData(node) : null;
      event.preventDefault();
      onsubmit();

      const response = await fetch(node.action, {
        method: node.method,
        body,
        headers: {
          accept: 'application/json',
        },
      });

      // @ts-ignore
      onresponse(response);
    };
    node.addEventListener('submit', handler);

    return {
      destroy() {
        node.removeEventListener('submit', handler);
      },
    };
  }
</script>

<h1 class="font-extrabold text-4xl">Create a New Swatch</h1>
<!-- <form 
  on:submit|preventDefault={submit}
> -->
<form action="swatch/create.json" method="post" use:ajax="{{ onsubmit, onresponse }}">

  {#await tagPromise}
    <p>Loading tags...</p>
  {:then tags}

    <Tags
      on:tags={handleTags}
      autoComplete={tags}
      autoCompleteKey={"label"}
    />
  {#each swatch.tags as tag}
    <p>{tag} - {tag.id} - {tag.slug} - {tag.label} </p>
  {/each}

{:catch error}
  <p>Something went wrong! {error}</p>
{/await}

  

  <fieldset class="mt-10">
    <div class="grid grid-cols-6 gap-6">
      <div class="col-span-6 sm:col-span-3">
        <label for="productColorName" class="block font-extrabold text-2xl">Color Name</label>
        <p class="text-sm text-gray-500"
          >This should be the name of the product as determined by the manufacturer.
        </p>
        <input
          type="text"
          bind:value="{swatch.productColorName}"
          on:keyup="{updateSlug}"
          id="productColorName"
          name="productColorName"
          class="mt-1 block w-full py-2 px-3 border border-black focus:outline-none focus:ring-green-400 focus:border-green-400"
        />
      </div>
      <div class="col-span-6 sm:col-span-3">
        <span class="block font-extrabold text-2xl">Slug</span>
        <p class="text-sm text-gray-500">This will be auto-generated for optimal uniqueness. </p>
        <input
          type="text"
          bind:value="{swatch.slug}"
          readonly
          id="slug"
          name="slug"
          class="mt-1 block w-full py-2 px-3 border border-gray-300 text-gray-500 focus:outline-none"
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
            <input
              id="author1"
              name="authorId"
              type="radio"
              class="focus:ring-green-400 focus:border-green-400 border-gray-300 mr-3"
              bind:group="{swatch.authorId}"
              value="{swatch.authorId}"
              on:change="{onChangeValue}"
            />
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
            <input
              id="paintType1"
              name="paintTypeId"
              type="radio"
              class="focus:ring-green-400 focus:border-green-400 border-gray-300 mr-3"
              bind:group="{swatch.paintTypeId}"
              value="{swatch.paintTypeId}"
              on:change="{onChangeValue}"
            />

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
              bind:value="{swatch.manufacturerId}"
              on:change="{onChangeValue}"
              class="mt-1 block w-full py-2 px-3 border border-black focus:outline-none focus:ring-green-400 focus:border-green-400"
            >
              {#each manufacturers as manufacturer}
                <option value="{manufacturer.id}">
                  {manufacturer.name}
                </option>
              {/each}
            </select>
          {:catch error}
            <p>Something went wrong! {error}</p>
          {/await}
        </div>

        <div class="mt-6">
          <label for="manufacturerDescription" class="block text-sm text-gray-500"
            >Manufacturer Description</label
          >
          <textarea
            bind:value="{swatch.manufacturerDescription}"
            id="manufacturerDescription"
            name="manufacturerDescription"
            class="mt-2 block w-full py-2 px-3 border border-black focus:outline-none focus:ring-green-400 focus:border-green-400"
          ></textarea>
        </div>

        <div class="mt-6">
          <label for="manufacturerPigmentDescription" class="block text-sm text-gray-500"
            >Manufacturer Pigment Description</label
          >
          <textarea
            bind:value="{swatch.manufacturerPigmentDescription}"
            id="manufacturerPigmentDescription"
            name="manufacturerPigmentDescription"
            class="mt-2 block w-full py-2 px-3 border border-black focus:outline-none focus:ring-green-400 focus:border-green-400"
          ></textarea>
        </div>
      </div>
    </div>
  </fieldset>

  <fieldset class="mt-10 pt-10 border-t border-black">
    <div>
      <legend class="font-extrabold text-2xl">Community</legend>
    </div>
    <div class="grid grid-cols-6 gap-6">
      <div class="col-span-6 sm:col-span-3">
        <div class="mt-6">
          <label for="communityDescription" class="block text-sm text-gray-500"
            >Is there another common description of this paint?</label
          >
          <textarea
            bind:value="{swatch.communityDescription}"
            id="communityDescription"
            name="communityDescription"
            class="mt-2 block w-full py-2 px-3 border border-black focus:outline-none focus:ring-green-400 focus:border-green-400"
          ></textarea>
        </div>
      </div>
    </div>
  </fieldset>

  <fieldset class="mt-10 pt-10 border-t border-black">
    <div>
      <legend class="font-extrabold text-2xl">Pigment Information</legend>
    </div>
    <div class="grid grid-cols-6 gap-6">
      <div class="col-span-6 sm:col-span-3">
        <div class="mt-6">
          <label for="pigments" class="block text-sm text-gray-500">Pigments</label>
          {#await pigmentPromise}
            <p>Loading pigments...</p>
          {:then pigments}
            <select
              multiple
              id="pigments"
              name="pigments"
              bind:value="{swatch.pigments}"
              class="mt-1 block w-full py-2 px-3 border border-black focus:outline-none focus:ring-green-400 focus:border-green-400"
            >
              {#each pigments as pigment}
                <option value="{pigment.id}">
                  {pigment.name}
                </option>
              {/each}
            </select>
          {:catch error}
            <p>Something went wrong! {error}</p>
          {/await}
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
        <span class="font-extrabold text-2xl"
          >{setRatingLabel(lightfastRatings, swatch.lightfastRatingId)}</span
        >
      </div>
    </div>
    <input
      class="min-w-full"
      type="range"
      min="{1}"
      max="{6}"
      value="{swatch.lightfastRatingId}"
      name="lightfastRatingId"
      id="lightfastRatingId"
      on:change="{onChangeValue}"
    />
    <div class="flex min-w-full justify-between">
      <div
        class="w-5 p-1 text-center cursor-pointer"
        data-value="{1}"
        data-name="lightfastRatingId"
        on:click="{onClickLabel}">?</div
      >
      <div
        class="w-5 p-1 text-center cursor-pointer"
        data-value="{2}"
        data-name="lightfastRatingId"
        on:click="{onClickLabel}">I</div
      >
      <div
        class="w-5 p-1 text-center cursor-pointer"
        data-value="{3}"
        data-name="lightfastRatingId"
        on:click="{onClickLabel}">II</div
      >
      <div
        class="w-5 p-1 text-center cursor-pointer"
        data-value="{4}"
        data-name="lightfastRatingId"
        on:click="{onClickLabel}">III</div
      >
      <div
        class="w-5 p-1 text-center cursor-pointer"
        data-value="{5}"
        data-name="lightfastRatingId"
        on:click="{onClickLabel}">IV</div
      >
      <div
        class="w-5 p-1 text-center cursor-pointer"
        data-value="{6}"
        data-name="lightfastRatingId"
        on:click="{onClickLabel}">V</div
      >
    </div>
  </fieldset>

  <fieldset class="mt-10 pt-10 border-t border-black">
    <div class="grid grid-cols-6 gap-6 mb-3">
      <div class="col-span-6 sm:col-span-3">
        <legend class="font-extrabold text-2xl">Opacity/Transparency</legend>
        <p class="text-sm text-gray-500">How transparent?</p>
      </div>
      <div class="col-span-6 sm:col-span-3">
        <span class="font-extrabold text-2xl"
          >{setRatingLabel(transparencyRatings, swatch.transparencyRatingId)}</span
        >
      </div>
    </div>
    <input
      class="min-w-full"
      type="range"
      min="{1}"
      max="{5}"
      value="{swatch.transparencyRatingId}"
      name="transparencyRatingId"
      id="transparencyRatingId"
      on:change="{onChangeValue}"
    />
    <div class="flex min-w-full justify-between">
      <div
        class="w-5 p-1 text-center cursor-pointer"
        data-value="{1}"
        data-name="transparencyRatingId"
        on:click="{onClickLabel}">?</div
      >
      <div
        class="w-5 p-1 text-center cursor-pointer"
        data-value="{2}"
        data-name="transparencyRatingId"
        on:click="{onClickLabel}">1</div
      >
      <div
        class="w-5 p-1 text-center cursor-pointer"
        data-value="{3}"
        data-name="transparencyRatingId"
        on:click="{onClickLabel}">2</div
      >
      <div
        class="w-5 p-1 text-center cursor-pointer"
        data-value="{4}"
        data-name="transparencyRatingId"
        on:click="{onClickLabel}">3</div
      >
      <div
        class="w-5 p-1 text-center cursor-pointer"
        data-value="{5}"
        data-name="transparencyRatingId"
        on:click="{onClickLabel}">4</div
      >
    </div>
  </fieldset>

  <fieldset class="mt-10 pt-10 border-t border-black">
    <div class="grid grid-cols-6 gap-6 mb-3">
      <div class="col-span-6 sm:col-span-3">
        <legend class="font-extrabold text-2xl">Staining</legend>
        <p class="text-sm text-gray-500">Does it stain?</p>
      </div>
      <div class="col-span-6 sm:col-span-3">
        <span class="font-extrabold text-2xl"
          >{setRatingLabel(stainingRatings, swatch.stainingRatingId)}</span
        >
      </div>
    </div>
    <input
      class="min-w-full"
      type="range"
      min="{1}"
      max="{5}"
      value="{swatch.stainingRatingId}"
      name="stainingRatingId"
      id="stainingRatingId"
      on:change="{onChangeValue}"
    />
    <div class="flex min-w-full justify-between">
      <div
        class="w-5 p-1 text-center cursor-pointer"
        data-value="{1}"
        data-name="stainingRatingId"
        on:click="{onClickLabel}">?</div
      >
      <div class="w-5 relative">
        <span
          data-value="{2}"
          data-name="stainingRatingId"
          on:click="{onClickLabel}"
          class="p-1 cursor-pointer absolute block transform -translate-x-2/4 left-1/2">High</span
        >
      </div>
      <div class="w-5 relative">
        <span
          data-value="{3}"
          data-name="stainingRatingId"
          on:click="{onClickLabel}"
          class="p-1 cursor-pointer absolute block transform -translate-x-2/4 left-1/2">Medium</span
        >
      </div>
      <div class="w-5 relative">
        <span
          data-value="{4}"
          data-name="stainingRatingId"
          on:click="{onClickLabel}"
          class="p-1 cursor-pointer absolute block transform -translate-x-2/4 left-1/2">Low</span
        >
      </div>
      <div class="w-5 relative">
        <span
          data-value="{5}"
          data-name="stainingRatingId"
          on:click="{onClickLabel}"
          class="p-1 cursor-pointer absolute block transform -translate-x-2/4 ">Non</span
        >
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
          <input
            id="granulationRating1"
            name="granulationRatingId"
            type="radio"
            class="focus:ring-green-400 h-4 w-4 text-green-400 border-gray-300 mr-3"
            value="{1}"
            on:change="{onChangeValue}"
            bind:group="{swatch.granulationRatingId}"
          />
          Unknown
        </label>
      </div>
      <div class="flex items-center">
        <label class="cursor-pointer">
          <input
            name="granulationRatingId"
            type="radio"
            class="focus:ring-green-400 h-4 w-4 text-green-400 border-gray-300 mr-3"
            value="{2}"
            on:change="{onChangeValue}"
            bind:group="{swatch.granulationRatingId}"
          />
          Yes
        </label>
      </div>
      <div class="flex items-center">
        <label class="cursor-pointer">
          <input
            id="granulationRating3"
            name="granulationRatingId"
            type="radio"
            class="focus:ring-green-400 h-4 w-4 text-green-400 border-gray-300 mr-3"
            value="{3}"
            on:change="{onChangeValue}"
            bind:group="{swatch.granulationRatingId}"
          />
          No
        </label>
      </div>
    </div>
  </fieldset>

  <div class="mt-6 px-4 py-3 text-right sm:px-6 border-t border-black">
    <button
      type="submit"
      class="inline-flex justify-center py-2 px-4 border-4 border-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 font-extrabold text-2xl"
    >
      Save
    </button>
  </div>
</form>
