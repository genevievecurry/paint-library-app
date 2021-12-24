<script context="module">
  export async function load({ page, session, fetch }) {
    const url = `/member/${page.params.uuid}.json`;
    const response = await fetch(url);

    if (response.ok) {
      return {
        status: 302,
        redirect: `/member/${page.params.uuid}/${response.slug}/palettes`,
      };
    }

    return {
      status: response.status,
      error: new Error('Could not load.'),
    };
  }
</script>
