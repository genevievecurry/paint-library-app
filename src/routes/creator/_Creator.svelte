<script lang="ts">
  import { goto } from '$app/navigation';
  import { generateSlug } from '$lib/slug';
  import type { Manufacturer } from '@prisma/client';

  let manufacturerPromise: Promise<Manufacturer[]> = getModel('manufacturer');
  let pigmentPromise: Promise<Pigment[]> = getModel('pigment');
  let lightfastRatingPromise: Promise<LightfastRating[]> =
    getModel('lightfastRating');
  let transparencyRatingPromise: Promise<TransparencyRating[]> =
    getModel('transparencyRating');
  let stainingRatingPromise: Promise<StainingRating[]> =
    getModel('stainingRating');
  let granulationRatingPromise: Promise<GranulationRating[]> =
    getModel('granulationRating');

  let slug: string;

  // Todo: Handle waiting UI
  // let publishing = false;

  async function getModel(model: string) {
    const res = await fetch(`/model/${model}.json`);

    if (res.ok) {
      return res.json();
    } else {
      throw new Error('granulation rating: nope on that'); // Todo: do better
    }
  }

  function updateSlug(event: any) {
    slug = generateSlug({ value: event.target.value, uuid: false });
  }

  function onsubmit() {
    // publishing = true;
  }

  async function onresponse(res: any): Promise<void> {
    if (res.ok) {
      return res.json();
    }
    // Todo: Handle when things go wrong?
  }

  async function routeToNewPaint(){
    goto(`/paint/${slug}`);
  }

  function submit(node: HTMLFormElement): SvelteActionReturnType {
    const handler = async (event: Event) => {
      const body =
        node.method === 'post' || node.method === 'put'
          ? new FormData(node)
          : null;
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
      const newPaint = await onresponse(response);

      if(newPaint.slug){
        goto(`/paint/${newPaint.uuid}/${newPaint.slug}`);
      }
    };
    node.addEventListener('submit', handler);

    return {
      destroy() {
        node.removeEventListener('submit', handler);
      },
    };
  }
</script>

<h1 class="font-extrabold text-4xl">Add a Paint</h1>

