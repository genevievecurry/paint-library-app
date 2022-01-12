<script lang="ts">
  // Thanks https://github.com/brunomolteni/svelte-sortable-list for the starting point
  import { createEventDispatcher } from 'svelte';

  export let list;
  export let key: string;
  export let draggable: boolean;

  const getKey = (item) => (key ? item[key] : item);
  const dispatch = createEventDispatcher();

  let isOver = false;

  $: list = list;
  $: finalItem = getKey(list[list.length - 1]);
  $: hoverFinalItem = false;
  $: activeItem = -1;

  const getDraggedParent = (node) =>
    node.dataset && node.dataset.index
      ? node.dataset
      : getDraggedParent(node.parentNode);

  const start = (ev: Event) => {
    ev.dataTransfer.setData('source', ev.target.dataset.index);
    activeItem = ev.target.dataset.index;
  };

  const over = (ev: Event) => {
    ev.preventDefault();
    let dragged = getDraggedParent(ev.target);
    hoverFinalItem = ev.target.dataset.final;

    if (isOver !== dragged.id) {
      isOver = JSON.parse(dragged.id);
    } else {
      isOver = false;
    }
  };

  const drop = (ev: Event) => {
    isOver = false;
    ev.preventDefault();
    let dragged = getDraggedParent(ev.target);
    let from = Number(ev.dataTransfer.getData('source'));
    let to = Number(dragged.index);
    activeItem = -1;
    reorder({ from, to });
  };

  const reorder = ({ from, to }) => {
    let newList;
    if (hoverFinalItem) {
      // Move to very end of array
      newList = moveItem([...list], from, list.length - 1);
      list = newList;
    } else if (list.length === to + 1) {
      // Handles second to last position (before current last item)
      newList = moveItem([...list], from, list.length - 2);
      list = newList;
    } else {
      // All other positions
      newList = moveItem([...list], from, to);
      list = newList;
    }

    dispatch('sort', list);
  };

  function moveItem(arr, itemIndex, targetIndex) {
    // splice() returns the remove element as an array
    let itemRemoved = arr.splice(itemIndex, 1);
    // Insert itemRemoved into the target index
    arr.splice(targetIndex, 0, itemRemoved[0]);
    return arr;
  }
</script>

{#if list && list.length}
  {#each list as item, index (getKey(item))}
    <div
      class="col-span-1 grid grid-cols-1 gap-0"
      class:over={!hoverFinalItem && getKey(item) === isOver}
      data-index={index}
      data-id={JSON.stringify(getKey(item))}
      on:dragover={draggable && over}
      on:dragleave={() => (isOver = false)}
      on:dragend={() => (activeItem = -1)}
      on:drop={draggable && drop}>
      <div class="dropzone" />
      <div
        data-index={index}
        data-id={JSON.stringify(getKey(item))}
        {draggable}
        on:dragstart={draggable && start}
        class="item"
        class:dragged={Number(activeItem) === index}>
        <slot {item} {index}>
          <div class="block">{getKey(item)}</div>
        </slot>
      </div>
    </div>
  {/each}

  <div
    data-final={true}
    data-id={JSON.stringify(list[list.length - 1].id)}
    data-index={list.length - 1}
    class="dropzone-final"
    class:over={hoverFinalItem && finalItem === isOver}
    on:dragover={draggable && over}
    on:dragleave={() => (isOver = false)}
    on:drop={draggable && drop} />
{/if}

<style>
  .over {
    @apply col-span-2 grid-cols-2 gap-2;
  }

  .dragged {
    opacity: 0.25;
  }

  .item {
    @apply w-full h-full;
  }

  .dropzone {
    @apply hidden;
  }

  .dropzone-final {
    @apply block w-full h-full col-span-1;
  }

  .over .dropzone,
  .dropzone-final.over {
    @apply block w-full h-full border-2 border-dashed border-pink-300;
  }
</style>
