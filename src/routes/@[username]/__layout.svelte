<script context="module">
  export async function load({ page, session, fetch }) {
    const url = `/@${page.params.username}.json`;
    const response = await fetch(url);

    if (response.ok) {
      return {
        props: {
          user: await response.json(),
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

  let section;

  const { username, _count, savedPalettes, ownedPalettes } = user;
</script>

<div class="container mx-auto px-4 sm:px-6">
  <Header title={username} />

  <Section {_count}>
    <slot />
  </Section>
</div>
