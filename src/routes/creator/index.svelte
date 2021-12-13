<script context="module" lang="ts">
  export async function load({ session }) {
    if (session.user?.role === 'ADMIN' && session.user?.status === 'ACTIVE') {
      return {};
    } else {
      return { redirect: '/', status: 302 };
    }
  }
</script>

<script lang="ts">
  import Creator from './_Creator.svelte';
</script>

<Creator />
