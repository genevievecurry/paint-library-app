<script lang="ts">
  import { createEventDispatcher, onDestroy } from 'svelte';
  import { circleCheckmarkIcon } from '$lib/icons';
  import { warningNotifier } from '$lib/notifier';

  export let lightfastRating: LightfastRating;
  export let transparencyRating: TransparencyRating;
  export let stainingRating: StainingRating;
  export let granulationRating: GranulationRating;

  const dispatch = createEventDispatcher();

  let lightfastRatingPromise: Promise<LightfastRating[]> =
    getModel('lightfastRating');
  let transparencyRatingPromise: Promise<TransparencyRating[]> =
    getModel('transparencyRating');
  let stainingRatingPromise: Promise<StainingRating[]> =
    getModel('stainingRating');
  let granulationRatingPromise: Promise<GranulationRating[]> =
    getModel('granulationRating');

  let formData = {
    lightfastRatingId: lightfastRating.id,
    transparencyRatingId: transparencyRating.id,
    stainingRatingId: stainingRating.id,
    granulationRatingId: granulationRating.id,
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

  function submit() {
    dispatch('update', 'Paint ratings have been saved.');
    dispatch('ratingFormData', formData);
  }

  onDestroy(() => {
    formData = {
      lightfastRatingId: null,
      transparencyRatingId: null,
      stainingRatingId: null,
      granulationRatingId: null,
    };
  });
</script>

<!-- Lightfast Rating -->
<div>
  <h2 class="font-bold text-2xl">Lightfastness</h2>
  {#await lightfastRatingPromise}
    <p>Loading options...</p>
  {:then lightfastRatings}
    <table
      class="table-auto border-collapse border border-gray-400 mt-4 w-full">
      {#each lightfastRatings as rating, index}
        <tr
          class="cursor-pointer hover:bg-lime-100"
          class:selected={formData.lightfastRatingId === rating.id}
          on:click={() => (formData.lightfastRatingId = rating.id)}>
          <td class="border border-gray-400 px-2 py-2">
            <label class="flex cursor-pointer" for={rating.id + rating.code}>
              <input
                type="radio"
                id={rating.id + rating.code}
                bind:group={formData.lightfastRatingId}
                class="hidden"
                data-index={index}
                value={rating.id} />
              {#if rating.code !== 'X'}
                <div
                  class="border-2 border-black font-bold px-1 mx-2 w-full text-center"
                  >{rating.code}</div>
              {:else}
                <div
                  class="border-2 border-gray-400 font-bold px-1 mx-2 w-full text-center text-gray-500"
                  >?</div>
              {/if}
            </label>
          </td>
          <td class="border border-gray-400 px-2 py-2 w-full">
            <div class="flex">
              <span class="rating-label">{rating.label}</span>
              <span class="rating-selected-icon"
                >{@html circleCheckmarkIcon()}</span>
            </div>
            <p class="rating-description">{rating.description}</p>
          </td>
        </tr>
      {/each}
    </table>
  {:catch error}
    <p>Something went wrong! {error}</p>
  {/await}
</div>

<!-- Transparency Rating -->
<div class="mt-10">
  <h2 class="font-bold text-2xl">Transparency</h2>
  {#await transparencyRatingPromise}
    <p>Loading options...</p>
  {:then transparencyRatings}
    <table
      class="table-auto border-collapse border border-gray-400 mt-4 w-full">
      {#each transparencyRatings as rating, index}
        <tr
          class="cursor-pointer hover:bg-lime-100"
          class:selected={formData.transparencyRatingId === rating.id}
          on:click={() => (formData.transparencyRatingId = rating.id)}>
          <td class="border border-gray-400 px-2 py-2">
            <label class="flex" for={rating.id + rating.code}>
              <input
                type="radio"
                id={rating.id + rating.code}
                bind:group={formData.transparencyRatingId}
                class="hidden"
                data-index={index}
                value={rating.id} />
              {#if rating.code !== 'X'}
                <div
                  class="border-2 border-black font-bold px-1 mx-2 w-full text-center"
                  >{rating.code}</div>
              {:else}
                <div
                  class="border-2 border-gray-400 font-bold px-1 mx-2 w-full text-center text-gray-500"
                  >?</div>
              {/if}
            </label>
          </td>
          <td class="border border-gray-400 px-2 py-2 w-full">
            <div class="flex">
              <span class="rating-label">{rating.label}</span>
              <span class="rating-selected-icon"
                >{@html circleCheckmarkIcon()}</span>
            </div>
            <p class="rating-description">{rating.description}</p>
          </td>
        </tr>
      {/each}
    </table>
  {:catch error}
    <p>Something went wrong! {error}</p>
  {/await}
</div>

<!-- Staining Rating -->
<div class="mt-10">
  <h2 class="font-bold text-2xl">Staining</h2>
  {#await stainingRatingPromise}
    <p>Loading options...</p>
  {:then stainingRatings}
    <table
      class="table-auto border-collapse border border-gray-400 mt-4 w-full">
      {#each stainingRatings as rating, index}
        <tr
          class="cursor-pointer hover:bg-lime-100"
          class:selected={formData.stainingRatingId === rating.id}
          on:click={() => (formData.stainingRatingId = rating.id)}>
          <td class="border border-gray-400 px-2 py-2">
            <label class="flex" for={rating.id + rating.code}>
              <input
                type="radio"
                id={rating.id + rating.code}
                bind:group={formData.stainingRatingId}
                class="hidden"
                data-index={index}
                value={rating.id} />
              {#if rating.code !== 'X'}
                <div
                  class="border-2 border-black font-bold px-1 mx-2 w-full text-center"
                  >{rating.code}</div>
              {:else}
                <div
                  class="border-2 border-gray-400 font-bold px-1 mx-2 w-full text-center text-gray-500"
                  >?</div>
              {/if}
            </label>
          </td>
          <td class="border border-gray-400 px-2 py-2 w-full">
            <div class="flex">
              <span class="rating-label">{rating.label}</span>
              <span class="rating-selected-icon"
                >{@html circleCheckmarkIcon()}</span>
            </div>
            <p class="rating-description">{rating.description}</p>
          </td>
        </tr>
      {/each}
    </table>
  {:catch error}
    <p>Something went wrong! {error}</p>
  {/await}
</div>

<!-- Granulation Rating -->
<div class="mt-10">
  <h2 class="font-bold text-2xl">Granulation</h2>
  {#await granulationRatingPromise}
    <p>Loading options...</p>
  {:then granulationRatings}
    <table
      class="table-auto border-collapse border border-gray-400 mt-4 w-full">
      {#each granulationRatings as rating, index}
        <tr
          class="cursor-pointer hover:bg-lime-100"
          class:selected={formData.granulationRatingId === rating.id}
          on:click={() => (formData.granulationRatingId = rating.id)}>
          <td class="border border-gray-400 px-2 py-2 relative">
            <label class="flex" for={rating.id + rating.code}>
              <input
                type="radio"
                id={rating.id + rating.code}
                bind:group={formData.granulationRatingId}
                class="hidden"
                data-index={index}
                value={rating.id} />
              {#if rating.code !== 'X'}
                <div
                  class="border-2 border-black font-bold px-1 mx-2 w-full text-center"
                  >{rating.code}</div>
              {:else}
                <div
                  class="border-2 border-gray-400 font-bold px-1 mx-2 w-full text-center text-gray-500"
                  >?</div>
              {/if}
            </label>
          </td>
          <td class="border border-gray-400 px-2 py-2 w-full">
            <div class="flex">
              <span class="rating-label">{rating.label}</span>
              <span class="rating-selected-icon"
                >{@html circleCheckmarkIcon()}</span>
            </div>
            <p class="rating-description">{rating.description}</p>
          </td>
        </tr>
      {/each}
    </table>
  {:catch error}
    <p>Something went wrong! {error}</p>
  {/await}
</div>

<div class="mt-6 pt-3 text-right border-t border-gray-400">
  <button on:click={submit} class="pop px-6 py-4 text-2xl hover:text-pink-500">
    Update Ratings
  </button>
</div>

<style>
  .selected {
    @apply bg-teal-200;
  }

  .selected .rating-label {
    @apply font-bold;
  }

  .rating-description {
    @apply text-gray-500 font-light text-sm;
  }

  .selected .rating-description {
    @apply text-black;
  }

  .rating-selected-icon {
    @apply hidden ml-2;
  }

  .selected .rating-selected-icon {
    @apply inline-block;
  }
</style>
