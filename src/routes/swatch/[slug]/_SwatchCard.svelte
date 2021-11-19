<script>
  export let createdAt;
  export let updatedAt;
  export let swatchCardType;
  export let paper;
  export let author;
  export let description;
  export let imageKitUpload;
  export let size;
</script>

<div class="swatch-card border border-black p-1 m-1 relative">
  <div class=" overflow-hidden" style="{`height: ${size}px;`}">
    {#if imageKitUpload}
      <img src="{imageKitUpload?.url}" alt="" />
    {/if}
  </div>
  {#if swatchCardType}
    <div class="absolute left-0 bottom-0">
      <div class="bg-white inline-block p-1 text-sm">{swatchCardType?.label}</div>
      <div class="bg-white inline-block p-1 text-xs">{swatchCardType?.description}</div>
    </div>
  {/if}
</div>

<style>

</style>

<!-- 
granulation: {
  createdAt: '2021-11-18T23:45:45.682Z',
  updatedAt: '2021-11-18T23:45:45.686Z',
  swatchCardType: {
    id: 2,
    createdAt: '2021-11-18T23:45:45.638Z',
    updatedAt: '2021-11-18T23:45:45.638Z',
    name: 'GRANULATION',
    label: 'Granulation',
    description: 'Partical separation and texture in wet wash.'
  },
  paper: {
    manufacturer: [Object],
    description: 'Cold Press',
    weightInLbs: 140
  },
  author: {
    id: 2,
    createdAt: '2021-11-18T23:45:45.633Z',
    updatedAt: '2021-11-18T23:45:45.634Z',
    deleted: false,
    email: 'member@paintlibrary.foo',
    hashedPassword: 'password',
    displayName: 'Entity Member',
    role: 'MEMBER',
    status: 'ACTIVE'
  },
  description: 'This is a supercool wash, with extra awesome.',
  imageKitUpload: {
    id: 1,
    createdAt: '2021-11-18T23:45:45.660Z',
    updatedAt: '2021-11-18T23:45:45.660Z',
    fileId: 'test-id-string',
    filePath: 'kitten.jpg',
    name: 'kitten.jpg',
    thumbnailUrl: 'https://placekitten.com/50/50',
    url: 'https://placekitten.com/350/350'
  }
}, -->