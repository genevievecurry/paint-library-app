<script context="module">
  export async function load({ page, session, fetch }) {
    const url = `/@${page.params.userSlug}.json`;
    const response = await fetch(url);

    if (response.ok) {
      return {
        props: {
          user: await response.json(),
          editable: false,
        },
      };
    }

    return {
      status: response.status,
      error: new Error('Could not load.'),
    };
  }
</script>

<script lang="ts">
  import Header from '$lib/components/Header.svelte';
  import Section from './_Section.svelte';

  export let user;
  export let editable: boolean;

  let section;

  const { displayName, _count, savedPalettes, ownedPalettes } = user;
</script>

<div class="container mx-auto px-4 sm:px-6">
  <Header title={displayName} />

  <Section {_count}>
    <slot />
  </Section>
</div>
