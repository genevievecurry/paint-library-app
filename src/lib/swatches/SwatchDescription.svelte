<script>
  export let productDescription;
	export let manufacturerProductDescription;
	export let manufacturerPigmentDescription;
	export let manufacturerName;
</script>

<section>
  <div>
    <h2>Manufacturer Description</h2>
    <span>From {manufacturerName}:</span>
    <div>{@html manufacturerProductDescription}</div>
    <div>{manufacturerPigmentDescription}</div>
  </div>

  <div>
    <h2>Community Description</h2>
    <div>{@html productDescription}</div>
  </div>
</section>