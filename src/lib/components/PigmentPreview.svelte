<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { closeIcon } from '$lib/icons';
  export let pigment: Pigment;
  export let selected: boolean;

  const dispatch = createEventDispatcher();

  $: pigment = pigment;

  function handleSelection() {
    dispatch('select', pigment);
  }
</script>

<div
  class="cursor-pointer mb-2 w-full border border-gray-400 p-1 relative"
  on:click={handleSelection}>
  <div class="flex items-stretch">
    <div class="w-8 mr-2">
      <div
        class="aspect-w-16 aspect-h-16"
        style={`background-color: ${pigment.hex}; color: ${pigment.hex}`} />
    </div>

    <div class="max-w-full">
      <div class="block text-sm leading-tight font-bold flex-grow"
        >{pigment.slug}</div>
      <div
        class="pigment-name text-xxs leading-none mt-px overflow-hidden text-ellipsis  whitespace-nowrap mr-3">
        {pigment.name}
      </div>
    </div>
  </div>

  <div
    class="absolute right-1 top-1"
    title={selected ? 'Remove from Paint' : 'Add to Paint'}>
    {#if selected}
      {@html closeIcon('h-4 w-4')}
    {:else}
      +
    {/if}
  </div>
</div>

<style>
  .pigment-name {
    max-width: 120px;
  }
</style>
