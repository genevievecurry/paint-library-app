<script lang="ts">
  import { session } from '$app/stores';
  import { getContext, createEventDispatcher } from 'svelte';
  import Modal from '$lib/components/Modal.svelte';

  export let swatchCard: SwatchCardComponent;
  export let alignment: string;

  const {
    id,
    updatedAt,
    swatchCardTypesOnSwatchCard,
    paper,
    author,
    description,
    imageKitUpload,
  } = swatchCard;

  const dispatch = createEventDispatcher();
  const paintName: string = getContext('paintName');

  let showSwatchCardModal = false;
  // let saving = false; // Todo handle waiting state
  // let papers = []; // Todo fix paper problems

  let swatchCardClasses;
  let aspectRatioClasses;

  if (alignment === 'square') {
    swatchCardClasses = 'col-span-1 row-span-1';
    aspectRatioClasses = 'aspect-w-16 aspect-h-16';
  } else if (alignment === 'vertical') {
    swatchCardClasses = 'col-span-1 row-span-1 md:row-span-2';
    aspectRatioClasses = 'aspect-w-16 md:aspect-w-8 aspect-h-16';
  } else if (alignment === 'horizontal') {
    swatchCardClasses = 'col-span-1 md:col-span-2 row-span-1';
    aspectRatioClasses = 'aspect-w-16 aspect-h-16 md:aspect-h-8';
  }

  const timeAgo = () => {
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const now = new Date();
    const updated = new Date(updatedAt);

    const secondsBetween = Math.abs(Number(updated) - Number(now)) / 1000;
    const minutesBetween = Math.floor(secondsBetween / 60);
    const hoursBetween = Math.floor(secondsBetween / (60 * 60));
    const daysBetween = Math.floor(secondsBetween / (60 * 60 * 24));

    if (daysBetween === 0 && hoursBetween < 12 && hoursBetween > 0) {
      return rtf.format(-hoursBetween, 'hour');
    } else if (daysBetween === 0 && hoursBetween === 0) {
      return rtf.format(-minutesBetween, 'minute');
    }
    return rtf.format(-daysBetween, 'day');
  };
</script>

{#if showSwatchCardModal}
  <Modal
    on:close={() => (showSwatchCardModal = false)}
    title={paintName}
    fullWidth={true}>
    <div class="col-span-8">
      <img
        src={imageKitUpload.url}
        alt="{paintName} Swatch"
        title="{paintName} Swatch" />
    </div>
    <div class="col-span-4">
      {#if description}
        <h3 class="text-lg font-bold my-2">Description</h3>
        <div class="text-sm">{@html description}</div>
        <hr class="my-3" />
      {/if}
      {#if paper}
        <h3 class="text-lg font-bold my-2">Paper</h3>
        <div class="text-sm"
          >{paper.manufacturer ? paper.manufacturer.name : ''}
          <span class="font-medium">{paper.paperType.name}</span>
          ({paper.weightInLbs} lbs.)</div>
        <hr class="my-3" />
      {/if}
      {#if swatchCardTypesOnSwatchCard.length > 0}
        <h3 class="text-lg font-bold my-2">Includes Tests</h3>
        <ul class="">
          {#each swatchCardTypesOnSwatchCard as item}
            <li class="mb-1">
              <span class="font-bold text-sm">{item.swatchCardType.label}</span>
              <p class="text-xs">{item.swatchCardType.description}</p>
            </li>
          {/each}
        </ul>
        <hr class="my-3" />
      {/if}

      {#if author}
        <p class="text-xs mt-2 leading-tight my-2"
          >Contributed by <a href="/@{author.username}" class="link"
            >{author?.username}</a>
          {timeAgo()}.</p>
      {:else}
        <p class="text-xs mt-2 leading-tight">Uploaded {timeAgo()}.</p>
      {/if}
      {#if $session.user}
        {#if (author && author?.uuid === $session.user.uuid) || $session.user.role === 'ADMIN'}
          <button
            class="border border-black py-1 px-2 text-xs mt-2"
            on:click={() => dispatch('notify', swatchCard)}
            on:click={() => (showSwatchCardModal = false)}>Edit</button>
        {/if}
      {/if}
    </div>
  </Modal>
{/if}
<div
  class={`cursor-pointer border-2 border-black p-1 relative ${swatchCardClasses}`}
  on:click={() => (showSwatchCardModal = true)}>
  <div class={aspectRatioClasses}>
    <div
      class="h-full w-full bg-cover bg-center"
      style={`background-image: url(${imageKitUpload.url})`} />
  </div>
</div>
