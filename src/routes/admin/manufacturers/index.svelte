<script context="module" lang="ts">
  export async function load({ session, fetch, url }) {
    if (session.user?.role === 'ADMIN' && session.user?.status === 'ACTIVE') {
      const response = await fetch('/admin/manufacturers.json');
      const { pathname } = url;
      if (response.ok) {
        return {
          props: {
            manufacturers: await response.json(),
            pathname,
          },
        };
      }

      return {
        status: response.status,
        error: new Error('Could not load.'),
      };
    } else {
      return { redirect: '/', status: 302 };
    }
  }
</script>

<script lang="ts">
  import Header from '$lib/components/Header.svelte';
  import { timeAgo } from '$lib/utility';
  import { generateUrl } from '$lib/generate';

  export let manufacturers;
  export let pathname: string;
</script>

<Header title="Manufacturers" {pathname} />

<section>
  <table class="table-auto border-collapse w-full text-sm mb-10">
    <thead>
      <tr class="border-b-2 border-black">
        <td class="p-1"><input type="checkbox" /></td>
        <td class="font-bold p-1">ID</td>
        <td class="font-bold p-1">Name</td>
        <td class="font-bold p-1 text-center">Paint</td>
        <td class="font-bold p-1 text-center">Paper</td>
        <td class="font-bold p-1">Created</td>
        <td />
      </tr>
    </thead>
    <tbody>
      {#each manufacturers as manufacturer}
        <tr class="border-b border-gray-300">
          <td class="p-1 align-top"><input type="checkbox" /></td>
          <td class="p-1 align-top">{manufacturer.id}</td>
          <td class="p-1 whitespace-nowrap align-top">
            {manufacturer.name}
          </td>
          <td class="p-1 align-top text-center">
            {manufacturer.sellPaint ? 'Yes' : 'No'}
          </td>
          <td class="p-1 align-top text-center">
            {manufacturer.sellPaper ? 'Yes' : 'No'}</td>
          <td class="p-1 whitespace-nowrap align-top"
            >{timeAgo(manufacturer.createdAt)}</td>
          <td class="p-1 whitespace-nowrap align-top">
            <a
              href={`/admin/manufacturers/${manufacturer.slug}`}
              class="decorate-link">Edit</a>
            |
            <a
              href={generateUrl({
                prefix: 'manufacturer',
                target: manufacturer,
              })}
              class="decorate-link">View</a>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</section>