<form action="paint/create.json" method="post" use:submit>
  <fieldset class="mt-10">
    <div class="grid grid-cols-6 gap-6">
      <div class="col-span-6 sm:col-span-3">
        <label for="name" class="block font-extrabold text-2xl"
          >Color</label>
        <p class="text-sm text-gray-500">
          Representational default. Don't worry, you can upload something nicer
          on the next screen.</p>
        <input
          type="color"
          name="hex"
          id="hex"
          value="#FFFFFF"
          class="mt-1 block w-full border border-black focus:outline-none focus:ring-green-400 focus:border-green-400" />
      </div>
    </div>
  </fieldset>
  <fieldset class="mt-10">
    <div class="grid grid-cols-6 gap-6">
      <div class="col-span-6 sm:col-span-3">
        <label for="name" class="block font-extrabold text-2xl">
          Color Name</label>
        <p class="text-sm text-gray-500">
          This should be the name of the product as determined by the
          manufacturer.
        </p>
        <input
          type="text"
          on:keyup={updateSlug}
          id="name"
          name="name"
          class="mt-1 block w-full py-2 px-3 border border-black focus:outline-none focus:ring-green-400 focus:border-green-400" />
      </div>
      <div class="col-span-6 sm:col-span-3">
        <span class="block font-extrabold text-2xl">Slug</span>
        <p class="text-sm text-gray-500">
          This will be auto-generated for optimal uniqueness.
        </p>
        <input
          type="text"
          bind:value={slug}
          readonly
          id="slug"
          name="slug"
          class="mt-1 block w-full py-2 px-3 border border-gray-300 text-gray-500 focus:outline-none" />
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
              value={1} />
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
              value={1} />

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
          <label for="manufacturerId" class="block text-sm text-gray-500">
            Manufacturer
          </label>
          {#await manufacturerPromise}
            <p>Loading manufacturers...</p>
          {:then manufacturers}
            <select
              id="manufacturerId"
              name="manufacturerId"
              class="mt-1 block w-full py-2 px-3 border border-black focus:outline-none focus:ring-green-400 focus:border-green-400">
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
          <label
            for="manufacturerDescription"
            class="block text-sm text-gray-500">Manufacturer Description</label>
          <textarea
            id="manufacturerDescription"
            name="manufacturerDescription"
            class="mt-2 block w-full py-2 px-3 border border-black focus:outline-none focus:ring-green-400 focus:border-green-400" />
        </div>

        <div class="mt-6">
          <label
            for="manufacturerPigmentDescription"
            class="block text-sm text-gray-500">
            Manufacturer Pigment Description</label>
          <textarea
            id="manufacturerPigmentDescription"
            name="manufacturerPigmentDescription"
            class="mt-2 block w-full py-2 px-3 border border-black focus:outline-none focus:ring-green-400 focus:border-green-400" />
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
          <label for="communityDescription" class="block text-sm text-gray-500">
            Is there another common description of this paint?</label>
          <textarea
            id="communityDescription"
            name="communityDescription"
            class="mt-2 block w-full py-2 px-3 border border-black focus:outline-none focus:ring-green-400 focus:border-green-400" />
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
          <label for="pigments" class="block text-sm text-gray-500">
            Pigments
          </label>
          {#await pigmentPromise}
            <p>Loading pigments...</p>
          {:then pigments}
            <select
              multiple
              id="pigments"
              name="pigments"
              class="mt-1 block w-full py-2 px-3 border border-black focus:outline-none focus:ring-green-400 focus:border-green-400">
              {#each pigments as pigment}
                <option value={pigment.id}>
                  {pigment.slug}
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
    <div>
      <legend class="font-extrabold text-2xl">Ratings</legend>
    </div>
    <div class="grid grid-cols-6 gap-6">
      <div class="col-span-6 sm:col-span-3">
        <!-- Lightfast Rating -->
        <div class="mt-6">
          <label for="granulationRatingId" class="block text-sm text-gray-500">
            Lightfastness
          </label>
          {#await lightfastRatingPromise}
            <p>Loading options...</p>
          {:then lightfastRatings}
            <select
              id="lightfastRatingId"
              name="lightfastRatingId"
              class="mt-1 block w-full py-2 px-3 border border-black focus:outline-none focus:ring-green-400 focus:border-green-400">
              {#each lightfastRatings as lightfastRating}
                <option value={lightfastRating.id}>
                  {lightfastRating.label} -
                  {lightfastRating.description}
                </option>
              {/each}
            </select>
          {:catch error}
            <p>Something went wrong! {error}</p>
          {/await}
        </div>
        <!-- Transparency Rating -->
        <div class="mt-6">
          <label for="transparencyRatingId" class="block text-sm text-gray-500">
            Transparency
          </label>
          {#await transparencyRatingPromise}
            <p>Loading options...</p>
          {:then transparencyRatings}
            <select
              id="transparencyRatingId"
              name="transparencyRatingId"
              class="mt-1 block w-full py-2 px-3 border border-black focus:outline-none focus:ring-green-400 focus:border-green-400">
              {#each transparencyRatings as transparencyRating}
                <option value={transparencyRating.id}>
                  {transparencyRating.label} -
                  {transparencyRating.description}
                </option>
              {/each}
            </select>
          {:catch error}
            <p>Something went wrong! {error}</p>
          {/await}
        </div>
        <!-- Staining Rating -->
        <div class="mt-6">
          <label for="stainingRatingId" class="block text-sm text-gray-500">
            Staining
          </label>
          {#await stainingRatingPromise}
            <p>Loading options...</p>
          {:then stainingRatings}
            <select
              id="stainingRatingId"
              name="stainingRatingId"
              class="mt-1 block w-full py-2 px-3 border border-black focus:outline-none focus:ring-green-400 focus:border-green-400">
              {#each stainingRatings as stainingRating}
                <option value={stainingRating.id}>
                  {stainingRating.label}
                </option>
              {/each}
            </select>
          {:catch error}
            <p>Something went wrong! {error}</p>
          {/await}
        </div>
        <!-- Granulation Rating -->
        <div class="mt-6">
          <label for="granulationRatingId" class="block text-sm text-gray-500">
            Granulation
          </label>
          {#await granulationRatingPromise}
            <p>Loading options...</p>
          {:then granulationRatings}
            <select
              id="granulationRatingId"
              name="granulationRatingId"
              class="mt-1 block w-full py-2 px-3 border border-black focus:outline-none focus:ring-green-400 focus:border-green-400">
              {#each granulationRatings as granulationRating}
                <option value={granulationRating.id}>
                  {granulationRating.label}
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

  <div class="mt-6 px-4 py-3 text-right sm:px-6 border-t border-black">
    <button
      type="submit"
      class="inline-flex justify-center py-2 px-4 border-4 border-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 font-extrabold text-2xl">
      Save
    </button>
  </div>
</form>
