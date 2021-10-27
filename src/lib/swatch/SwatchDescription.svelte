<script>
  export let communityDescription;
	export let manufacturerDescription;
	export let manufacturerPigmentDescription;
	export let manufacturerName;
</script>

<section>
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