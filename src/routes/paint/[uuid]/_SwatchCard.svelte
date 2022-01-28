<script lang="ts">
  import { session } from '$app/stores';
  import { onMount, createEventDispatcher } from 'svelte';
  import Modal from '$lib/components/Modal.svelte';
  import Dialog from '$lib/components/Dialog.svelte';
  import { removeIcon, editIcon, adminIcon } from '$lib/icons';
  import { connect } from '$lib/utility';
  import { successNotifier, warningNotifier } from '$lib/notifier';

  export let swatchCard: SwatchCardComponent;
  export let alignment: string;
  export let paintName: string;
  export let paintHex: string;
  export let paintUuid: string;

  const {
    id,
    updatedAt,
    swatchCardTypesOnSwatchCard,
    paperManufacturer,
    paperLine,
    paperType,
    paperWeightInLbs,
    author,
    description,
    imageKitUpload,
  } = swatchCard;

  const dispatch = createEventDispatcher();

  let showSwatchCardModal = false;
  let showDeleteSwatchDialog = false;
  let editable = false;

  let swatchCardClasses: string;
  let aspectRatioClasses: string;

  onMount(() => {
    if ($session.user) {
      if ($session.user.role === 'ADMIN') editable = true;
      if (author) {
        if (author.uuid === $session.user.uuid) editable = true;
      }
    }
  });

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

  async function deleteSwatch() {
    const response = await connect({
      method: 'DELETE',
      endpoint: `/paint/${paintUuid}/swatch.json?id=${id}`,
    });

    if (response.ok) {
      showSwatchCardModal = false;
      showDeleteSwatchDialog = false;
      dispatch('deleteCard', true);
      successNotifier(`Successfully deleted swatch.`);
    } else {
      showSwatchCardModal = false;
      showDeleteSwatchDialog = false;
      warningNotifier(
        `Uh oh, there was a problem deleting swatch. ${response.statusText}.`,
      );
    }
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

{#if showDeleteSwatchDialog && editable}
  <Dialog
    on:close={() => (showDeleteSwatchDialog = false)}
    on:confirm={deleteSwatch}>
    <span slot="title">Are you sure you want to delete this swatch?</span>
    <p slot="confirmationText">
      This cannot be undone. The good news is that you can easily make another
      swatch just like it if you have regrets!</p>
  </Dialog>
{/if}

{#if showSwatchCardModal}
  <Modal on:close={() => (showSwatchCardModal = false)} title={paintName}>
    <div class="col-span-12 flex">
      <div>
        <img
          class="max-w-full"
          src={imageKitUpload?.url}
          alt="{paintName} Swatch"
          title="{paintName} Swatch" />
      </div>
      <div class="ml-10">
        {#if description}
          <h3 class="text-lg font-bold my-2">Description</h3>
          <div class="text-sm">{@html description}</div>
          <hr class="my-3" />
        {/if}

        {#if paperManufacturer?.name || paperType?.name}
          <h3 class="text-lg font-bold my-2">Paper</h3>
          <div class="text-sm">
            {paperLine?.name ? paperLine?.name : ''}
            {paperType?.name ? paperType?.name : ''}
            {paperWeightInLbs ? `${paperWeightInLbs} lb.` : ''}
            {paperManufacturer?.name ? `by ${paperManufacturer?.name}` : ''}
          </div>
          <hr class="my-3" />
        {/if}

        {#if swatchCardTypesOnSwatchCard.length > 0}
          <h3 class="text-lg font-bold my-2">Includes Tests</h3>
          <ul class="">
            {#each swatchCardTypesOnSwatchCard as item}
              <li class="mb-1">
                <span class="font-bold text-sm"
                  >{item.swatchCardType.label}</span>
                <p class="text-xs">{item.swatchCardType.description}</p>
              </li>
            {/each}
          </ul>
          <hr class="my-3" />
        {/if}

        {#if author}
          <p class="text-xs mt-2 leading-tight my-2"
            >Contributed by @<a href="/@{author.username}" class="decorate-link"
              >{author?.username}</a>
            {#if author.role === 'ADMIN'}
              {@html adminIcon('h-3 w-3 inline-block')}
            {/if}
            {timeAgo()}.</p>
        {:else}
          <p class="text-xs mt-2 leading-tight">Uploaded {timeAgo()}.</p>
        {/if}
        {#if $session.user}
          {#if editable}
            <button
              class="pop inline-flex justify-center py-1 px-2 text-xs mt-2"
              on:click={() => dispatch('setSwatchCard', swatchCard)}
              on:click={() => (showSwatchCardModal = false)}>
              {@html editIcon('h-5 w-5 mr-1')}
              Edit</button>
            <button
              class="pop inline-flex justify-center py-1 px-2 text-xs mt-2 text-orange-600"
              on:click={() => (showDeleteSwatchDialog = true)}>
              {@html removeIcon('h-5 w-5 mr-1')}
              Delete</button>
          {/if}
        {/if}
      </div>
    </div>
  </Modal>
{/if}
<div
  class={`cursor-pointer border-2 border-black p-1 relative ${swatchCardClasses}`}
  on:click={() => (showSwatchCardModal = true)}>
  <div class={aspectRatioClasses}>
    <div
      class="h-full w-full bg-cover bg-center"
      style={`background-image: url(${imageKitUpload?.url}); background-color: ${paintHex}`} />
  </div>
</div>
