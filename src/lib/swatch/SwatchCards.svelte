<script>
  export let swatchCardData;
</script>

<section class="swatch-cards">
  {#each swatchCardData as swatchCard}
    <div class="swatch-card">
      <img src="https://placekitten.com/250/150" alt={swatchCard.description} />
      <div class="meta">
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

<style>
  .swatch-cards {
    display: flex;
    flex-wrap: wrap;
  }

  .swatch-card {
    padding: 10px;
    border: 1px solid black;
    margin: 10px;
    flex-grow: 1;
    width: 250px;
    flex-basis: 250px;
  }
  .meta {
    font-size: 0.8rem;
  }
  p {
    margin: 0;
  }
</style>
