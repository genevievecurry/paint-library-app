<script>
  export let communityDescription;
	export let manufacturerDescription;
	export let manufacturerPigmentDescription;
	export let manufacturerName;
</script>

<section class="description">
  {#if manufacturerDescription}
  <div>
    <h2>Manufacturer Description</h2>
    <span>From {manufacturerName}:</span>
    <div>{@html manufacturerDescription}</div>
    <div>{manufacturerPigmentDescription}</div>
  </div>
  {/if}

  {#if communityDescription}
  <div>
    <h2>Community Description</h2>
    <div>{@html communityDescription}</div>
  </div>
  {/if}
</section>

<style>
  .description {
    padding: 10px;
		border: 1px solid black;
		margin: 10px;
  }
</style>