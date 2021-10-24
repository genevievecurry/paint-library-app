<script>
	const swatchImage = {
		paper: {
			manufacturer: 'arches', 
			description: 'cold press', 
			weight_in_lbs: 130
		},
		swatch_type: 'gradient wash granulation',
		author: {display_name: 'jane doe'},
		custom_swatch_type: null,
		description: 'some notes about this particular image',
		image_url: 'http://placekitten.com/200/300'
	}
</script>
<div class="swatch-image">
	<img src={swatchImage.image_url} alt={swatchImage.description} />
	<div class="meta">
		<p>
			{swatchImage.swatch_type || swatchImage.custom_swatch_type}
		</p>
		{#if swatchImage?.description}
			<p>
				{swatchImage.description}
			</p>
		{/if}
		<p>
			Paper: {swatchImage.paper.description} ({swatchImage.paper.weight_in_lbs})  by {swatchImage.paper.manufacturer}
		</p>
		<p>
			Uploaded by {swatchImage.author.display_name}
		</p>
	</div>
</div>

<style>
	.swatch-image {
		padding: 10px;
	}
	.meta{
		font-size: .8rem;
	}
	p{
		margin: 0;
	}
</style>
