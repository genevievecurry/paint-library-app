<script>
  export let swatchCardData;
</script>

<section class="flex space-x-2">
  {#each swatchCardData as swatchCard}
    <div class="border border-black">
      <img src="https://placekitten.com/450/250" alt="{swatchCard.description}" />
      <div class="meta hidden">
        <p>
          <strong>Swatch Type: {swatchCard.swatchCardType?.label || 'Custom'}</strong>
          {#if swatchCard.swatchCardType?.description}({swatchCard.swatchCardType.description}){/if}
        </p>

        {#if swatchCard?.description}
          <p>
            {swatchCard.description}
          </p>
        {/if}
        <p>
          Paper: {swatchCard.paper.description} ({swatchCard.paper.weightInLbs}) by {swatchCard
            .paper.manufacturer.name}
        </p>
        <p>
          Uploaded by {swatchCard.author.displayName}
        </p>
      </div>
    </div>
  {/each}
</section>
