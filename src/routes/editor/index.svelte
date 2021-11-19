<script>
  import Editor from './_Editor.svelte';

  let tempSwatch = {
    productColorName: 'Some random name',
    slug: 'some-random-new-slug',
    authorId: 1,
    paintTypeId: 1,
    lightfastRatingId: 1,
    transparencyRatingId: 1,
    stainingRatingId: 1,
    granulationRatingId: 1,
    manufacturerId: 1,
    manufacturerDescription: 'default manufacturer description',
    communityDescription: 'default community description',
    manufacturerPigmentDescription: 'default manufacturer pigment description',
    pigments: [],
    tags: [],
    swatchCards: [
      {
        paperId: 1,
        authorId: 1,
        description: '',
        imageKitUpload: {}
      }
    ],
  };
</script>

<Editor swatch="{tempSwatch}" />
