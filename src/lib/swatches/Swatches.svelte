<script>
	export let swatches;
</script>

<section class="swatches">
	{#each swatches as swatch}
		<div class="swatch">
			<img src={swatch.image_url} alt={swatch.description} />
			<div class="meta">
				<p>
					{swatch.swatch_type || swatch.custom_swatch_type}
				</p>
				{#if swatch?.description}
					<p>
						{swatch.description}
					</p>
				{/if}
				<p>
					Paper: {swatch.paper.description} ({swatch.paper.weight_in_lbs})  by {swatch.paper.manufacturer}
				</p>
				<p>
					Uploaded by {swatch.author.display_name}
				</p>
			</div>
		</div>
	{/each}
</section>


<style>
	.swatches{
		display: flex;
	}

	.swatch {
		padding: 10px;
	}
	.meta{
		font-size: .8rem;
	}
	p{
		margin: 0;
	}
</style>
