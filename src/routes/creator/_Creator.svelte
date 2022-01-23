<script lang="ts">
  import { session } from '$app/stores';
  import { goto } from '$app/navigation';
  import { generateUrl, generateSlug } from '$lib/generate';
  import type { Manufacturer } from '@prisma/client';
  import { warningNotifier } from '$lib/notifier';

  let manufacturerPromise: Promise<Manufacturer[]> = getModel('manufacturer');
  let lightfastRatingPromise: Promise<LightfastRating[]> =
    getModel('lightfastRating');
  let transparencyRatingPromise: Promise<TransparencyRating[]> =
    getModel('transparencyRating');
  let stainingRatingPromise: Promise<StainingRating[]> =
    getModel('stainingRating');
  let granulationRatingPromise: Promise<GranulationRating[]> =
    getModel('granulationRating');

  let slug: string;

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

  function updateSlug(event: any) {
    slug = generateSlug({ value: event.target.value, uuid: false });
  }

  function onsubmit() {
    // publishing = true;
  }

  async function onresponse(res: any): Promise<void> {
    if (res.ok) {
      return res.json();
    } else {
      warningNotifier(res.statusText);
    }
    // Todo: Handle when things go wrong?
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

      if (newPaint.slug) {
        const url = generateUrl({ prefix: 'paint', target: newPaint });
        goto(url);
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
        <label for="name" class="block font-extrabold text-2xl">Color</label>
        <p class="text-sm text-gray-500">
          Representational default. Don't worry, you can upload something nicer
          on the next screen.</p>
        <input
          type="color"
          name="hex"
          id="hex"
          value="#FFFFFF"
          class="mt-1 block w-full border border-black focus:outline-none focus:ring-lime-500 focus:border-lime-500" />
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
          class="mt-1 block w-full py-2 px-3 border border-black focus:outline-none focus:ring-lime-500 focus:border-lime-500" />
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
              checked
              id="author1"
              name="authorUuid"
              type="radio"
              class="focus:ring-lime-500 focus:border-lime-500 border-gray-300 mr-3"
              value={$session.user.uuid} />
            {$session.user.username}
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
              checked
              id="paintType1"
              name="paintTypeId"
              type="radio"
              class="focus:ring-lime-500 focus:border-lime-500 border-gray-300 mr-3"
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
              class="mt-1 block w-full py-2 px-3 border border-black focus:outline-none focus:ring-lime-500 focus:border-lime-500">
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
            class="mt-2 block w-full py-2 px-3 border border-black focus:outline-none focus:ring-lime-500 focus:border-lime-500" />
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
            maxlength="500"
            id="communityDescription"
            name="communityDescription"
            class="mt-2 block w-full py-2 px-3 border border-black focus:outline-none focus:ring-lime-500 focus:border-lime-500" />
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
              class="mt-1 block w-full py-2 px-3 border border-black focus:outline-none focus:ring-lime-500 focus:border-lime-500">
              {#each lightfastRatings as lightfastRating}
                <option value={lightfastRating.id}>
                  {lightfastRating.code} -
                  {lightfastRating.label}
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
              class="mt-1 block w-full py-2 px-3 border border-black focus:outline-none focus:ring-lime-500 focus:border-lime-500">
              {#each transparencyRatings as transparencyRating}
                <option value={transparencyRating.id}>
                  {transparencyRating.code} -
                  {transparencyRating.label}
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
              class="mt-1 block w-full py-2 px-3 border border-black focus:outline-none focus:ring-lime-500 focus:border-lime-500">
              {#each stainingRatings as stainingRating}
                <option value={stainingRating.id}>
                  {stainingRating.code} - {stainingRating.label}
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
              class="mt-1 block w-full py-2 px-3 border border-black focus:outline-none focus:ring-lime-500 focus:border-lime-500">
              {#each granulationRatings as granulationRating}
                <option value={granulationRating.id}>
                  {granulationRating.code} -
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
      class="inline-flex justify-center py-2 px-4 border-4 border-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 font-extrabold text-2xl">
      Save
    </button>
  </div>
</form>
