<script context="module">
  export async function load({ page, session, fetch }) {
    const url = `/@${page.params.username}.json`;
    const response = await fetch(url);

    if (response.ok) {
      return {
        props: {
          userData: await response.json(),
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
  import { afterUpdate } from 'svelte';
  import Header from '$lib/components/Header.svelte';
  import Section from './_Section.svelte';

  export let userData;

  $: user = userData;

</script>

<div class="container mx-auto px-4 sm:px-6">
  <Header title={user.username} />

  <Section _count={user._count}>
    <slot />
  </Section>
</div>
