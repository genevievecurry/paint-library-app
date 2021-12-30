<script lang="ts">
  import { generateUrl } from '$lib/utility';

  export let paint;
  export let index;

  function randomDimension() {
    const dimensions = [300, 350, 400, 500, 600];
    return dimensions[Math.floor(Math.random() * dimensions.length)];
  }
</script>

<div class="table border border-black p-3 break-inside mb-3 w-full" data-num={index + 1}>
  <a href={generateUrl({prefix: 'paint', target: paint})} class="h-full flex flex-col">
    <div class="flex-1">
      <div
        class="w-full block"
        style={`background-color: ${
          paint.hex
        }; height: ${randomDimension()}px`}>
        <!-- To-do: Figure out how to pull in a swatch image, if there is one. -->
      </div>
    </div>
    <div class="mt-2">
      <span class="block font-medium">{paint.manufacturer.name}</span>
      <span class="block text-sm">{index} {paint.name}</span>
    </div>
  </a>
</div>